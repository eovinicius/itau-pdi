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
      model.createCategory({ id: CAT_PRAC, name: 'Experimentação prática', weight: 0.4, icon: 'wrench' }),
      model.createCategory({ id: CAT_HAND, name: 'Aplicação no trabalho', weight: 0.1, icon: 'hammer' })
    ];
  }

  // Prazo derivado do horizonte, para o modal não ficar com "PRAZO: —".
  var DL_SHORT = '6–12 meses';
  var DL_LONG = '12–36 meses';

  // Cada meta: title (headline da matriz) + objective/action/deadline/successCriteria/
  // expectedOutcome exibidos no modal. `successCriteria` é multi-linha (1 critério/linha).
  function g(spec) {
    return model.createGoal({
      text: spec.title,
      objective: spec.objective,
      action: spec.action,
      deadline: spec.deadline,
      successCriteria: spec.successCriteria,
      expectedOutcome: spec.expectedOutcome,
      type: spec.type,
      categoryId: spec.categoryId,
      horizon: spec.horizon
    });
  }

  function goals() {
    return [
      // ── Conhecimento teórico (50%) — 6 curto + 3 longo ──
      g({
        title: 'Dominar os fundamentos de arquitetura de soluções na AWS',
        objective: 'Construir base sólida nos serviços core da AWS (compute, storage, rede, IAM) e nos pilares do Well-Architected Framework para desenhar soluções na nuvem com segurança e custo-eficiência.',
        action: 'Curso AWS Solutions Architect Associate (Udemy) + certificação',
        deadline: DL_SHORT,
        successCriteria: 'Curso concluído (100% das aulas)\nCertificação AWS Solutions Architect Associate obtida\nDesenhar 1 arquitetura de referência aplicando o Well-Architected',
        expectedOutcome: 'Ser capaz de propor e justificar arquiteturas AWS adequadas ao contexto do time, considerando custo, segurança e escalabilidade.',
        type: 'curso',
        categoryId: CAT_THEO, horizon: 'short'
      }),
      g({
        title: 'Aprofundar fundamentos de contêineres e Kubernetes',
        objective: 'Entender contêineres (Docker) e orquestração com Kubernetes para operar e evoluir aplicações cloud-native com segurança.',
        action: 'Curso de Docker + Kubernetes (fundamentos ao intermediário)',
        deadline: DL_SHORT,
        successCriteria: 'Curso concluído\nEntender pods, deployments e services\nSubir uma aplicação conteinerizada localmente',
        expectedOutcome: 'Compreender como aplicações rodam em contêineres/Kubernetes e conversar sobre o tema com propriedade.',
        type: 'curso',
        categoryId: CAT_THEO, horizon: 'short'
      }),
      g({
        title: 'Consolidar Clean Code e boas práticas de arquitetura',
        objective: 'Aprofundar princípios de código limpo, SOLID e padrões de arquitetura para escrever software mais sustentável.',
        action: 'Ler um livro de referência (ex.: Clean Architecture) e revisar os princípios SOLID',
        deadline: DL_SHORT,
        successCriteria: 'Livro de referência concluído\nMapear princípios aplicáveis ao código atual\nCompartilhar 1 aprendizado com o time',
        expectedOutcome: 'Escrever e revisar código com critérios claros de qualidade e desenho.',
        type: 'estudo',
        categoryId: CAT_THEO, horizon: 'short'
      }),
      g({
        title: 'Estudar mensageria e event streaming',
        objective: 'Compreender fundamentos de mensageria e streaming de eventos (filas, tópicos, entrega, ordenação) aplicáveis a sistemas distribuídos.',
        action: 'Estudo de Kafka/SNS/SQS (conceitos e casos de uso)',
        deadline: DL_SHORT,
        successCriteria: 'Diferença entre filas e tópicos compreendida\nMapear casos de uso no contexto do time\nDocumentar um resumo dos aprendizados',
        expectedOutcome: 'Ter base para desenhar e discutir soluções assíncronas orientadas a eventos.',
        type: 'estudo',
        categoryId: CAT_THEO, horizon: 'short'
      }),
      g({
        title: 'Fortalecer a base em design de sistemas distribuídos',
        objective: 'Desenvolver uma base sólida em System Design e arquiteturas distribuídas para aplicar no desenvolvimento de sistemas escaláveis.',
        action: 'Curso System Design / Distributed Systems (LinuxTips)',
        deadline: DL_SHORT,
        successCriteria: 'Curso concluído\nCriar uma PoC utilizando os conceitos estudados\nAplicar os conhecimentos em uma demanda real',
        expectedOutcome: 'Ser capaz de participar de decisões arquiteturais envolvendo sistemas distribuídos e propor soluções mais escaláveis.',
        type: 'curso',
        categoryId: CAT_THEO, horizon: 'short'
      }),
      g({
        title: 'Ganhar fluência de leitura em inglês técnico',
        objective: 'Alcançar autonomia na leitura de documentação, artigos e RFCs em inglês sem depender de tradutor, acelerando o aprendizado técnico.',
        action: 'Inglês técnico: ler 1 artigo/semana sem tradutor',
        deadline: DL_SHORT,
        successCriteria: 'Ler ao menos 1 artigo técnico por semana sem tradutor\nRegistrar um resumo dos principais aprendizados\nLer a documentação oficial de uma ferramenta direto em inglês',
        expectedOutcome: 'Consumir conteúdo técnico de referência em inglês com naturalidade, reduzindo a barreira de idioma no dia a dia.',
        type: 'idioma',
        categoryId: CAT_THEO, horizon: 'short'
      }),
      g({
        title: 'Aprofundar o conhecimento de desenvolvimento na AWS',
        objective: 'Aprofundar o uso dos serviços AWS na perspectiva de desenvolvimento (SDK, serverless, CI/CD, observabilidade) para construir aplicações cloud-native.',
        action: 'Certificação AWS Developer Associate',
        deadline: DL_LONG,
        successCriteria: 'Estudo do conteúdo da certificação concluído\nCertificação AWS Developer Associate obtida\nImplementar 1 função serverless integrando serviços AWS',
        expectedOutcome: 'Desenvolver e integrar serviços AWS com autonomia em aplicações reais do time.',
        type: 'certificacao',
        categoryId: CAT_THEO, horizon: 'long'
      }),
      g({
        title: 'Consolidar o domínio de resiliência e escalabilidade de sistemas',
        objective: 'Aprofundar padrões de resiliência (retry, circuit breaker, timeout, DLQ) e estratégias de escalabilidade para projetar sistemas tolerantes a falhas.',
        action: 'Aprofundar resiliência e escalabilidade (livro/curso de referência)',
        deadline: DL_LONG,
        successCriteria: 'Livro/curso de referência concluído\nMapear os padrões de resiliência aplicáveis a um serviço do time\nAplicar ao menos 1 padrão em um serviço real',
        expectedOutcome: 'Projetar e revisar sistemas com foco em tolerância a falhas e capacidade de escalar sob carga.',
        type: 'estudo',
        categoryId: CAT_THEO, horizon: 'long'
      }),
      g({
        title: 'Atingir autonomia na comunicação técnica oral em inglês',
        objective: 'Desenvolver confiança e vocabulário para conduzir e participar de conversas técnicas em inglês sem apoio de tradução.',
        action: 'Inglês: participar de 1 call técnica sem apoio',
        deadline: DL_LONG,
        successCriteria: 'Participar de ao menos 1 call técnica em inglês sem apoio\nApresentar um tópico técnico curto em inglês\nPraticar conversação técnica com regularidade',
        expectedOutcome: 'Comunicar-se em contextos técnicos em inglês (calls, apresentações) com autonomia.',
        type: 'idioma',
        categoryId: CAT_THEO, horizon: 'long'
      }),

      // ── Experimentação prática (40%) — 3 curto + 2 longo ──
      g({
        title: 'Aplicar padrões de resiliência em arquitetura serverless na prática',
        objective: 'Validar na prática padrões de resiliência (retry e dead-letter queue) em uma arquitetura serverless.',
        action: 'PoC de arquitetura serverless com resiliência (retry + DLQ)',
        deadline: DL_SHORT,
        successCriteria: 'PoC serverless implementada com retry e DLQ\nCenário de falha testado e tratado\nAprendizados documentados',
        expectedOutcome: 'Aplicar padrões de resiliência serverless com segurança em soluções reais.',
        type: 'poc',
        categoryId: CAT_PRAC, horizon: 'short'
      }),
      g({
        title: 'Montar um lab de Kubernetes local com uma aplicação',
        objective: 'Praticar contêineres e Kubernetes subindo uma aplicação em um cluster local, do build ao deploy.',
        action: 'Lab pessoal: subir uma app em Kubernetes local (kind/minikube)',
        deadline: DL_SHORT,
        successCriteria: 'Cluster local funcionando\nAplicação implantada com deployment + service\nApp exposta e validada localmente',
        expectedOutcome: 'Ganhar confiança prática para operar aplicações em Kubernetes.',
        type: 'pratica',
        categoryId: CAT_PRAC, horizon: 'short'
      }),
      g({
        title: 'PoC de pipeline CI/CD completo',
        objective: 'Validar na prática um fluxo de CI/CD do build ao deploy, entendendo etapas e automações.',
        action: 'PoC de pipeline CI/CD (build → testes → deploy) num projeto de teste',
        deadline: DL_SHORT,
        successCriteria: 'Pipeline executando build e testes\nDeploy automatizado para um ambiente de teste\nProcesso documentado',
        expectedOutcome: 'Saber estruturar um pipeline de CI/CD e aplicá-lo em projetos reais.',
        type: 'poc',
        categoryId: CAT_PRAC, horizon: 'short'
      }),
      g({
        title: 'Dominar arquitetura orientada a eventos na prática',
        objective: 'Aprofundar Event-Driven Architecture (eventos, filas, tópicos, idempotência) por meio de uma PoC avançada.',
        action: 'PoC avançada de Event-Driven Architecture',
        deadline: DL_LONG,
        successCriteria: 'PoC de EDA implementada\nFluxo assíncrono com idempotência tratado\nTrade-offs de EDA documentados',
        expectedOutcome: 'Projetar fluxos assíncronos orientados a eventos com propriedade.',
        type: 'poc',
        categoryId: CAT_PRAC, horizon: 'long'
      }),
      g({
        title: 'Projeto pessoal com arquitetura orientada a eventos',
        objective: 'Consolidar Event-Driven Architecture construindo um projeto pessoal com mensageria (Kafka/SQS), tratando idempotência e falhas.',
        action: 'Projeto pessoal aplicando EDA com filas/tópicos',
        deadline: DL_LONG,
        successCriteria: 'Projeto com produção e consumo de eventos\nIdempotência e retry tratados\nCódigo publicado em repositório pessoal',
        expectedOutcome: 'Dominar, na prática, o desenho de sistemas orientados a eventos.',
        type: 'pratica',
        categoryId: CAT_PRAC, horizon: 'long'
      }),

      // ── Aplicação no trabalho (10%) — 2 curto + 2 longo ──
      g({
        title: 'Elevar a maturidade de IaC do squad com componentes reutilizáveis',
        objective: 'Padronizar e acelerar provisionamentos do squad criando módulos Terraform reutilizáveis, versionados e documentados.',
        action: 'Criar módulo Terraform reutilizável para o squad',
        deadline: DL_SHORT,
        successCriteria: 'Módulo Terraform reutilizável criado e versionado\nMódulo adotado em ao menos 1 serviço do squad\nDocumentação de uso disponível para o time',
        expectedOutcome: 'Reduzir retrabalho e inconsistências de infraestrutura, com o squad reutilizando componentes padronizados.',
        type: 'pratica',
        categoryId: CAT_HAND, horizon: 'short'
      }),
      g({
        title: 'Levar conhecimento de AWS/IaC para uma entrega real do produto',
        objective: 'Transformar o aprendizado de AWS e Terraform em valor concreto, aplicando-o em uma iniciativa real do roadmap do IFA.',
        action: 'Aplicar AWS/Terraform numa iniciativa real do roadmap do IFA',
        deadline: DL_SHORT,
        successCriteria: 'Recursos provisionados via Terraform em iniciativa real\nSolução AWS entregue e em uso\nInfraestrutura versionada e revisada',
        expectedOutcome: 'Entregar valor real ao produto aplicando AWS/IaC, não apenas em estudos.',
        type: 'entrega',
        categoryId: CAT_HAND, horizon: 'short'
      }),
      g({
        title: 'Assumir protagonismo em decisões de arquitetura',
        objective: 'Liderar uma decisão de arquitetura de ponta a ponta, avaliando alternativas e registrando a decisão em um ADR.',
        action: 'Ser owner de 1 decisão arquitetural (ADR)',
        deadline: DL_LONG,
        successCriteria: 'ADR escrito e aprovado pelo time\nAlternativas e trade-offs documentados\nDecisão implementada',
        expectedOutcome: 'Ser referência em conduzir e documentar decisões arquiteturais no time.',
        type: 'arquitetura',
        categoryId: CAT_HAND, horizon: 'long'
      }),
      g({
        title: 'Demonstrar capacidade de liderança técnica de ponta a ponta',
        objective: 'Conduzir uma entrega do início ao fim — do desenho técnico ao deploy — coordenando dependências e pessoas.',
        action: 'Liderar 1 entrega ponta a ponta',
        deadline: DL_LONG,
        successCriteria: 'Entrega liderada do desenho ao deploy\nRiscos e dependências gerenciados\nEntrega concluída dentro do combinado',
        expectedOutcome: 'Ser reconhecido como capaz de liderar entregas técnicas complexas com autonomia.',
        type: 'entrega',
        categoryId: CAT_HAND, horizon: 'long'
      })
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
