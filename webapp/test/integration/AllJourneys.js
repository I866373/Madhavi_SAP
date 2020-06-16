sap.ui.define([
  "sap/ui/test/Opa5",
  "com/mysap/myworkflowUI5/test/integration/arrangements/Startup",
  "com/mysap/myworkflowUI5/test/integration/BasicJourney"
], function(Opa5, Startup) {
  "use strict";

  Opa5.extendConfig({
    arrangements: new Startup(),
    pollingInterval: 1
  });

});
