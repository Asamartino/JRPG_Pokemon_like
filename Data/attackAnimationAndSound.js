import audio from './audio.js';
import Sprite from './classSprite.js';

const initialisation = (monster) => {
  let healthBar = '#enemyHealthbar';
  let rotation = 1;
  let movementDistance = 20;
  if (monster.isEnemy) {
    movementDistance = -20;
    healthBar = '#playerHealthbar';
    rotation = -2.2;
  }
  return { healthBar, rotation, movementDistance };
};

const gettingHit = (recipient, monster) => {
  const { healthBar } = initialisation(monster);
  gsap.to(healthBar, {
    width: `${recipient.health}%`,
  });
  gsap.to(recipient.position, {
    x: recipient.position.x + 10,
    yoyo: true,
    repeat: 5,
    duration: 0.08,
  });
  gsap.to(recipient, {
    opacity: 0,
    yoyo: true,
    repeat: 5,
    duration: 0.08,
  });
};

const tackleAnimation = (monster, recipient) => {
  const { movementDistance } = initialisation(monster);
  gsap
    .timeline()
    .to(monster.position, {
      x: monster.position.x - movementDistance,
    })
    .to(monster.position, {
      x: monster.position.x + 2 * movementDistance,
      duration: 0.1,
      onComplete: () => {
        audio.tackleHit.play();
        gettingHit(recipient, monster);
      },
    })
    .to(monster.position, {
      x: monster.position.x,
    });
};

const fireballAnimation = (monster, recipient, renderedSprites) => {
  const { rotation } = initialisation(monster);
  audio.initFireball.play();
  const fireballImage = new Image();
  fireballImage.src = '../Images/fireball.png';
  const fireball = new Sprite({
    position: {
      x: monster.position.x,
      y: monster.position.y,
    },
    image: fireballImage,
    frames: {
      max: 4,
      hold: 10,
    },
    animate: true,
    rotation,
  });
  renderedSprites.splice(1, 0, fireball);
  gsap.to(fireball.position, {
    x: recipient.position.x,
    y: recipient.position.y,
    onComplete: () => {
      audio.fireballHit.play();
      gettingHit(recipient, monster);
      renderedSprites.splice(1, 1);
    },
  });
};

const faintAnimation = (monster) => {
  document.querySelector('#dialogueBox').style.display = 'block';
  document.querySelector('#dialogueBox').innerHTML = `${monster.name} fainted!`;
  gsap.to(monster.position, {
    y: monster.position.y + 20,
  });
  gsap.to(monster, {
    opacity: 0,
    onComplete: () => {
      gsap.to(monster.position, {
        y: monster.position.y - 20,
      });
    },
  });
  audio.battle.stop();
  audio.victory.play();
};

export { tackleAnimation, fireballAnimation, faintAnimation };
