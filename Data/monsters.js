import attacks from './attacks.js';

const monsters = {
  Karen: {
    position: {
      x: 800,
      y: 100,
    },
    image: {
      src: './Images/draggleSprite.png',
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: 'Karen',
    attacks: [attacks.SpeakToManager],
  },
  Flamby: {
    position: {
      x: 280,
      y: 325,
    },
    image: {
      src: './Images/embySprite.png',
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: false,
    name: 'Flamby',
    attacks: [attacks.Tackle, attacks.Fireball],
  },
};

export default monsters;
