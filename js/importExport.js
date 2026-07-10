window.PDI = window.PDI || {};

PDI.importExport = (function () {
  function exportJson() {
    var plan = PDI.state.getState().plan;
    var payload = Object.assign({}, plan, { exportedAt: PDI.utils.nowIso() });
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = 'pdi-plan-' + stamp + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function isValidPlan(obj) {
    return obj && typeof obj === 'object' &&
      Array.isArray(obj.categories) && Array.isArray(obj.goals);
  }

  function importFromFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var parsed = JSON.parse(reader.result);
          if (!isValidPlan(parsed)) {
            reject(new Error('Arquivo inválido: estrutura de plano não reconhecida.'));
            return;
          }
          if (parsed.schemaVersion == null) parsed.schemaVersion = 1;
          var migrated = PDI.storage.migratePlan(parsed);
          PDI.state.replacePlan(migrated);
          resolve(migrated);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = function () { reject(reader.error); };
      reader.readAsText(file);
    });
  }

  return { exportJson: exportJson, importFromFile: importFromFile };
})();
