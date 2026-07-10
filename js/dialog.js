window.PDI = window.PDI || {};

/* Custom confirm/alert dialogs matching the app's own visual language
   (dark/light theme, card style) instead of native window.confirm()/alert(). */
PDI.dialog = (function () {
  var esc = PDI.utils.escapeHtml;

  function show(message, buttonsHtml, wire) {
    return new Promise(function (resolve) {
      var root = document.getElementById('dialog-root');
      if (!root) { resolve(window.confirm(message)); return; }

      root.innerHTML =
        '<div class="dialog-overlay" role="presentation">' +
          '<div class="dialog-card card" role="alertdialog" aria-modal="true" aria-label="Confirmar ação">' +
            '<p class="dialog-message">' + esc(message) + '</p>' +
            '<div class="dialog-actions">' + buttonsHtml + '</div>' +
          '</div>' +
        '</div>';

      var overlay = root.firstElementChild;

      function close(result) {
        document.removeEventListener('keydown', onKeydown);
        root.innerHTML = '';
        resolve(result);
      }
      function onKeydown(e) {
        if (e.key === 'Escape') close(false);
      }

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close(false);
      });
      document.addEventListener('keydown', onKeydown);
      wire(overlay, close);
    });
  }

  function confirm(message, opts) {
    opts = opts || {};
    var confirmClass = opts.variant === 'primary' ? 'btn--primary' : 'btn--danger-solid';
    var buttons =
      '<button type="button" class="btn btn--ghost" data-dialog="cancel">' + esc(opts.cancelLabel || 'Cancelar') + '</button>' +
      '<button type="button" class="btn ' + confirmClass + '" data-dialog="confirm">' + esc(opts.confirmLabel || 'Remover') + '</button>';

    return show(message, buttons, function (overlay, close) {
      overlay.querySelector('[data-dialog="cancel"]').addEventListener('click', function () { close(false); });
      var confirmBtn = overlay.querySelector('[data-dialog="confirm"]');
      confirmBtn.addEventListener('click', function () { close(true); });
      overlay.querySelector('[data-dialog="cancel"]').focus();
    });
  }

  function alertInfo(message, opts) {
    opts = opts || {};
    var buttons = '<button type="button" class="btn btn--primary" data-dialog="ok">' + esc(opts.okLabel || 'Ok') + '</button>';
    return show(message, buttons, function (overlay, close) {
      var okBtn = overlay.querySelector('[data-dialog="ok"]');
      okBtn.addEventListener('click', function () { close(true); });
      okBtn.focus();
    });
  }

  return { confirm: confirm, alert: alertInfo };
})();
