window.PDI = window.PDI || {};

PDI.state = (function () {
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

  function setQuery(q) {
    ui.query = q;
    notify();
  }

  return {
    getState: getState,
    subscribe: subscribe,
    replacePlan: replacePlan,
    findGoal: findGoal,
    setQuery: setQuery
  };
})();
