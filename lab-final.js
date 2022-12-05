/*
  Lab Final
  First Person Parkour Game
  Sam Silver
  201901788
*/

let canvas;
let gl;

let modelViewMatrix;

let tBuffer;
let textureCoordLoc;
let loadedTextures = {};

let vBuffer;
let positionLoc;

let nMatrixLoc;
let normalLoc;
let nBuffer;

let deltaTime = 0;

let ambientLoc;
let diffuseLoc;
let specularLoc;
let shininessLoc;
let specularSpreadLoc;

const groundSize = [50, 50];

let cubePoints;

const createCubeVertices = () => {
  const vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0),
  ];

  const uvPoints = [vec2(0, 0), vec2(0, 1), vec2(1, 1), vec2(1, 0)];

  let points = [];
  let normals = [];
  let texCoord = [];
  let length = 0;

  const addFace = (a, b, c, d) => {
    points.push(vertices[a]);
    points.push(vertices[b]);
    points.push(vertices[c]);
    points.push(vertices[a]);
    points.push(vertices[c]);
    points.push(vertices[d]);

    texCoord.push(uvPoints[0]);
    texCoord.push(uvPoints[1]);
    texCoord.push(uvPoints[2]);
    texCoord.push(uvPoints[0]);
    texCoord.push(uvPoints[2]);
    texCoord.push(uvPoints[3]);

    let normDir;

    for (var i = 0; i <= 2; i++) {
      if (
        vertices[a][i] == vertices[b][i] &&
        vertices[a][i] == vertices[c][i] &&
        vertices[a][i] == vertices[d][i]
      ) {
        normDir = i;
        break;
      }
    }

    const getNorm = (pointIndex) => {
      let point2 = [...vertices[pointIndex]];
      point2[normDir] = point2[normDir] * 2;

      return subtract(point2, vertices[pointIndex]);
      // return point2;
    };

    normals.push(getNorm(a));
    normals.push(getNorm(b));
    normals.push(getNorm(c));
    normals.push(getNorm(a));
    normals.push(getNorm(c));
    normals.push(getNorm(d));

    length += 6;
  };

  addFace(1, 0, 3, 2);
  addFace(2, 3, 7, 6);
  addFace(3, 0, 4, 7);
  addFace(6, 5, 1, 2);
  addFace(4, 5, 6, 7);
  addFace(5, 4, 0, 1);

  return createShapeObject(length, points, normals, texCoord);
};

let sphereHalves;

const createSphereVertices = (horizontal, vertical) => {
  let vertices = [];
  let vertLength = 0;
  let normals = [];
  let texCoords = [];

  /* 
    Algorithm by Jonathan on https://stackoverflow.com/questions/4081898/procedurally-generate-a-sphere-mesh
  */
  for (let m = 0; m < horizontal; m++) {
    for (let n = 0; n < vertical; n++) {
      const genPoints = (p1, p2) => {
        const x =
          Math.sin((Math.PI * p1) / horizontal) *
          Math.cos((2 * Math.PI * p2) / vertical);

        const y =
          Math.sin((Math.PI * p1) / horizontal) *
          Math.sin((2 * Math.PI * p2) / vertical);

        const z = Math.cos((Math.PI * p1) / horizontal);

        return [x, y, z];
      };

      const p1 = genPoints(m, n);
      const p2 = genPoints(m + 1, n);
      const p3 = genPoints(m, n + 1);
      const p4 = genPoints(m + 1, n + 1);

      vertices.push(vec4(...p1, 1));
      vertices.push(vec4(...p2, 1));
      vertices.push(vec4(...p3, 1));

      vertices.push(vec4(...p4, 1));
      vertices.push(vec4(...p2, 1));
      vertices.push(vec4(...p3, 1));

      vertLength += 6;

      const getNorm = (point) => {
        const normP = subtract(vec4(...point, 1), vec4(0, 0, 0, 1));
        normals.push(normP);

        const getTexCoord = (p) => {
          return Math.asin(p) / Math.PI + 0.5;
        };
        const texCoord = vec2(getTexCoord(normP[0]), getTexCoord(normP[1]));
        texCoords.push(texCoord);
      };

      getNorm(p1);
      getNorm(p2);
      getNorm(p3);
      getNorm(p4);
      getNorm(p2);
      getNorm(p3);
    }
  }

  const half = vertLength / 2;

  const vertHalf = vertices.slice(0, half);
  const normsHalf = normals.slice(0, half);
  const texCoordsHalf = texCoords.slice(0, half);

  const vertEnd = vertices.slice(half, vertLength);
  const normsEnd = normals.slice(half, vertLength);
  const texCoordsEnd = texCoords.slice(half, vertLength);

  return {
    'front': createShapeObject(half, vertHalf, normsHalf, texCoordsHalf),
    'back': createShapeObject(half, vertEnd, normsEnd, texCoordsEnd),
  };
};

