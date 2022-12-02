const generateRandomIntInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getMovePoint = () => {
  const groundWidth = groundSize[0] / 2;
  const groundDepth = groundSize[1] / 2;
  const x = generateRandomIntInRange(-groundWidth, groundWidth);
  const z = generateRandomIntInRange(-groundDepth, groundDepth);

  return [x, 0, z];
};

rgbToPercent = (val1, val2, val3) => {
  return vec4(val1 / 255, val2 / 255, val3 / 255, 1.0);
};
