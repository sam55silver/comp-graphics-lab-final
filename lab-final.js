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

  let cameraTranslate = [0, 0, 0];
  let input = [];

  const player = new Player();

  // const fpsElem = document.querySelector('#fps');

  // let then = performance.now();
  function renderTree() {
    // const now = performance.now();
    // const deltaTime = now - then; // compute time since last frame
    // then = now; // remember time for next frame
    // console.log('delta', deltaTime);
    // const fps = deltaTime != 0 ? 1000 / deltaTime : 60.0; // compute frames per second
    // fpsElem.textContent = fps.toFixed(1); // update fps display

    if (input.find((key) => key == 'w')) cameraTranslate[2] -= camSpeed;
    if (input.find((key) => key == 's')) cameraTranslate[2] += camSpeed;

    if (input.find((key) => key == 'a')) cameraTranslate[0] -= camSpeed;
    if (input.find((key) => key == 'd')) cameraTranslate[0] += camSpeed;

    if (input.find((key) => key == ' ')) cameraTranslate[1] += camSpeed;
    if (input.find((key) => key == 'f')) cameraTranslate[1] -= camSpeed;

    const cameraTransform = translate(...cameraTranslate);
    const inverseCam = inverse(cameraTransform);
    gl.uniformMatrix4fv(viewMatrix, false, flatten(inverseCam));

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    player.render();
    requestAnimationFrame(renderTree);
  }

  const camSpeed = 0.2;

  window.addEventListener('keypress', function (e) {
    if (e.repeat) return;
    if (['w', 's', 'a', 'd', ' ', 'f'].find((key) => key == e.key))
      input.push(e.key);
    console.log('Key', input);
  });

  window.addEventListener('keyup', function (e) {
    e.preventDefault();
    input = input.filter((key) => e.key != key);
    console.log('Key', input);
  });

  renderTree();
};