const init = () => {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  cubePoints = createCubeVertices();
  sphereHalves = createSphereVertices(16, 16);

  //
  //  Load shaders and initialize attribute buffers
  //
  const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  vBuffer = gl.createBuffer();
  positionLoc = gl.getAttribLocation(program, 'aPosition');

  modelViewMatrix = gl.getUniformLocation(program, 'modelViewMatrix');

  nBuffer = gl.createBuffer();
  normalLoc = gl.getAttribLocation(program, 'aNormal');

  tBuffer = gl.createBuffer();
  textureCoordLoc = gl.getAttribLocation(program, 'aTexCoord');
  textureSampleLoc = gl.getUniformLocation(program, 'uSampler');

  let textureUnit = 0;
  for (let texIndex in loadedTextures) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.NEAREST_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      loadedTextures[texIndex].image
    );
    gl.generateMipmap(gl.TEXTURE_2D);

    loadedTextures[texIndex]['index'] = textureUnit;
    loadedTextures[texIndex]['texture'] = texture;
    textureUnit++;
  }

  const viewMatrix = gl.getUniformLocation(program, 'viewMatrix');

  ambientLoc = gl.getUniformLocation(program, 'uAmbientColor');
  diffuseLoc = gl.getUniformLocation(program, 'uDiffuseColor');
  diffuseIntensityLoc = gl.getUniformLocation(program, 'uDiffuseIntensity');
  specularLoc = gl.getUniformLocation(program, 'uSpecularColor');
  shininessLoc = gl.getUniformLocation(program, 'uShininess');
  specularSpreadLoc = gl.getUniformLocation(program, 'uSpecularSpread');

  const uCameraPosLoc = gl.getUniformLocation(program, 'uCameraPos');

  // projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
  const projectionMatrix = perspective(
    45,
    gl.canvas.width / gl.canvas.height,
    1,
    200
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, 'projectionMatrix'),
    false,
    flatten(projectionMatrix)
  );

  nMatrixLoc = gl.getUniformLocation(program, 'uNormalMatrix');

  let input = [];

  const groundHeight = 1;

  const players = [];
  let playerCount = 5;

  const createPlayers = (amount) => {
    for (var i = 0; i < amount; i++) {
      const ang = generateRandomIntInRange(-350, -10);
      players.push(new Player(getMovePoint(), ang));
    }
  };

  createPlayers(playerCount);

  const lightCubeColor = rgbToPercent(252, 186, 3);

  gl.uniform4fv(
    gl.getUniformLocation(program, 'lightColor'),
    flatten(vec4(1, 1, 1, 1))
  );

  let lightPosition = vec3(20.0, 34.0, 5.0);
  const lightPosLoc = gl.getUniformLocation(program, 'uLightPosition');
  gl.uniform3fv(lightPosLoc, flatten(lightPosition));

  const light = new Shape(
    'light',
    true,
    lightPosition,
    [0, 0, 0],
    [1, 1, 1],
    new Material(lightCubeColor, lightCubeColor, 1, lightCubeColor, 0, 1),
    null
  );

  const groundColor = rgbToPercent(95, 148, 90);
  const ground = new Shape(
    'ground',
    true,
    [0, -(groundHeight / 2), 0],
    [0, 0, 0],
    [groundSize[0], groundHeight, groundSize[1]],
    new Material(groundColor, groundColor, 0.8, vec4(1, 1, 1, 1), 0, 1, [
      'grass',
    ]),
    null
  );

  let oldMosPos = [0, 0];
  let mosDir = [0, 0];
  let mouseDown = false;
  let yaw = -90;
  let pitch = -30;
  let sensitivity = 1.5;

  const calcCameraFront = () => {
    return normalize(
      vec3(
        Math.cos(radians(yaw)) * Math.cos(radians(pitch)),
        Math.sin(radians(pitch)),
        Math.sin(radians(yaw)) * Math.cos(radians(pitch))
      )
    );
  };

  let cameraPos = vec3(0, 45, 75);
  let cameraFront = calcCameraFront();
  let cameraUp = vec3(0, 1, 0);

  // const fpsElem = document.querySelector('#fps');

  let then = 0;
  function renderTree(now) {
    now *= 0.001;

    deltaTime = now - then;
    then = now;
    if (!deltaTime) deltaTime = 0;

    const speed = 0.02 * deltaTime;
    const cameraSpeed = vec3(speed, speed, speed);

    if (input.find((key) => key == 'w'))
      cameraPos = add(cameraPos, mult(cameraFront, cameraSpeed));
    if (input.find((key) => key == 's'))
      cameraPos = subtract(cameraPos, mult(cameraFront, cameraSpeed));

    if (input.find((key) => key == 'a'))
      cameraPos = subtract(
        cameraPos,
        mult(normalize(cross(cameraFront, cameraUp)), cameraSpeed)
      );

    if (input.find((key) => key == 'd'))
      cameraPos = add(
        cameraPos,
        mult(normalize(cross(cameraFront, cameraUp)), cameraSpeed)
      );

    if (input.find((key) => key == 'f'))
      cameraPos = add(cameraPos, mult(cameraUp, cameraSpeed));
    if (input.find((key) => key == 'z'))
      cameraPos = subtract(cameraPos, mult(cameraUp, cameraSpeed));

    if (mouseDown && (mosDir[0] || mosDir[1])) {
      yaw += mosDir[0] * sensitivity; //y
      pitch -= mosDir[1] * sensitivity; //x

      if (pitch > 89) pitch = 89;
      if (pitch < -89) pitch = -89;

      cameraFront = calcCameraFront();

      mosDir = [0, 0];
    }

    const view = lookAt(cameraPos, add(cameraPos, cameraFront), cameraUp);
    gl.uniformMatrix4fv(viewMatrix, false, flatten(view));

    gl.uniform3fv(uCameraPosLoc, flatten(cameraPos));

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    light.render();

    ground.render();

    for (var i in players) {
      players[i].render();
    }

    requestAnimationFrame(renderTree);
  }

  setUILabel('Move Forward:', 'w');
  setUILabel('Move Backward:', 's');
  setUILabel('Move Right:', 'd');
  setUILabel('Move Left:', 'a');
  setUILabel('Move Up:', 'f');
  setUILabel('Move Down:', 'z');
  setUILabel('Move Camera:', 'Click and drag in Canvas');

  setUISpacer(50);

  setUpUISlider('Camera Sensitivity:', [0.1, 3], 0.1, sensitivity, (val) => {
    sensitivity = val;
  });

  setUISpacer(50);

  setUpUISlider('Ground Width:', [10, 500], 1, groundSize[0], (val) => {
    groundSize[0] = val;
    ground.setScale(0, val);
  });
  setUpUISlider('Ground Depth:', [10, 500], 1, groundSize[1], (val) => {
    groundSize[1] = val;
    ground.setScale(2, val);
  });

  setUISpacer(50);

  setUpUISlider('Players:', [0, 100], 1, playerCount, (val) => {
    if (playerCount < val) {
      const diff = val - playerCount;
      playerCount += diff;
      createPlayers(diff);
    } else {
      const diff = playerCount - val;
      playerCount -= diff;
      for (var i = 0; i < diff; i++) {
        players.pop();
      }
    }
  });

  setUISpacer(50);

  const lightPosChange = (axis) => {
    let axisIndex;
    if (axis == 'X') {
      axisIndex = 0;
    } else if (axis == 'Y') {
      axisIndex = 1;
    } else if (axis == 'Z') {
      axisIndex = 2;
    }

    setUpUISlider(
      'Light ' + axis + ':',
      [-50, 50],
      0.1,
      lightPosition[axisIndex],
      (val) => {
        lightPosition[axisIndex] = val;
        light.setTranslation(lightPosition);
        gl.uniform3fv(lightPosLoc, flatten(lightPosition));
      }
    );
  };

  lightPosChange('X');
  lightPosChange('Y');
  lightPosChange('Z');

  window.addEventListener('keypress', function (e) {
    if (e.repeat) return;
    if (['w', 's', 'a', 'd', 'f', 'z'].find((key) => key == e.key))
      input.push(e.key);
  });

  window.addEventListener('keyup', function (e) {
    e.preventDefault();
    input = input.filter((key) => e.key != key);
  });

  window.addEventListener('mousedown', (e) => {
    mouseDown = true;
  });

  window.addEventListener('mouseup', (e) => {
    mouseDown = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (mouseDown) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const mosPos = [x - oldMosPos[0], y - oldMosPos[1]];
      const normMos = normalize(mosPos);
      if (normMos[0] || normMos[1]) {
        mosDir = normMos;
      } else {
        mosDir = [0, 0];
      }
      oldMosPos = [x, y];
    }
  });

  renderTree();
};

window.onload = async () => {
  const createTexture = async (name) => {
    loadedTextures[name] = {
      'image': await loadImage('./textures/' + name + '.jpg'),
    };
  };
  // Load textures
  await createTexture('grass');
  await createTexture('jeans');
  await createTexture('none');
  await createTexture('shirt');
  await createTexture('face');
  await createTexture('skin');

  init();
};
