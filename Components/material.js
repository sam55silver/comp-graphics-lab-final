class Material {
  constructor(ambient, diffuse, diffuseIntensity, specular, shininess, spread) {
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.diffuseIntensity = diffuseIntensity;
    this.specular = specular;
    this.shininess = shininess;
    this.spread = spread;
  }

  setNormals(normals) {
    this.normals = normals;
  }

  init() {
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);

    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    gl.uniform4fv(ambientLoc, flatten(this.ambient));
    gl.uniform1f(diffuseIntensityLoc, this.diffuseIntensity);
    gl.uniform4fv(diffuseLoc, flatten(this.diffuse));
    gl.uniform4fv(specularLoc, flatten(this.specular));
    gl.uniform1f(shininessLoc, this.shininess);
    gl.uniform1f(specularSpreadLoc, this.spread);
  }
}
