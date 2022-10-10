import Sprite from './classSprite.js';

const backgroundImage = new Image();
backgroundImage.src = '../Images/pelletTown.png';

const createBackground = (offset) =>
  new Sprite({
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: backgroundImage,
  });

export default createBackground;
