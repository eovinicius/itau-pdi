window.PDI = window.PDI || {};

PDI.storage = (function () {
  var KEY = 'pdi-plan-v1';
  var CURRENT_SCHEMA = 10;

  // v5 backfill: an objective (goal.text) derived from each seed action, keyed by the
  // action string, so plans that still have a blank objective get one on load.
  var OBJECTIVE_BY_ACTION = {
    'Curso AWS Solutions Architect Associate (Udemy) + certificação': 'Dominar os fundamentos de arquitetura de soluções na AWS',
    'Curso System Design / Distributed Systems (LinuxTips)': 'Fortalecer a base em design de sistemas distribuídos',
    'Inglês técnico: ler 1 artigo/semana sem tradutor': 'Ganhar fluência de leitura em inglês técnico',
    'Certificação AWS Developer Associate': 'Aprofundar o conhecimento de desenvolvimento na AWS',
    'Aprofundar resiliência e escalabilidade (livro/curso de referência)': 'Consolidar o domínio de resiliência e escalabilidade de sistemas',
    'Inglês: participar de 1 call técnica sem apoio': 'Atingir autonomia na comunicação técnica oral em inglês',
    'Alinhar com o Tech Lead os critérios de promoção e do PRAD': 'Ter clareza sobre os critérios de promoção a Sênior',
    'Criar módulo Terraform reutilizável para o squad': 'Elevar a maturidade de IaC do squad com componentes reutilizáveis',
    'Melhorar observabilidade (dashboard + alerta) no Datadog': 'Aumentar a observabilidade dos serviços do time',
    'Escrever o primeiro documento técnico interno': 'Desenvolver a habilidade de comunicação técnica escrita',
    'Fazer a primeira apresentação técnica pro squad': 'Desenvolver a habilidade de comunicação técnica em público',
    'Ser owner de 1 decisão arquitetural (ADR)': 'Assumir protagonismo em decisões de arquitetura',
    'Liderar 1 entrega ponta a ponta': 'Demonstrar capacidade de liderança técnica de ponta a ponta',
    'Fazer 4 sessões de mentoria/pairing': 'Desenvolver a habilidade de mentoria e fortalecer o time',
    'PoC de arquitetura serverless com resiliência (retry + DLQ)': 'Aplicar padrões de resiliência em arquitetura serverless na prática',
    'Aplicar AWS/Terraform numa iniciativa real do roadmap do IFA': 'Levar conhecimento de AWS/IaC para uma entrega real do produto',
    'PoC avançada de Event-Driven Architecture': 'Dominar arquitetura orientada a eventos na prática',
    'Propor melhoria de maturidade de IaC no time': 'Influenciar a evolução técnica de IaC do time'
  };

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
    },
    // v3 adds the detail fields action/deadline/successCriteria (default '').
    2: function upgradeFrom2To3(plan) {
      plan.goals = (plan.goals || []).map(function (g) {
        return Object.assign({}, g, {
          action: g.action || '',
          deadline: g.deadline || '',
          successCriteria: g.successCriteria || ''
        });
      });
      plan.schemaVersion = 3;
      return plan;
    },
    // v4: the goal title (text) is now the objective; the old action-like title moves
    // into `action` and the objective starts blank. Drops the retired `objective` key.
    3: function upgradeFrom3To4(plan) {
      plan.goals = (plan.goals || []).map(function (g) {
        var text = g.text || '';
        var action = g.action || '';
        if (!action && text) { action = text; text = ''; }
        var out = Object.assign({}, g, { text: text, action: action });
        delete out.objective;
        return out;
      });
      plan.schemaVersion = 4;
      return plan;
    },
    // v5: backfill a blank objective (text) from the action, using the map above.
    4: function upgradeFrom4To5(plan) {
      plan.goals = (plan.goals || []).map(function (g) {
        if ((!g.text || !g.text.trim()) && g.action && OBJECTIVE_BY_ACTION[g.action]) {
          return Object.assign({}, g, { text: OBJECTIVE_BY_ACTION[g.action] });
        }
        return g;
      });
      plan.schemaVersion = 5;
      return plan;
    },
    // v6 adds objective/expectedOutcome and backfills the detail fields from the seed
    // (matched by title) when empty — so existing plans show the richer content on load.
    5: function upgradeFrom5To6(plan) {
      var byText = {};
      try {
        (PDI.seed.buildSeedPlan().goals || []).forEach(function (s) {
          if (s.text) byText[s.text] = s;
        });
      } catch (e) { /* seed unavailable: still add the empty keys below */ }
      var FIELDS = ['objective', 'deadline', 'successCriteria', 'expectedOutcome'];
      plan.goals = (plan.goals || []).map(function (g) {
        var out = Object.assign({}, g);
        if (out.objective == null) out.objective = '';
        if (out.expectedOutcome == null) out.expectedOutcome = '';
        var src = byText[out.text];
        if (src) {
          FIELDS.forEach(function (f) {
            if (!out[f] || !String(out[f]).trim()) out[f] = src[f] || '';
          });
        }
        return out;
      });
      plan.schemaVersion = 6;
      return plan;
    },
    // v7 adds `type` (goal kind) and backfills it from the seed (matched by title).
    6: function upgradeFrom6To7(plan) {
      var byText = {};
      try {
        (PDI.seed.buildSeedPlan().goals || []).forEach(function (s) {
          if (s.text) byText[s.text] = s;
        });
      } catch (e) { /* seed unavailable: still add the empty key below */ }
      plan.goals = (plan.goals || []).map(function (g) {
        var out = Object.assign({}, g);
        if (out.type == null) out.type = '';
        var src = byText[out.text];
        if (src && (!out.type || !String(out.type).trim())) out.type = src.type || '';
        return out;
      });
      plan.schemaVersion = 7;
      return plan;
    },
    // v8 reconciles category names (by id) and each goal's categoryId (by title) from
    // the seed — the categories were renamed and several goals re-categorized.
    7: function upgradeFrom7To8(plan) {
      var seed;
      try { seed = PDI.seed.buildSeedPlan(); } catch (e) { seed = null; }
      if (seed) {
        var nameById = {};
        seed.categories.forEach(function (c) { nameById[c.id] = c.name; });
        (plan.categories || []).forEach(function (c) { if (nameById[c.id]) c.name = nameById[c.id]; });
        var catByText = {};
        seed.goals.forEach(function (s) { if (s.text) catByText[s.text] = s.categoryId; });
        (plan.goals || []).forEach(function (g) { if (catByText[g.text]) g.categoryId = catByText[g.text]; });
      }
      plan.schemaVersion = 8;
      return plan;
    },
    // v9 rebalanced the plan (added/removed goals to fit the 50/40/10 weights). Sync the
    // default plan's goals+categories from the seed. Guarded by a title overlap so a
    // custom imported plan (different titles) is left untouched.
    8: function upgradeFrom8To9(plan) {
      var seed;
      try { seed = PDI.seed.buildSeedPlan(); } catch (e) { seed = null; }
      if (seed) {
        var seedTitles = {};
        seed.goals.forEach(function (s) { if (s.text) seedTitles[s.text] = true; });
        var looksLikeSeed = (plan.goals || []).some(function (g) { return seedTitles[g.text]; });
        if (looksLikeSeed) {
          plan.categories = seed.categories;
          plan.goals = seed.goals;
        }
      }
      plan.schemaVersion = 9;
      return plan;
    },
    // v10 removeu metas fora do contexto do time (contêineres/Kubernetes, Clean Code, lab
    // de Kubernetes, maturidade de IaC do squad), trocou a PoC de CI/CD por uma PoC de Saga
    // pattern e deixou a trilha de mensageria específica de Kafka. Sincroniza goals+categories
    // do seed, guardado por sobreposição de títulos (os ~11 títulos inalterados garantem o
    // match) para não tocar planos importados.
    9: function upgradeFrom9To10(plan) {
      var seed;
      try { seed = PDI.seed.buildSeedPlan(); } catch (e) { seed = null; }
      if (seed) {
        var seedTitles = {};
        seed.goals.forEach(function (s) { if (s.text) seedTitles[s.text] = true; });
        var looksLikeSeed = (plan.goals || []).some(function (g) { return seedTitles[g.text]; });
        if (looksLikeSeed) {
          plan.categories = seed.categories;
          plan.goals = seed.goals;
        }
      }
      plan.schemaVersion = 10;
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
