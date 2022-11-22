class Player {
  constructor(translationCords, rotationAngles) {
    const bodyHeight = 3;
    const bodyWidth = 2;

    const armWidth = 0.8;
    const armHeight = bodyHeight + 0.4;

    const legWidth = 0.8;
    const legHeight = bodyHeight + 0.4;

    if (translationCords) {
      translationCords[1] = translationCords[1] + legHeight;
    }

    const origin = translationCords ? translationCords : [0, legHeight, 0];
    const rot = rotationAngles ? rotationAngles : [0, 0, 0];

    this.body = new Rectangle(
      'PlayerBody',
      origin,
      rot,
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

    this.walkAnimation();
  }

  walkAnimation() {
    this.leftArm.setRotation([30, 0, 0]);
  }

  render() {
    this.body.render();
  }
}
