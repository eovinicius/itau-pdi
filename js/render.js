window.PDI = window.PDI || {};

PDI.render = (function () {
  var icons = PDI.icons;
  var u = PDI.utils;
  var agg = PDI.aggregate;
  var esc = u.escapeHtml;

  var CAT_COLOR_VARS = ['var(--cat-theoretical)', 'var(--cat-practical)', 'var(--cat-handson)'];
  var HORIZONS = [
    { key: 'short', label: 'Curto prazo', sub: '6–12 meses' },
    { key: 'long', label: 'Longo prazo', sub: '12–36 meses' }
  ];

  function categoryColor(categories, categoryId) {
    var idx = categories.findIndex(function (c) { return c.id === categoryId; });
    return CAT_COLOR_VARS[idx >= 0 ? idx % CAT_COLOR_VARS.length : 0];
  }

  function renderDashboard(plan) {
    var categoryHtml = plan.categories.map(function (cat) {
      var count = plan.goals.filter(function (g) { return g.categoryId === cat.id; }).length;
      var targetPct = Math.round(cat.weight * 100);
      var actualPct = Math.round(agg.goalCountShare(plan.goals, cat.id) * 100);
      var outOfRange = plan.goals.length > 0 && Math.abs(actualPct - targetPct) > 15;
      var goalWord = count === 1 ? 'meta' : 'metas';
      var balanceHtml =
        '<div class="category-row__balance' + (outOfRange ? ' category-row__balance--warning' : '') + '">' +
          (outOfRange ? icons.svg('alertTriangle', { size: 12 }) : '') +
          '<span>' + count + ' ' + goalWord + ' · ' + actualPct + '% do total (alvo ' + targetPct + '%)</span>' +
        '</div>';

      return (
        '<div class="dashboard__category">' +
          '<div class="card category-row">' +
            '<div class="category-row__top">' +
              '<span class="category-row__name">' + icons.svg(cat.icon, { size: 15 }) + esc(cat.name) + ' <span style="opacity:.55">(' + targetPct + '%)</span></span>' +
            '</div>' +
            balanceHtml +
          '</div>' +
        '</div>'
      );
    }).join('');

    return categoryHtml;
  }

  function renderItem(goal, color) {
    return (
      '<li class="matrix-item" data-goal-id="' + goal.id + '">' +
        '<span class="matrix-item__dot" style="background:' + color + '" aria-hidden="true"></span>' +
        '<span class="matrix-item__text">' + esc(goal.text) + '</span>' +
      '</li>'
    );
  }

  function renderCell(categories, catIdx, categoryId, horizon, goals, query) {
    var color = CAT_COLOR_VARS[catIdx % CAT_COLOR_VARS.length];
    var horizonMeta = HORIZONS.find(function (h) { return h.key === horizon; });
    var items = goals
      .filter(function (g) { return g.categoryId === categoryId && g.horizon === horizon; })
      .filter(function (g) { return PDI.search.matchesQuery(g, query); })
      .sort(function (a, b) { return a.order - b.order; })
      .map(function (g) { return renderItem(g, color); })
      .join('');

    return (
      '<div class="matrix-cell" data-category-id="' + categoryId + '" data-horizon="' + horizon + '" data-horizon-label="' + horizonMeta.label + ' — ' + horizonMeta.sub + '">' +
        '<ul class="matrix-item-list">' + items + '</ul>' +
      '</div>'
    );
  }

  function renderMatrix(plan, ui) {
    var categories = plan.categories;
    var head = '<div class="matrix-corner"></div>' + HORIZONS.map(function (h) {
      return '<div class="matrix-head"><strong>' + h.label + '</strong><span>' + h.sub + '</span></div>';
    }).join('');

    var rows = categories.map(function (cat, idx) {
      var color = CAT_COLOR_VARS[idx % CAT_COLOR_VARS.length];
      var label =
        '<div class="matrix-row-label" style="border-left:3px solid ' + color + '">' +
          icons.svg(cat.icon, { size: 16 }) +
          '<span>' + Math.round(cat.weight * 100) + '% ' + esc(cat.name) + '</span>' +
        '</div>';
      var cells = HORIZONS.map(function (h) {
        return renderCell(categories, idx, cat.id, h.key, plan.goals, ui.query);
      }).join('');
      return label + cells;
    }).join('');

    return '<div class="matrix">' + head + rows + '</div>';
  }

  function renderApp(state) {
    var plan = state.plan;
    var ui = state.ui;

    var dashboardRoot = document.getElementById('dashboard-root');
    if (dashboardRoot) dashboardRoot.innerHTML = renderDashboard(plan);

    var matrixRoot = document.getElementById('matrix-root');
    if (matrixRoot) matrixRoot.innerHTML = renderMatrix(plan, ui);
  }

  return {
    renderApp: renderApp,
    renderDashboard: renderDashboard,
    renderMatrix: renderMatrix,
    categoryColor: categoryColor
  };
})();
