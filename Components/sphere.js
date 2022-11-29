class Sphere {
  constructor(color) {
    this.color = color;
  }

  setColor() {
    // const vec4Color = vec4(this.color[0], this.color[1], this.color[2], 1.0);
    // let colorPoints = [];
    // for (let i = 0; i < vertLength; i++) {
    //   colorPoints.push(vec4Color);
    // }

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors), gl.STATIC_DRAW);

    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
  }

  setIndices() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    // gl.bufferData(
    //   gl.ELEMENT_ARRAY_BUFFER,
    //   new Uint8Array(sphereIndices),
    //   gl.STATIC_DRAW
    // );
  }

  render() {
    this.setIndices();
    this.setColor();
    gl.drawArrays(gl.TRIANGLES, 0, vertLength);
  }
}
