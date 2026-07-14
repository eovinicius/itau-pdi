window.PDI = window.PDI || {};

PDI.aggregate = (function () {
  function goalCountShare(goals, categoryId) {
    if (!goals.length) return 0;
    var inCategory = goals.filter(function (g) { return g.categoryId === categoryId; }).length;
    return inCategory / goals.length;
  }

  return {
    goalCountShare: goalCountShare
  };
})();
