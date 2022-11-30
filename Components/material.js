class Material {
  constructor(normals, ambient, diffuse, specular, shininess) {
    this.ambient = mult(ambientLight, ambient);
    this.diffuse = mult(diffuseLight, diffuse);
    this.specular = mult(specularLight, specular);
    this.shininess = shininess;
    this.normals = normals;
  }

  init() {
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.normals), gl.STATIC_DRAW);

    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    gl.uniform4fv(ambientLoc, flatten(this.ambient));
    gl.uniform4fv(diffuseLoc, flatten(this.diffuse));
    gl.uniform4fv(specularLoc, flatten(this.specular));
    gl.uniform1f(shininessLoc, this.shininess);
  }
}
