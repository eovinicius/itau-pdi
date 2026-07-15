window.PDI = window.PDI || {};

/* Custom confirm/alert dialogs matching the app's own visual language
   (dark/light theme, card style) instead of native window.confirm()/alert(). */
PDI.dialog = (function () {
  var esc = PDI.utils.escapeHtml;
  var icons = PDI.icons;

  /* Overlay lifecycle shared by every dialog kind: injects `innerHtml` into the card
     and centralizes Escape / click-outside / close. `opts.cardClass` adds a modifier
     to the card, `opts.ariaLabel`/`opts.role` set its semantics. */
  function open(innerHtml, wire, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var root = document.getElementById('dialog-root');
      if (!root) { resolve(opts.fallback ? opts.fallback() : false); return; }

      root.innerHTML =
        '<div class="dialog-overlay" role="presentation">' +
          '<div class="dialog-card card' + (opts.cardClass ? ' ' + opts.cardClass : '') + '" ' +
            'role="' + (opts.role || 'alertdialog') + '" aria-modal="true" ' +
            'aria-label="' + esc(opts.ariaLabel || 'Diálogo') + '">' +
            innerHtml +
          '</div>' +
        '</div>';

      var overlay = root.firstElementChild;

      // Lock background scroll while the modal is open; restore on close.
      var prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      function close(result) {
        document.removeEventListener('keydown', onKeydown);
        document.body.style.overflow = prevOverflow;
        root.innerHTML = '';
        resolve(result);
      }
      function onKeydown(e) {
        if (e.key === 'Escape') close(opts.escapeResult != null ? opts.escapeResult : false);
      }

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close(opts.escapeResult != null ? opts.escapeResult : false);
      });
      document.addEventListener('keydown', onKeydown);
      wire(overlay, close);
    });
  }

  function show(message, buttonsHtml, wire) {
    var body =
      '<p class="dialog-message">' + esc(message) + '</p>' +
      '<div class="dialog-actions">' + buttonsHtml + '</div>';
    return open(body, wire, { ariaLabel: 'Confirmar ação', fallback: function () { return window.confirm(message); } });
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

  var hasText = function (v) { return v && String(v).trim(); };

  // "Como medir" is multi-line (one criterion per line) → render a bullet list.
  function criteriaHtml(value) {
    if (!hasText(value)) return '<span class="goal-detail__value">—</span>';
    var items = String(value).split('\n')
      .map(function (l) { return l.replace(/^\s*[•\-*]\s*/, '').trim(); })
      .filter(Boolean);
    if (!items.length) return '<span class="goal-detail__value">—</span>';
    return '<ul class="goal-detail__list">' +
      items.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') +
      '</ul>';
  }

  function textFieldHtml(value) {
    return '<span class="goal-detail__value">' + (hasText(value) ? esc(value) : '—') + '</span>';
  }

  /* Read-only detail view for a single goal: the title (objective headline) + five
     sections (Objetivo/Ação/Prazo/Como medir/Resultado esperado). Closed via the X in
     the corner, Escape or click-outside. */
  function goalDetail(goal) {
    var sections = [
      { label: '🎯 Objetivo', html: textFieldHtml(goal.objective) },
      { label: '📝 Ação', html: textFieldHtml(goal.action) },
      { label: '📅 Prazo', html: textFieldHtml(goal.deadline) },
      { label: '📊 Como medir', html: criteriaHtml(goal.successCriteria) },
      { label: '🚀 Resultado esperado', html: textFieldHtml(goal.expectedOutcome) }
    ];
    var fieldsHtml = sections.map(function (s) {
      return (
        '<div class="goal-detail__field">' +
          '<span class="goal-detail__label">' + esc(s.label) + '</span>' +
          s.html +
        '</div>'
      );
    }).join('');

    var titleHtml = hasText(goal.text)
      ? '<h2 class="goal-detail__title">' + esc(goal.text) + '</h2>'
      : '<h2 class="goal-detail__title goal-detail__title--empty">Sem objetivo definido</h2>';

    var body =
      '<button type="button" class="icon-btn goal-detail__close" data-dialog="close" aria-label="Fechar">' +
        icons.svg('x', { size: 18 }) +
      '</button>' +
      titleHtml +
      '<div class="goal-detail__fields">' + fieldsHtml + '</div>';

    return open(body, function (overlay, close) {
      var closeBtn = overlay.querySelector('[data-dialog="close"]');
      closeBtn.addEventListener('click', function () { close(true); });
      closeBtn.focus();
    }, { cardClass: 'dialog-card--wide', role: 'dialog', ariaLabel: 'Detalhes da meta', escapeResult: true });
  }

  return { confirm: confirm, alert: alertInfo, goalDetail: goalDetail };
})();
