window.PDI = window.PDI || {};

/* Conteúdo inicial gerado a partir da entrevista e de pdi.md (Mid -> Senior, Itaú/IFA). */
PDI.seed = (function () {
  var model = PDI.model;

  var CAT_THEO = 'cat-theoretical';
  var CAT_PRAC = 'cat-practical';
  var CAT_HAND = 'cat-handson';

  function categories() {
    return [
      model.createCategory({ id: CAT_THEO, name: 'Conhecimento teórico', weight: 0.5, icon: 'bookOpen' }),
      model.createCategory({ id: CAT_PRAC, name: 'Conhecimento prático', weight: 0.4, icon: 'wrench' }),
      model.createCategory({ id: CAT_HAND, name: "Hand's on", weight: 0.1, icon: 'hammer' })
    ];
  }

  function g(text, categoryId, horizon) {
    return model.createGoal({ text: text, categoryId: categoryId, horizon: horizon });
  }

  function goals() {
    return [
      // Teórico
      g('Curso AWS Solutions Architect Associate (Udemy) + certificação', CAT_THEO, 'short'),
      g('Curso System Design / Distributed Systems (LinuxTips)', CAT_THEO, 'short'),
      g('Inglês técnico: ler 1 artigo/semana sem tradutor', CAT_THEO, 'short'),
      g('Certificação AWS Developer Associate', CAT_THEO, 'long'),
      g('Aprofundar resiliência e escalabilidade (livro/curso de referência)', CAT_THEO, 'long'),
      g('Inglês: participar de 1 call técnica sem apoio', CAT_THEO, 'long'),

      // Prático
      g('Alinhar com o Tech Lead os critérios de promoção e do PRAD', CAT_PRAC, 'short'),
      g('Criar módulo Terraform reutilizável para o squad', CAT_PRAC, 'short'),
      g('Melhorar observabilidade (dashboard + alerta) no Datadog', CAT_PRAC, 'short'),
      g('Escrever o primeiro documento técnico interno', CAT_PRAC, 'short'),
      g('Fazer a primeira apresentação técnica pro squad', CAT_PRAC, 'short'),
      g('Ser owner de 1 decisão arquitetural (ADR)', CAT_PRAC, 'long'),
      g('Liderar 1 entrega ponta a ponta', CAT_PRAC, 'long'),
      g('Fazer 4 sessões de mentoria/pairing', CAT_PRAC, 'long'),

      // Hand's on
      g('PoC de arquitetura serverless com resiliência (retry + DLQ)', CAT_HAND, 'short'),
      g('Aplicar AWS/Terraform numa iniciativa real do roadmap do IFA', CAT_HAND, 'short'),
      g('PoC avançada de Event-Driven Architecture', CAT_HAND, 'long'),
      g('Propor melhoria de maturidade de IaC no time', CAT_HAND, 'long')
    ].map(function (goal, idx) {
      goal.order = idx;
      return goal;
    });
  }

  function buildSeedPlan() {
    return model.createPlan({
      meta: { planName: 'PDI — Pleno → Sênior' },
      categories: categories(),
      goals: goals()
    });
  }

  return { buildSeedPlan: buildSeedPlan };
})();
