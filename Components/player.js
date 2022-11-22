class Player {
  constructor(translationCords, rotationAngles) {
    this.animationAngle = 30;
    this.animDirForward = true;
    this.animationSpeed = 2;

    this.bodyAngle = 0;

    this.walkSpeed = 0.1;

    const bodyHeight = 3;
    const bodyWidth = 2;
    const halfBody = bodyHeight / 2;

    const headHeight = 1.3;
    const headWidth = 1.2;
    const headDepth = 1.2;

    const armWidth = 0.8;
    const armHeight = bodyHeight + 0.4;

    const legWidth = 0.8;
    const legHeight = bodyHeight + 0.4;

    const playerHeightFromBody = legHeight + bodyHeight / 2;

    if (translationCords) {
      translationCords[1] = translationCords[1] + playerHeightFromBody;
    }

    const origin = translationCords
      ? translationCords
      : [0, playerHeightFromBody, 0];
    const rot = rotationAngles ? rotationAngles : [0, 0, 0];

    this.body = new Rectangle(
      'PlayerBody',
      [0, 0, 0],
      rot,
      [bodyWidth, bodyHeight, 1],
      [1, 0, 0],
      null,
      origin
    );

    this.head = new Rectangle(
      'PlayerHead',
      [0, halfBody, 0],
      [0, 0, 0],
      [headWidth, headHeight, headDepth],
      [1, 1, 0],
      this.body,
      [0, headHeight / 2, 0]
    );

    this.rightArm = new Rectangle(
      'PlayerRightArm',
      [bodyWidth / 2 + armWidth / 2, halfBody, 0],
      [0, 0, 0],
      [armWidth, armHeight, 1],
      [0, 0, 1],
      this.body,
      [0, -(armHeight / 2), 0]
    );

    this.leftArm = new Rectangle(
      'PlayerLeftArm',
      [-(bodyWidth / 2 + armWidth / 2), halfBody, 0],
      [0, 0, 0],
      [armWidth, armHeight, 1],
      [0, 0, 1],
      this.body,
      [0, -(armHeight / 2), 0]
    );

    this.rightLeg = new Rectangle(
      'PlayerRightLeg',
      [bodyWidth / 2 - legWidth / 2, -halfBody, 0],
      [0, 0, 0],
      [legWidth, legHeight, 1],
      [0, 1, 1],
      this.body,
      [0, -(legHeight / 2), 0]
    );

    this.leftLeg = new Rectangle(
      'PlayerLeftLeg',
      [-(bodyWidth / 2 - legWidth / 2), -halfBody, 0],
      [0, 0, 0],
      [legWidth, legHeight, 1],
      [0, 1, 1],
      this.body,
      [0, -(legHeight / 2), 0]
    );
  }

  animate() {
    // arms
    this.leftArm.setRotation([this.animationAngle, 0, 0]);
    this.rightArm.setRotation([-this.animationAngle, 0, 0]);

    // Legs
    this.leftLeg.setRotation([-this.animationAngle, 0, 0]);
    this.rightLeg.setRotation([this.animationAngle, 0, 0]);

    if (this.animDirForward) {
      this.animationAngle -= this.animationSpeed;
    } else {
      this.animationAngle += this.animationSpeed;
    }

    if (this.animationAngle >= 30) this.animDirForward = true;
    else if (this.animationAngle <= -30) this.animDirForward = false;
  }

  move() {
    const spinSpeed = 2;

    const movePoint = [-25, 25];
    const angle = Math.atan(movePoint[1] / movePoint[0]);
    const angleDeg = (angle * 180) / Math.PI;

    const inRange = (value, final, check) => {
      return value <= final + check && value >= final - check;
    };

    if (!inRange(this.bodyAngle, angleDeg, 2)) {
      this.bodyAngle += spinSpeed;
    }

    this.body.setRotation([0, this.bodyAngle, 0]);

    if (!inRange(this.body.translate[0], movePoint[0], 0.2)) {
      let x = Math.sin(angle) * this.walkSpeed;
      // if (movePoint[0] < 0) x = -x;
      console.log('x', x);
      this.body.setTranslate(0, this.body.translate[0] + x);
    }
    if (!inRange(this.body.translate[2], movePoint[1], 0.2)) {
      let z = Math.cos(angle) * this.walkSpeed;
      // if (movePoint[1] < 0) z = -z;
      this.body.setTranslate(2, this.body.translate[2] + z);
    }

    // console.log('angle', angle, 'body', this.body.translate);
  }

  walk() {
    this.animate();
    this.move();
  }

  render() {
    this.walk();
    this.body.render();
  }
}
