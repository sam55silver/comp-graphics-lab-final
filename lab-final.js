/*
  Lab Final
  First Person Parkour Game
  Sam Silver
  201901788
*/

let canvas;
let gl;

let modelViewMatrix;
let cBuffer;
let colorLoc;
let vBuffer;
let positionLoc;

const groundSize = [50, 50];

let cubeVertices = [];

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

  let points = [];

  const addFace = (a, b, c, d) => {
    points.push(vertices[a]);
    points.push(vertices[b]);
    points.push(vertices[c]);
    points.push(vertices[a]);
    points.push(vertices[c]);
    points.push(vertices[d]);
  };

  addFace(1, 0, 3, 2);
  addFace(2, 3, 7, 6);
  addFace(3, 0, 4, 7);
  addFace(6, 5, 1, 2);
  addFace(4, 5, 6, 7);
  addFace(5, 4, 0, 1);

  return points;
};

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  cubeVertices = createCubeVertices();

  //
  //  Load shaders and initialize attribute buffers
  //
  const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  vBuffer = gl.createBuffer();
  positionLoc = gl.getAttribLocation(program, 'aPosition');

  cBuffer = gl.createBuffer();
  colorLoc = gl.getAttribLocation(program, 'aColor');

  modelViewMatrix = gl.getUniformLocation(program, 'modelViewMatrix');

  const viewMatrix = gl.getUniformLocation(program, 'viewMatrix');

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

  const ground = new Object(
    'ground',
    true,
    [0, -(groundHeight / 2), 0],
    [0, 0, 0],
    [groundSize[0], groundHeight, groundSize[1]],
    [0.02, 0.52, 0.51],
    null
  );

  let oldMosPos = [0, 0];
  let mosDir = [0, 0];
  let mouseDown = false;
  let yaw = -90;
  let pitch = -30;
  const sensitivity = 0.8;

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

  const fpsElem = document.querySelector('#fps');

  let then = performance.now();
  function renderTree() {
    const now = performance.now();
    const deltaTime = now - then; // compute time since last frame
    // console.log('deltaTime', deltaTime);
    then = now; // remember time for next frame
    // console.log('delta', deltaTime);
    // const fps = deltaTime != 0 ? 1000 / deltaTime : 60.0; // compute frames per second
    // fpsElem.textContent = fps.toFixed(1); // update fps display

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

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
    console.log('Players');
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
    console.log('Players', playerCount);
  });

  window.addEventListener('keypress', function (e) {
    if (e.repeat) return;
    if (['w', 's', 'a', 'd', 'f', 'z'].find((key) => key == e.key))
      input.push(e.key);
    console.log('Accepted', input);
  });

  window.addEventListener('keyup', function (e) {
    e.preventDefault();
    input = input.filter((key) => e.key != key);
    console.log('Key', input);
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
