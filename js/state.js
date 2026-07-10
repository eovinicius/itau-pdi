window.PDI = window.PDI || {};

PDI.state = (function () {
  var u = PDI.utils;
  var model = PDI.model;

  var plan = model.createPlan();
  var ui = { query: '' };

  var listeners = [];

  function subscribe(fn) {
    listeners.push(fn);
    return function unsubscribe() {
      listeners = listeners.filter(function (l) { return l !== fn; });
    };
  }

  function notify() {
    listeners.forEach(function (fn) { fn(getState()); });
  }

  function touchPlan() {
    plan.meta.updatedAt = u.nowIso();
    PDI.storage.persist(plan);
  }

  function getState() {
    return { plan: plan, ui: ui };
  }

  function replacePlan(newPlan, opts) {
    plan = newPlan;
    if (!opts || !opts.silent) {
      PDI.storage.saveNow(plan);
    }
    notify();
  }

  function findGoal(id) {
    return plan.goals.find(function (g) { return g.id === id; });
  }

  function addGoal(partial) {
    var order = plan.goals.filter(function (g) {
      return g.categoryId === partial.categoryId && g.horizon === partial.horizon;
    }).length;
    var goal = model.createGoal(Object.assign({ order: order }, partial || {}));
    plan.goals.push(goal);
    touchPlan();
    notify();
    return goal;
  }

  function updateGoal(id, patch) {
    var goal = findGoal(id);
    if (!goal) return;
    Object.assign(goal, patch);
    goal.updatedAt = u.nowIso();
    touchPlan();
    notify();
  }

  function toggleGoalDone(id) {
    var goal = findGoal(id);
    if (!goal) return;
    updateGoal(id, { done: !goal.done });
  }

  function removeGoal(id) {
    plan.goals = plan.goals.filter(function (g) { return g.id !== id; });
    touchPlan();
    notify();
  }

  function setQuery(q) {
    ui.query = q;
    notify();
  }

  return {
    getState: getState,
    subscribe: subscribe,
    replacePlan: replacePlan,
    findGoal: findGoal,
    addGoal: addGoal,
    updateGoal: updateGoal,
    toggleGoalDone: toggleGoalDone,
    removeGoal: removeGoal,
    setQuery: setQuery
  };
})();
