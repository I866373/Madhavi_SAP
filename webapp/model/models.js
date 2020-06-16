sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device"
], function (JSONModel, Device) {
  "use strict";
  var destName = "ESPM";
  return {
    createDeviceModel: function () {
      var oModel = new JSONModel(Device);
      oModel.setDefaultBindingMode("OneWay");
      return oModel;
    },
    products: {
      path: "/ProductSet",
      filter: "$filter=ProductGroup",
			/**
			 * Fetch delay stats to populate messages below the header
			 * @return {Promise}
			 */
      //  fetch: function (sQuery, systemID) {
      fetch: function (sQuery) {
        var pFormat = "&$format=" + "json";
        //	var pTop = "$top=" + 10;
        // var tokens = [destName, this.path, "?", this.filter, " eq '", sQuery, "' and System eq '", systemID, "'", pFormat];
        var tokens = [destName, this.path, "?", this.filter, " eq '", sQuery, "' and System eq 'OnPremise'", pFormat];
        return $.ajax({
          url: tokens.join(""),
          type: "GET",
          async: true
        });
      }
    }
  };
});
