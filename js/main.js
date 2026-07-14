(function () {
  var icons = PDI.icons;
  var state = PDI.state;

  function setIcon(id, name, size) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = icons.svg(name, { size: size || 18 });
  }

  function wireHeaderIcons() {
    setIcon('print-btn', 'printer');
    setIcon('export-btn', 'download');
    setIcon('import-btn', 'upload');
    setIcon('search-icon-slot', 'search', 15);
  }

  function wireControls() {
    var searchInput = document.getElementById('search-input');
    var onSearch = PDI.utils.debounce(function (e) { state.setQuery(e.target.value); }, 200);
    searchInput.addEventListener('input', onSearch);
  }

  function wireImportExport() {
    document.getElementById('export-btn').addEventListener('click', function () {
      PDI.importExport.exportJson();
    });
    var importBtn = document.getElementById('import-btn');
    var importInput = document.getElementById('import-input');
    importBtn.addEventListener('click', function () { importInput.click(); });
    importInput.addEventListener('change', function () {
      var file = importInput.files && importInput.files[0];
      if (!file) return;
      PDI.importExport.importFromFile(file).catch(function (err) {
        alert('Não foi possível importar o arquivo: ' + err.message);
      }).finally(function () {
        importInput.value = '';
      });
    });
  }

  function boot() {
    var loaded = PDI.storage.load();
    if (loaded) {
      state.replacePlan(loaded, { silent: true });
    } else {
      state.replacePlan(PDI.seed.buildSeedPlan());
    }

    wireHeaderIcons();
    wireControls();
    wireImportExport();
    PDI.theme.init();
    PDI.print.init();

    state.subscribe(PDI.render.renderApp);
    PDI.render.renderApp(state.getState());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
