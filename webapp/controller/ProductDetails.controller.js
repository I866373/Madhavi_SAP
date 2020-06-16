sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "com/mysap/myworkflowUI5/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
  "sap/m/MessageToast",
  "../model/models"
], function (Controller, BaseController, History, UIComponent, MessageToast, models) {
  "use strict";
  var plantID;
  var systemID;
  var prodID;
  var prodGroup;
  var qty;
  var oRouter;
  return Controller.extend("com.mysap.myworkflowUI5.controller.ProductDetails", {
    models: models,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf products.Products2.view.ProductDetails
		 */
    onInit: function () {

      oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("ProductDetails").attachPatternMatched(this._onObjectMatched, this);
      // oRouter.getRoute("ProductDetails").attachMatched(this._onRouteMatched, this);
    },
    _onRouteMatched: function (oEvent) {
      //debugger;
      var oArgs, oView;
      oArgs = oEvent.getParameter("arguments");
      oView = this.getView();
      oView.setModel(this.getOwnerComponent().getModel("productsModel"));
      // var oModel = oView.getModel().getData().d;
      var oModel = oView.getModel().getData().d.results;
      oView.bindElement({
        path: "d/results/(" + oArgs.productId + ")",
        oModel,
        events: {
          dataRequested: function () {
            oView.setBusy(true);
          },
          dataReceived: function () {
            oView.setBusy(false);
          }
        }
      });
    },
    _onObjectMatched: function (oEvent) {

      var oArgs, oView;
      oArgs = oEvent.getParameter("arguments");
      oView = this.getView();
      oView.setModel(sap.ui.getCore().getModel("productsModel"));
      // alert("oEvent" + oEvent);
      var oModel = oView.getModel().getData().d.results;
      var leng = oModel.length;
      // debugger;

      for (var i = 0; i < leng; i++) {
        if (oModel[i].ProductId === oArgs.ProductId) {
          qty = oModel[i].QuantityUnit;
          oView.byId("prdid").setText(oModel[i].ProductId);
          oView.byId("prdprice").setText(oModel[i].Price + oModel[i].CurrencyCode);
          oView.byId("prdname").setText(oModel[i].Name);
          // oView.byId("prdwt").setText(oModel[i].Weight + oModel[i].WeightUnit);
          oView.byId("prdwt").setText(qty);
          oView.byId("prdplntid").setText(oModel[i].PlantID);
          oView.byId("prdgrp").setText(oModel[i].ProductGroup);

          //set the variables to workflow call for SO Creation
          plantID = oModel[i].PlantID;
          systemID = oModel[i].System;
          prodID = oModel[i].ProductId;
          prodGroup = oModel[i].ProductGroup;

        }
      }
    },
    onNavBack: function () {
      // var oHistory = History.getInstance();
      // var sPreviousHash = oHistory.getPreviousHash();
      // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      // debugger;
      oRouter.navTo("MainView");
      // this.getRouter().getTargets().

    },
    startWorkflow: function () {
      var token = this._fetchToken();
      this._startInstance(token);

    },
    _startInstance: function (token) {
      // var model = this.getView().getModel();
      //Method to call the workflow instance to process the sales order
      $.ajax({
        url: "/bpmworkflowruntime/v1/workflow-instances",
        method: "POST",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
          definitionId: "SalesOrderWorkflow",
          context: {
            "systemID": systemID,
            "PurchaseOrderByCustomer": "SO from Workflow",
            "Material": prodID,
            "SalesOrganization": plantID,
            "SoldToParty": "USCU_S10",
            "RequestedQuantityUnit": "PC",
            "RequestedQuantity": qty,
            "SalesOrderType": "OR"
          }
        }),
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        success: function (result) {
          // model.setProperty("/result", JSON.stringify(result, null, 4));
          alert("Workflow result" + JSON.stringify(result, null, 4));
          MessageToast.show("Thank you for your order! Sales Order is initiated and you will soon receive an E-mail confirmation.");
        }
      });
    },

    _fetchToken: function () {
      var token;
      $.ajax({
        url: "/bpmworkflowruntime/v1/xsrf-token",
        method: "GET",
        async: false,
        headers: {
          "X-CSRF-Token": "Fetch"
        },
        success: function (result, xhr, data) {
          token = data.getResponseHeader("X-CSRF-Token");
        }
      });
      return token;
    }

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf products.Products2.view.ProductDetails
		 */
    //	onBeforeRendering: function() {
    //
    //	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf products.Products2.view.ProductDetails
		 */
    //	onAfterRendering: function() {
    //
    //	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf products.Products2.view.ProductDetails
		 */
    //	onExit: function() {
    //
    //	}

  });

});
