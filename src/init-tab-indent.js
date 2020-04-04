window.readyHandlers = [];
window.ready = function ready(handler) {
  window.readyHandlers.push(handler);
  handleState();
};

window.handleState = function handleState () {
  if (['interactive', 'complete'].indexOf(document.readyState) > -1) {
    while(window.readyHandlers.length > 0) {
      (window.readyHandlers.shift())();
    }
  }
};

document.onreadystatechange = window.handleState;

ready(function () {
	var el = document.getElementById('epiceditor-editor-body');
	tabIndent.config.focusDelay = 200;
	tabIndent.config.tab = '\u00A0 \u00A0 \u00A0 ';
	tabIndent.render(el);
});
