const wait = (delay = 0) =>
new Promise(resolve => setTimeout(resolve, delay));

const setVisible = (elementOrSelector, visible) => 
(typeof elementOrSelector === 'string'
  ? document.querySelector(elementOrSelector)
  : elementOrSelector
).style.display = visible ? 'block' : 'none';

setVisible('#loading', true);

document.addEventListener('DOMContentLoaded', () =>
wait(100).then(() => {
  setVisible('#loading', false);
}));