import Sprite from './classSprite.js';
import {
  tackleAnimation,
  fireballAnimation,
  faintAnimation,
} from './attackAnimationAndSound.js';

class Monster extends Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    isEnemy = false,
    name,
    attacks,
  }) {
    super({ position, image, frames, sprites, animate, rotation });
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.attacks = attacks;
  }

  async attack({ attack, recipient, renderedSprites }) {
    recipient.health -= attack.damage;
    document.querySelector('#dialogueBox').style.display = 'block';
    document.querySelector(
      '#dialogueBox'
    ).innerHTML = `${this.name} used ${attack.name}`;

    switch (attack.id) {
      case 1:
        tackleAnimation(this, recipient);
        break;
      case 2:
        fireballAnimation(this, recipient, renderedSprites);
        break;
      case 3:
        tackleAnimation(this, recipient);
        break;
      default:
        console.log('no attack ???');
    }
  }

  faint() {
    faintAnimation(this);
  }
}

export default Monster;
