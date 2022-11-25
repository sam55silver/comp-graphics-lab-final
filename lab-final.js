/*
  Lab Final
  First Person Parkour Game
  Sam Silver
  201901788
*/

'use strict';

let canvas;
let gl;

let modelViewMatrix;
let cBuffer;
let colorLoc;

const groundSize = [50, 50];

let points = [];

let vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
];
// Parameters controlling the size of the Robot's arm

function quad(a, b, c, d) {
  points.push(vertices[a]);
  points.push(vertices[b]);
  points.push(vertices[c]);
  points.push(vertices[a]);
  points.push(vertices[c]);
  points.push(vertices[d]);
}

function getCubeVertices() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

window.onload = function init() {
  canvas = document.getElementById('gl-canvas');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  getCubeVertices();

  //
  //  Load shaders and initialize attribute buffers
  //
  const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  const vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  const positionLoc = gl.getAttribLocation(program, 'aPosition');
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

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

  const player = new Player();

  const players = [];

  const amountPlayers = 10;
  for (var i = 0; i < amountPlayers; i++) {
    const ang = generateRandomIntInRange(0, 350);
    players.push(new Player(getXY(), ang));
  }

  const ground = new Rectangle(
    'ground',
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
