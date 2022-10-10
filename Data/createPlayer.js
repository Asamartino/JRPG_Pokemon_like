import Sprite from './classSprite.js';

const playerDownImage = new Image();
playerDownImage.src = '../Images/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = '../Images/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = '../Images/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = '../Images/playerRight.png';

const createPlayer = (canvas) =>
  new Sprite({
    position: {
      x: canvas.width / 2 - 192 / 2,
      y: canvas.height / 2 - 68 / 4 + 10,
    },
    image: playerDownImage,
    frames: { max: 4, hold: 10 },
    sprites: {
      up: playerUpImage,
      down: playerDownImage,
      left: playerLeftImage,
      right: playerRightImage,
    },
  });

export default createPlayer;
