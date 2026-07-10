window.PDI = window.PDI || {};

PDI.search = (function () {
  function matchesQuery(goal, query) {
    var q = (query || '').trim().toLowerCase();
    if (!q) return true;
    return goal.text.toLowerCase().indexOf(q) !== -1;
  }

  return { matchesQuery: matchesQuery };
})();
