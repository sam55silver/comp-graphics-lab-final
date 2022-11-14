class Player {
  constructor() {
    const bodyHeight = 3;
    const bodyWidth = 2;

    this.body = new Rectangle(
      'PlayerBody',
      [0, -1, -20],
      [0, -30, 0],
      [bodyWidth, bodyHeight, 1],
      [1, 0, 0],
      null
    );

    this.head = new Rectangle(
      'PlayerHead',
      [0, bodyHeight / 2, 0],
      [0, 0, 0],
      [1.2, 1.3, 1.2],
      [1, 1, 0],
      this.body
    );

    const armWidth = 0.8;
    const armHeight = bodyHeight + 0.4;

    this.rightArm = new Rectangle(
      'PlayerRightArm',
      [bodyWidth / 2 + armWidth / 2, bodyHeight / 2 - armHeight, 0],
      [0, 0, 0],
      [armWidth, armHeight, 1],
      [0, 0, 1],
      this.body
    );

    this.leftArm = new Rectangle(
      'PlayerLeftArm',
      [-(bodyWidth / 2 + armWidth / 2), bodyHeight / 2 - armHeight, 0],
      [0, 0, 0],
      [armWidth, armHeight, 1],
      [0, 0, 1],
      this.body
    );

    const legWidth = 0.8;
    const legHeight = bodyHeight + 0.4;

    this.rightLeg = new Rectangle(
      'PlayerRightLeg',
      [bodyWidth / 2 - legWidth / 2, -(bodyHeight / 2) - legHeight, 0],
      [0, 0, 0],
      [legWidth, legHeight, 1],
      [0, 1, 1],
      this.body
    );

    this.leftLeg = new Rectangle(
      'PlayerLeftLeg',
      [-(bodyWidth / 2 - legWidth / 2), -(bodyHeight / 2) - legHeight, 0],
      [0, 0, 0],
      [legWidth, legHeight, 1],
      [0, 1, 1],
      this.body
    );
  }

  render() {
    this.body.render();
  }
}
