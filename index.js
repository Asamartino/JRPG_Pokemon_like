import attacks from './Data/attacks.js';
import monsters from './Data/monsters.js';
import Monster from './Data/classMonster.js';
import audio from './Data/audio.js';
import gameInitialization from './Data/gameInitialization.js';

const {context, boundaries, battleZones, background, foreground, player, keys, battle, movables, battleBackground} = gameInitialization();
let karen;
let flamby;
let renderedSprites;
let queue = [];
let moving;
let battleAnimationId;

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
/// /////               to start audio only the 1st time the game is loaded                               /////
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
let firstStart = true;
if (firstStart) {
  audio.Map.play();
  firstStart = false;
}
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
/// /////                                       COLLISION                                                 /////
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////

const rectangularCollision = ({ rectangle1, rectangle2 }) =>
  rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
  rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
  rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
  rectangle1.position.y <= rectangle2.position.y + rectangle2.height;

const lookingForCollision = (moveX, moveY, playerImage) => {
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i];
    player.animate = true;
    player.image = playerImage;
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: {
          ...boundary,
          position: {
            x: boundary.position.x + moveX,
            y: boundary.position.y + moveY,
          },
        },
      })
    ) {
      moving = false;
      break;
    }
  }
};
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
/// /////                                       TRANSITIONS                                               /////
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////

// TODO: try to find a more clean way to do it
const eventListenerFunctionForDialogueBox = (e) => {  //needed to be named in order to be removed 
  if (queue.length) {
    queue[0]();
    queue.shift();
  } else {
    e.currentTarget.style.display = 'none';
  }
}

const transitionFromAnimateToBattle = () => {
  audio.Map.stop();
  audio.initBattle.play();
  audio.battle.play();
  battle.initiated = true;
  gsap.to('#overlappingDiv', {
    opacity: 1,
    repeat: 3,
    yoyo: true,
    duration: 0.4,
    onComplete() {
      gsap.to('#overlappingDiv', {
        opacity: 1,
        duration: 0.4,
        onComplete() {
          initBattle(karen, flamby, renderedSprites, battleAnimationId);
          animateBattle();
          gsap.to('#overlappingDiv', {
            opacity: 0,
            duration: 0.4,
          });
        },
      });
    },
  });
};

const transitionFromBattleToAnimate = () => {
  document.querySelector('#dialogueBox').removeEventListener('click', eventListenerFunctionForDialogueBox);
  battle.initiated = false;
  gsap.to('#overlappingDiv', {
    opacity: 1,
    onComplete: () => {
      cancelAnimationFrame(battleAnimationId);
      animate();
      document.querySelector('#userInterface').style.display = 'none';
      gsap.to('#overlappingDiv', {
        opacity: 0,
      });
      audio.Map.play();
    },
  });
};

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
/// /////                                       animate                                                   /////
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
const animate = () => {
  const animationId = window.requestAnimationFrame(animate);
  background.draw(context);

  boundaries.forEach((boundary) => {
    boundary.draw(context);
    if (rectangularCollision({ rectangle1: player, rectangle2: boundary })) {
    }
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw(context);
  });
  player.draw(context);
  foreground.draw(context);
  moving = true;
  player.animate = false;

  if (battle.initiated) return;
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));
      player.animate = true;
      player.image = player.sprites.up;
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        ////////////////////////////////////////////////////////////////////////////////////////////////
        Math.random() < 0.05  //////         value to modify to trigger battle                   //////
        ////////////////////////////////////////////////////////////////////////////////////////////////
      ) {
        window.cancelAnimationFrame(animationId);
        transitionFromAnimateToBattle();
        break;
      }
    }
  }
  if (keys.w.pressed) {
    lookingForCollision(0, 3, player.sprites.up);
    if (moving) {
      movables.forEach((movable) => (movable.position.y += 3));
    }
  }
  if (keys.s.pressed) {
    lookingForCollision(0, -3, player.sprites.down);
    if (moving) {
      movables.forEach((movable) => (movable.position.y -= 3));
    }
  }
  if (keys.a.pressed) {
    lookingForCollision(3, 0, player.sprites.left);
    if (moving) {
      movables.forEach((movable) => (movable.position.x += 3));
    }
  }

  if (keys.d.pressed) {
    lookingForCollision(0, 3, player.sprites.right);
    if (moving) {
      movables.forEach((movable) => (movable.position.x -= 3));
    }
  }
};
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
/// /////                                    initBattle                                                   /////
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
function initBattle() {
  document.querySelector('#userInterface').style.display = 'block';
  document.querySelector('#dialogueBox').style.display = 'none';
  document.querySelector('#enemyHealthBar').style.width = '100%';
  document.querySelector('#playerHealthBar').style.width = '100%';
  document.querySelector('#attacksBox').replaceChildren();
  audio.Map.stop();

  karen = new Monster(monsters.Karen);
  flamby = new Monster(monsters.Flamby);
  renderedSprites = [karen, flamby];
  if(queue.length) {   // in order to initialize the array to 0
    queue.length = 0;
  }

  flamby.attacks.forEach((attack) => {
    const button = document.createElement('button');
    button.innerHTML = attack.name;
    document.querySelector('#attacksBox').append(button);
  });

  // event listener for click on attack button while in battle.
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      await flamby.attack({
        attack: selectedAttack,
        recipient: karen,
        renderedSprites,
      });

      if (karen.health <= 0) {
        queue.push(() => {
          karen.faint();
        });
        queue.push(() => {
          transitionFromBattleToAnimate();
        });
      }
      // if want random attacks could use enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)];
      queue.push(async () => {
        await karen.attack({
          attack: karen.attacks[0],
          recipient: flamby,
          renderedSprites,
        });
      });

      if (flamby.health <= 0) {
        queue.push(() => {
          flamby.faint();
        });
        queue.push(() => {
          transitionFromBattleToAnimate();
        });
      }
    });
    button.addEventListener('mouseenter', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML];
      document.querySelector('#attackType').innerHTML = selectedAttack.type;
      document.querySelector('#attackType').style.color = selectedAttack.color;
    });
  });

  document.querySelector('#dialogueBox').addEventListener('click', eventListenerFunctionForDialogueBox)
}

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
/// /////                                     animateBattle                                               /////
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw(context);
  renderedSprites.forEach((sprite) => {
    sprite.draw(context);
  });
}

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
/// /////                                   key EventListener                                             /////
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true;
      break;
    case 'a':
      keys.a.pressed = true;
      break;
    case 's':
      keys.s.pressed = true;
      break;
    case 'd':
      keys.d.pressed = true;
      break;
    default:
      console.log("press 'w' 'a' 's' 'd' to move the player");
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
    default:
      break;
  }
});

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
/// /////                                       Start                                                     /////
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
animate();
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
/// /////                             Start direclty with fight                                           /////
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
// initBattle();
// animateBattle();
/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
