window.PDI = window.PDI || {};

PDI.aggregate = (function () {
  function goalProgress(goal) {
    return goal.done ? 1 : 0;
  }

  function categoryProgress(goals, categoryId) {
    var inCategory = goals.filter(function (g) { return g.categoryId === categoryId; });
    if (inCategory.length === 0) return 0;
    var sum = inCategory.reduce(function (acc, g) { return acc + goalProgress(g); }, 0);
    return sum / inCategory.length;
  }

  function overallProgress(plan) {
    var categories = plan.categories || [];
    var goals = plan.goals || [];
    var totalWeight = categories.reduce(function (acc, c) { return acc + (c.weight || 0); }, 0) || 1;
    var sum = categories.reduce(function (acc, c) {
      return acc + categoryProgress(goals, c.id) * (c.weight || 0);
    }, 0);
    return sum / totalWeight;
  }

  function counts(plan) {
    var goals = plan.goals || [];
    var completed = goals.filter(function (g) { return g.done; }).length;
    return { completed: completed, total: goals.length };
  }

  function goalCountShare(goals, categoryId) {
    if (!goals.length) return 0;
    var inCategory = goals.filter(function (g) { return g.categoryId === categoryId; }).length;
    return inCategory / goals.length;
  }

  return {
    goalProgress: goalProgress,
    categoryProgress: categoryProgress,
    overallProgress: overallProgress,
    counts: counts,
    goalCountShare: goalCountShare
  };
})();
