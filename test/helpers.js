function rnd() {
  return Math.floor(Math.random() * 10000000) + '';
}

function createContainer(id) {
  var el = document.createElement('div');
  el.id = id;
  el.className += 'hidden';
  document.body.appendChild(el);
  return el;
}

function removeContainer(id) {
  var el = document.getElementById(id);
  if (el) {
    el.parentNode.removeChild(el);
  }
}

function getContainer(id) {
  return document.getElementById(id);
}

function getIframeDoc(el) {
  return el.contentDocument || el.contentWindow.document;
}
