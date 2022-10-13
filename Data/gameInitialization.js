import createPlayer from './createPlayer.js';
import createBackground from './createBackground.js';
import createForeground from './createForeground.js';
import collisions from './collisions.js';
import battleZonesData from './battleZones.js';
import Sprite from './classSprite.js';
import Boundary from './classBoundary.js';

const gameInitialization = () => {
  
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 1024;
  canvas.height = 576;
  const boundaries = [];
  const offset = {
    x: -810,
    y: -590,
  };

  const collisionsMap = [];
  for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i));
  }
  const battleZonesMap = [];
  for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i));
  }
  collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025)
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );
    });
  });

  const battleZones = [];

  battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025)
        battleZones.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );
    });
  });

  const background = createBackground(offset);
  const foreground = createForeground(offset);
  const player = createPlayer(canvas);

  
  const keys = {
    w: {
      pressed: false,
    },
    a: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
  };

  const battle = {
    initiated: false,
  };

  

  const movables = [background, ...boundaries, foreground, ...battleZones];

  const battleBackgroundImage = new Image();
  battleBackgroundImage.src = './Images/battleBackground.png';
  const battleBackground = new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    image: battleBackgroundImage,
  });

  return{context,boundaries,battleZones, background, foreground, player, keys, battle, movables, battleBackground}

}



export default gameInitialization;

