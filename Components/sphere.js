class Sphere {
  constructor(material) {
    this.material = material;
  }

  setVertices(half) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(half.vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
  }

  renderHalf(half, textureIndex) {
    this.material.init(half, textureIndex);
    this.setVertices(half);
    gl.drawArrays(gl.TRIANGLES, 0, half.length);
  }

  render() {
    this.renderHalf(sphereHalves.front, 0);
    this.renderHalf(sphereHalves.back, 1);
  }
}
