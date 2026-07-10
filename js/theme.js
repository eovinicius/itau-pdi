window.PDI = window.PDI || {};

PDI.theme = (function () {
  var KEY = 'pdi-theme';

  function current() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    updateToggleIcon();
  }

  function toggle() {
    var next = current() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply(next);
  }

  function updateToggleIcon() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.innerHTML = PDI.icons.svg(current() === 'dark' ? 'sun' : 'moon', { size: 18 });
  }

  function followSystemUntilManual() {
    if (!window.matchMedia) return;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (e) {
      var hasManual = false;
      try { hasManual = !!localStorage.getItem(KEY); } catch (err) {}
      if (!hasManual) apply(e.matches ? 'dark' : 'light');
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
  }

  function init() {
    updateToggleIcon();
    followSystemUntilManual();
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggle);
  }

  return { init: init, toggle: toggle, current: current };
})();
