class Cube {
  constructor(color) {
    this.color = color;
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

  setVertices() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
  }

  render() {
    this.setVertices();
    this.setColor();

    const NumVertices = 36;
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
  }
}
