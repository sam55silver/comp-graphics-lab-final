// Lab 6
// Sam Silver
// 201901788

const setUpUISlider = (label, range, step, value, callback) => {
  const ui = document.getElementById('ui-container');

  const sliderDiv = document.createElement('div');

  const sliderLabel = document.createElement('label');
  sliderLabel.innerHTML = label;
  sliderDiv.appendChild(sliderLabel);

  const sliderInput = document.createElement('input');
  sliderInput.setAttribute('id', label);
  sliderInput.setAttribute('type', 'range');
  sliderInput.setAttribute('step', step);
  sliderInput.setAttribute('min', range[0]);
  sliderInput.setAttribute('max', range[1]);
  sliderInput.setAttribute('value', value);
  sliderDiv.appendChild(sliderInput);

  const sliderValue = document.createElement('span');
  sliderValue.innerHTML = sliderInput.value;
  sliderDiv.appendChild(sliderValue);

  sliderInput.addEventListener(
    'input',
    (e) => {
      const val = e.target.value;

      sliderValue.innerHTML = val;
      callback(Number(val));
    },
    false
  );

  ui.appendChild(sliderDiv);
};

const setUILabel = (title, string) => {
  const ui = document.getElementById('ui-container');

  const labelDiv = document.createElement('div');

  const labelTitle = document.createElement('label');
  labelTitle.innerHTML = title;
  labelDiv.appendChild(labelTitle);

  const labelString = document.createElement('span');
  labelString.innerHTML = string;
  labelDiv.appendChild(labelString);

  ui.appendChild(labelDiv);
};

const setUISpacer = (size) => {
  const ui = document.getElementById('ui-container');
  const spacerDiv = document.createElement('div');
  spacerDiv.style.height = size + 'px';
  ui.appendChild(spacerDiv);
};
