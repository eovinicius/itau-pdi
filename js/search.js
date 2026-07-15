window.PDI = window.PDI || {};

PDI.search = (function () {
  function matchesQuery(goal, query) {
    var q = (query || '').trim().toLowerCase();
    if (!q) return true;
    var haystack = [goal.text, goal.objective, goal.action, goal.deadline, goal.successCriteria, goal.expectedOutcome]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.indexOf(q) !== -1;
  }

  return { matchesQuery: matchesQuery };
})();
