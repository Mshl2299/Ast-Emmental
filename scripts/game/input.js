// Keyboard, mouse/touch handlers
// DOM EventListeners should be in dom.js

// Keyboard inputs
export let keys = [];

window.addEventListener("keydown", function (e) { keys[e.key] = true; });
window.addEventListener("keyup", function (e) { delete keys[e.key]; });