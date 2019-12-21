// Services Section
const serviceElems = document.querySelectorAll('.service');
function callback () {
  let active = Array.from(this.children).filter(node => node.classList.contains('active'))[0],
    inactive = Array.from(this.children).filter(node => node.classList.contains('kill'))[0];
  return (
    active.classList.remove('active'),
    active.classList.add('hide', 'kill'),
    inactive.classList.remove('hide', 'kill'),
    inactive.classList.add('active')
  );
}
serviceElems.forEach( elem => {
  elem.onclick = callback;
});