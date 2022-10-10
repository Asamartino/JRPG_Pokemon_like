class Boundary {
  static width = 48;

  static height = 48;

  constructor({ position }) {
    this.position = position;
    this.height = 48;
    this.width = 48;
  }

  draw(context) {
    context.fillStyle = 'rgba(255, 0, 0, 0)';
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

export default Boundary;
