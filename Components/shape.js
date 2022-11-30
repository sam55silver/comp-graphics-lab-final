class Shape {
  constructor(
    id,
    isCube,
    translateCords,
    rotationAngle,
    scaleCords,
    color,
    parent,
    origin
  ) {
    this.id = id;
    if (isCube) {
      this.shape = new Cube(color);
    } else {
      this.shape = new Sphere(color);
    }
    this.translate = translateCords;
    this.rotation = rotationAngle;
    this.scale = scaleCords;
    this.children = [];
    this.origin = origin;

    this.createTransformMatrix();

    this.parent = parent;
    if (parent) {
      parent.setChild(this);
    }
  }

  addTranslate(index, translation) {
    this.translate[index] = this.translate[index] + translation;
  }

  setRotation(rotation) {
    this.rotation = rotation;
  }

  createTransformMatrix() {
    const translateMatrix = translate(
      this.translate[0],
      this.translate[1],
      this.translate[2]
    );

    const rotationXMatrix = rotateX(this.rotation[0]);
    const rotationYMatrix = rotateY(this.rotation[1]);
    const rotationZMatrix = rotateZ(this.rotation[2]);

    const mat1 = mult(translateMatrix, rotationXMatrix);
    const mat2 = mult(mat1, rotationYMatrix);
    this.transform = mult(mat2, rotationZMatrix);
    if (this.origin) {
      this.transform = mult(this.transform, translate(...this.origin));
    }
  }

  setChild(child) {
    this.children.push(child);
  }

  setScale(axis, val) {
    this.scale[axis] = val;
  }

  render() {
    this.createTransformMatrix();
    this.currentTransform = this.transform;

    if (this.parent) {
      this.currentTransform = mult(
        this.parent.currentTransform,
        this.transform
      );
    }

    const scaleMatrix = scalem(this.scale[0], this.scale[1], this.scale[2]);

    gl.uniformMatrix4fv(
      modelViewMatrix,
      false,
      flatten(mult(this.currentTransform, scaleMatrix))
    );

    this.shape.render();

    if (this.children) {
      for (let childIndex in this.children) {
        this.children[childIndex].render();
      }
    }
  }
}
