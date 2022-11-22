class Rectangle {
  constructor(id, translateCords, rotationAngle, scaleCords, color, parent) {
    this.id = id;
    this.translate = translateCords;
    this.rotation = rotationAngle;
    this.scale = scaleCords;
    this.color = color;
    this.children = [];

    this.createTransformMatrix();

    this.parent = parent;
    if (parent) {
      parent.setChild(this);
    }
  }

  setColor() {
    const vec4Color = vec4(this.color[0], this.color[1], this.color[2], 1.0);
    let colorPoints = [];
    for (let i = 0; i < 36; i++) {
      colorPoints.push(vec4Color);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorPoints), gl.STATIC_DRAW);

    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
  }

  setTranslate(translation) {
    this.translate = translation;
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
    this.transform = mult(this.transform, translate(0, this.scale[1] / 2, 0));
  }

  setChild(child) {
    this.children.push(child);
  }

  render() {
    this.setColor();
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

    const NumVertices = 36;

    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    if (this.children) {
      for (let childIndex in this.children) {
        this.children[childIndex].render();
      }
    }
  }
}
