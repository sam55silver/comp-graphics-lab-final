class Sphere {
  constructor() {
    const materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
    const materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
    const materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
    const materialShininess = 32;

    this.material = new Material(
      sphereNormals,
      materialAmbient,
      materialDiffuse,
      materialSpecular,
      materialShininess
    );
  }

  setVertices() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
  }

  render() {
    this.material.init();
    this.setVertices();
    gl.drawArrays(gl.TRIANGLES, 0, vertLength);
  }
}
