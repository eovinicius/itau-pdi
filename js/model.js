window.PDI = window.PDI || {};

PDI.model = (function () {
  var u = PDI.utils;

  function createCategory(opts) {
    return {
      id: opts.id || u.uuid(),
      name: opts.name,
      weight: opts.weight,
      icon: opts.icon || 'target'
    };
  }

  function createGoal(opts) {
    opts = opts || {};
    var now = u.nowIso();
    return {
      id: opts.id || u.uuid(),
      text: opts.text || '',
      objective: opts.objective || '',
      action: opts.action || '',
      deadline: opts.deadline || '',
      successCriteria: opts.successCriteria || '',
      expectedOutcome: opts.expectedOutcome || '',
      type: opts.type || '',
      categoryId: opts.categoryId || null,
      horizon: opts.horizon || 'short',
      done: !!opts.done,
      order: opts.order != null ? opts.order : 0,
      createdAt: opts.createdAt || now,
      updatedAt: opts.updatedAt || now
    };
  }

  function createPlan(opts) {
    opts = opts || {};
    var now = u.nowIso();
    return {
      schemaVersion: 9,
      meta: Object.assign({
        planName: 'Meu PDI',
        createdAt: now,
        updatedAt: now
      }, opts.meta || {}),
      categories: opts.categories || [],
      goals: opts.goals || []
    };
  }

  return { createCategory: createCategory, createGoal: createGoal, createPlan: createPlan };
})();
