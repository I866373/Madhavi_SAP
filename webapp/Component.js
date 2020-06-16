sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/Device",
  "com/mysap/myworkflowUI5/model/models"
], function (UIComponent, Device, models) {
  "use strict";

  return UIComponent.extend("com.mysap.myworkflowUI5.Component", {

    metadata: {
      manifest: "json"
    },

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    init: function () {
      // call the base component's init function
      UIComponent.prototype.init.apply(this, arguments);

      //set theme to Fiori 3
      sap.ui.getCore().applyTheme("sap_fiori_3");

      // enable routing
      this.getRouter().initialize();

      // Integrate CAI into ui5
      this.getProductChatbot();

      // set the device model
      this.setModel(models.createDeviceModel(), "device");
    },
    getProductChatbot: function () {
      //cross check if the element already there
      if (!document.getElementById("mychatbot")) {
        var oNewElement = document.createElement("script");
        oNewElement.setAttribute("id", "mychatbot");
        oNewElement.setAttribute("src", "https://cdn.cai.tools.sap/webchat/webchat.js");
        oNewElement.setAttribute("token", "e47a4fdb9acf2cefe3a8d225d50cfbae");
        oNewElement.setAttribute("ChannelId", "6cb45e1c-f9bf-4305-b93c-e4c46350276c");
        document.body.appendChild(oNewElement);

      }
    }
  });
});
