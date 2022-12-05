class Material {
  constructor(
    ambient,
    diffuse,
    diffuseIntensity,
    specular,
    shininess,
    spread,
    textures
  ) {
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.diffuseIntensity = diffuseIntensity;
    this.specular = specular;
    this.shininess = shininess;
    this.spread = spread;

    if (textures) {
      this.textures = [];
      for (let textureIndex in textures) {
        this.textures.push(loadedTextures[textures[textureIndex]]);
      }
    } else {
      this.textures = [loadedTextures['none']];
    }
  }

  // setNormals(normals) {
  //   this.normals = normals;
  // }

  // setTextureCoords(coords) {
  //   this.textureCoords = coords;
  // }

  init(shape, multiTextureIndex) {
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.normals), gl.STATIC_DRAW);

    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      flatten(shape.textureCoords),
      gl.STATIC_DRAW
    );

    gl.vertexAttribPointer(textureCoordLoc, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(textureCoordLoc);

    let texture = this.textures[0];

    if (multiTextureIndex) {
      texture = this.textures[multiTextureIndex];
    }

    gl.uniform1i(textureSampleLoc, texture.index);
    gl.activeTexture(gl.TEXTURE0 + texture.index);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);

    gl.uniform4fv(ambientLoc, flatten(this.ambient));
    gl.uniform1f(diffuseIntensityLoc, this.diffuseIntensity);
    gl.uniform4fv(diffuseLoc, flatten(this.diffuse));
    gl.uniform4fv(specularLoc, flatten(this.specular));
    gl.uniform1f(shininessLoc, this.shininess);
    gl.uniform1f(specularSpreadLoc, this.spread);
  }
}
