window.PDI = window.PDI || {};

PDI.print = (function () {
  function init() {
    var btn = document.getElementById('print-btn');
    if (btn) btn.addEventListener('click', function () { window.print(); });
  }
  return { init: init };
})();
