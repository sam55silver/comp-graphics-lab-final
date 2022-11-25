class Player {
  constructor(translationCords, bodyAngle) {
    this.animationAngle = 30;
    this.animDirForward = true;
    this.animationSpeed = 2;

    this.bodyAngle = bodyAngle ? bodyAngle : 0;

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

    this.body = new Rectangle(
      'PlayerBody',
      translationCords ? translationCords : [0, 0, 0],
      [0, this.bodyAngle, 0],
      [bodyWidth, bodyHeight, 1],
      [1, 0, 0],
      null,
      [0, legHeight + bodyHeight / 2, 0]
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

    this.getMovePoint();
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

  getMovePoint() {
    this.movePoint = vec3(...getXY());
    this.veloc = normalize(
      subtract(this.movePoint, vec3(...this.body.translate))
    );

    const getQuad = (point) => {
      if (point[0] >= 0 && point[1] > 0) return 1;
      if (point[0] < 0 && point[1] >= 0) return 2;
      if (point[0] <= 0 && point[1] < 0) return 3;
      if (point[0] > 0 && point[1] <= 0) return 4;
    };

    const flipSign = (vec) => {
      let newVec = vec3(vec[0], vec[1], vec[2]);
      if (vec[0] < 0) newVec[0] = vec[0] * -1;
      if (vec[2] < 0) newVec[2] = vec[2] * -1;
      return newVec;
    };

    const velocAngle = flipSign(this.veloc);

    const angle = Math.atan(velocAngle[2] / velocAngle[0]);
    let angleDeg = (angle * 180) / Math.PI;

    const quadrant = getQuad([this.veloc[0], this.veloc[2]]);
    if (quadrant == 2) angleDeg = 180 - angleDeg;
    if (quadrant == 3) angleDeg = 180 + angleDeg;
    if (quadrant == 4) angleDeg = 360 - angleDeg;

    this.angleToLookAt = -angleDeg;

    const posAngleToLook = Math.abs(this.angleToLookAt);
    const posBodyAngle = Math.abs(this.bodyAngle);
    let diff;
    if (posAngleToLook >= posBodyAngle) {
      diff = posAngleToLook - posBodyAngle;
    } else {
      diff = 360 - (posBodyAngle - posAngleToLook);
    }
    this.clockwise = diff > 180 ? false : true;
  }

  move() {
    const spinSpeed = 4;

    const inRange = (value, final, check) => {
      return value <= final + check && value >= final - check;
    };

    if (!inRange(this.bodyAngle, this.angleToLookAt, 2)) {
      if (this.clockwise) {
        this.bodyAngle -= spinSpeed;
      } else {
        this.bodyAngle += spinSpeed;
      }
    }
    if (this.clockwise && this.bodyAngle <= -360) this.bodyAngle = 0;
    if (!this.clockwise && this.bodyAngle >= 0) this.bodyAngle = -360;

    this.body.setRotation([0, this.bodyAngle + 90, 0]);

    let atX = false;
    if (!inRange(this.body.translate[0], this.movePoint[0], 0.2))
      this.body.addTranslate(0, this.veloc[0] * this.walkSpeed);
    else atX = true;

    let atZ = false;
    if (!inRange(this.body.translate[2], this.movePoint[2], 0.2))
      this.body.addTranslate(2, this.veloc[2] * this.walkSpeed);
    else atZ = true;

    if (atX && atZ) {
      this.getMovePoint();
    }
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
