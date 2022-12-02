class Cube {
  constructor(material) {
    this.material = material;
  }

  setVertices() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
  }

  render() {
    this.material.init();
    this.setVertices();

    const NumVertices = 36;
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
  }
}
