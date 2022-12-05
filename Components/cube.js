class Cube {
  constructor(material) {
    this.material = material;
  }

  setVertices(shape) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
  }

  render() {
    this.material.init(cubePoints);
    this.setVertices(cubePoints);

    gl.drawArrays(gl.TRIANGLES, 0, cubePoints.length);
  }
}
