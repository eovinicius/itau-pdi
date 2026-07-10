window.PDI = window.PDI || {};

PDI.storage = (function () {
  var KEY = 'pdi-plan-v1';
  var CURRENT_SCHEMA = 2;

  var migrations = {
    // v1 goals had title/description/smart/checklist/status/metrics; v2 flattens to text/done.
    1: function upgradeFrom1To2(plan) {
      plan.goals = (plan.goals || []).map(function (g) {
        return {
          id: g.id,
          text: g.text || g.title || '',
          categoryId: g.categoryId,
          horizon: g.horizon || 'short',
          deadline: g.deadline || null,
          done: g.done != null ? !!g.done : g.status === 'completed',
          order: g.order || 0,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt
        };
      });
      plan.schemaVersion = 2;
      return plan;
    }
  };

  function migratePlan(raw) {
    var plan = raw;
    var guard = 0;
    while (plan.schemaVersion < CURRENT_SCHEMA && guard < 20) {
      var step = migrations[plan.schemaVersion];
      if (!step) break;
      plan = step(plan);
      guard += 1;
    }
    plan.schemaVersion = CURRENT_SCHEMA;
    return plan;
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.goals)) return null;
      if (parsed.schemaVersion == null) parsed.schemaVersion = CURRENT_SCHEMA;
      return migratePlan(parsed);
    } catch (e) {
      console.warn('PDI.storage.load failed, ignoring stored data:', e);
      return null;
    }
  }

  function saveNow(plan) {
    try {
      localStorage.setItem(KEY, JSON.stringify(plan));
      return true;
    } catch (e) {
      console.error('PDI.storage.saveNow failed:', e);
      return false;
    }
  }

  var persist = PDI.utils.debounce(saveNow, 300);

  return { load: load, saveNow: saveNow, persist: persist, migratePlan: migratePlan, KEY: KEY };
})();
