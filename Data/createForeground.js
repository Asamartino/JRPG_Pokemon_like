import Sprite from './classSprite.js';

const foregroundImage = new Image();
foregroundImage.src = '../Images/foregroundObjects.png';

const createForeground = (offset) =>
  new Sprite({
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: foregroundImage,
  });

export default createForeground;
