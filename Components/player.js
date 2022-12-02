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

    const headHeight = 1;
    const headWidth = 1;
    const headDepth = 1;

    const armWidth = 0.8;
    const armHeight = bodyHeight + 0.4;

    const legWidth = 0.8;
    const legHeight = bodyHeight + 0.4;

    const bodyColor = rgbToPercent(194, 101, 89);
    this.body = new Shape(
      'PlayerBody',
      true,
      translationCords ? translationCords : [0, 0, 0],
      [0, this.bodyAngle, 0],
      [bodyWidth, bodyHeight, 1],
      new Material(bodyColor, bodyColor, 0.8, vec4(1, 1, 1, 1), 0.1, 60),
      null,
      [0, legHeight + bodyHeight / 2, 0]
    );

    const skinColor = rgbToPercent(255, 215, 148);
    const skinMat = new Material(
      skinColor,
      skinColor,
      0.2,
      vec4(1, 1, 1, 1),
      0.5,
      16
    );
    this.head = new Shape(
      'PlayerHead',
      false,
      [0, halfBody + headHeight / 2, 0],
      [0, 0, 0],
      [headWidth, headHeight, headDepth],
      skinMat,
      this.body,
      [0, headHeight / 2, 0]
    );

    const armMat = new Material(
      skinColor,
      skinColor,
      0.2,
      vec4(1, 1, 1, 1),
      0.5,
      16
    );
    this.rightArm = new Shape(
      'PlayerRightArm',
      true,
      [bodyWidth / 2 + armWidth / 2, halfBody, 0],
      [0, 0, 0],
      [armWidth, armHeight, 1],
      armMat,
      this.body,
      [0, -(armHeight / 2), 0]
    );

    this.leftArm = new Shape(
      'PlayerLeftArm',
      true,
      [-(bodyWidth / 2 + armWidth / 2), halfBody, 0],
      [0, 0, 0],
      [armWidth, armHeight, 1],
      armMat,
      this.body,
      [0, -(armHeight / 2), 0]
    );

    const legColor = rgbToPercent(58, 67, 105);
    const legMat = new Material(
      legColor,
      legColor,
      0.8,
      vec4(1, 1, 1, 1),
      0.1,
      60
    );
    this.rightLeg = new Shape(
      'PlayerRightLeg',
      true,
      [bodyWidth / 2 - legWidth / 2, -halfBody, 0],
      [0, 0, 0],
      [legWidth, legHeight, 1],
      legMat,
      this.body,
      [0, -(legHeight / 2), 0]
    );

    this.leftLeg = new Shape(
      'PlayerLeftLeg',
      true,
      [-(bodyWidth / 2 - legWidth / 2), -halfBody, 0],
      [0, 0, 0],
      [legWidth, legHeight, 1],
      legMat,
      this.body,
      [0, -(legHeight / 2), 0]
    );

    if (generateRandomIntInRange(1, 2) == 1) {
      this.setIdle();
    } else {
      this.walking = true;
      this.getMovePoint();
    }
  }

  animate() {
    if (this.walking || (!this.walking && this.animationAngle != 0)) {
      if (this.animDirForward) {
        this.animationAngle -= this.animationSpeed;
      } else {
        this.animationAngle += this.animationSpeed;
      }
    }

    if (this.animationAngle >= 30) this.animDirForward = true;
    else if (this.animationAngle <= -30) this.animDirForward = false;

    // arms
    this.leftArm.setRotation([this.animationAngle, 0, 0]);
    this.rightArm.setRotation([-this.animationAngle, 0, 0]);

    // Legs
    this.leftLeg.setRotation([-this.animationAngle, 0, 0]);
    this.rightLeg.setRotation([this.animationAngle, 0, 0]);
  }

  setIdle() {
    this.walking = false;
    setTimeout(() => {
      this.getMovePoint();
      this.walking = true;
    }, generateRandomIntInRange(500, 1000));
  }

  getMovePoint() {
    this.movePoint = vec3(...getMovePoint());
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
      this.setIdle();
    }
  }

  walk() {
    if (this.walking) {
      this.move();
    }
    this.animate();
  }

  render() {
    this.walk();
    this.body.render();
  }
}
