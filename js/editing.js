window.PDI = window.PDI || {};

/* Inline editing: click a `.editable` span to swap it for an <input>/<textarea>.
   Commits on blur or Enter (Enter inserts a newline in textareas instead).
   Escape cancels without committing. Delegated on #goal-list-root since goal
   cards are recreated on every render. */
PDI.editing = (function () {
  var MULTILINE_FIELDS = {};

  function getPath(obj, path) {
    return path.split('.').reduce(function (acc, key) { return acc ? acc[key] : undefined; }, obj);
  }

  function buildPatch(goal, path, value) {
    var patch = {};
    patch[path] = value;
    return patch;
  }

  function beginEdit(span) {
    if (span.dataset.editing) return;
    span.dataset.editing = 'true';

    var field = span.dataset.field;
    var goalId = span.dataset.goalId;
    var goal = PDI.state.findGoal(goalId);
    if (!goal) return;

    var currentValue = getPath(goal, field) || '';
    var multiline = !!MULTILINE_FIELDS[field];
    var el = document.createElement(multiline ? 'textarea' : 'input');
    el.className = 'editable-input';
    if (!multiline) el.type = 'text';
    el.value = currentValue;

    var committed = false;
    function commit() {
      if (committed) return;
      committed = true;
      var value = el.value;
      PDI.state.updateGoal(goalId, buildPatch(goal, field, value));
    }
    function cancel() {
      if (committed) return;
      committed = true;
      PDI.render.renderApp(PDI.state.getState());
    }

    el.addEventListener('blur', commit);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault();
        el.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    });

    span.replaceWith(el);
    el.focus();
    if (!multiline) el.select();
  }

  function attach(container) {
    container.addEventListener('click', function (e) {
      var span = e.target.closest('.editable');
      if (span && container.contains(span)) {
        beginEdit(span);
      }
    });
  }

  return { attach: attach };
})();
