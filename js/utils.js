window.PDI = window.PDI || {};

PDI.utils = (function () {
  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    };
  }

  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function formatDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function daysUntil(iso) {
    if (!iso) return null;
    var target = new Date(iso + 'T00:00:00').getTime();
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var diffMs = target - today.getTime();
    return Math.round(diffMs / 86400000);
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  return { debounce: debounce, uuid: uuid, clamp: clamp, nowIso: nowIso, formatDate: formatDate, daysUntil: daysUntil, escapeHtml: escapeHtml };
})();
