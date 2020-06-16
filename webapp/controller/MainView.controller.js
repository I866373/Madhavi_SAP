sap.ui.define([
  "com/mysap/myworkflowUI5/controller/BaseController",
  "sap/ui/core/UIComponent",
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "../model/models"
], function (BaseController, UIComponent, Controller, MessageBox, MessageToast, JSONModel, Filter, FilterOperator, models) {
  "use strict";
  var destinationName = "BusinessRules";
  var evt;
  var plantID;
  var systemID;
  var productsModel = new sap.ui.model.json.JSONModel();
  return Controller.extend("com.mysap.myworkflowUI5.controller.MainView", {
    models: models,
    onAfterRendering: function () {
    },
    onInit: function () {
      // sap.ui.getCore().byId("idComboBox").setSelectedItemId("All");
      /*this.getView().setModel(new sap.ui.model.json.JSONModel({
        // text: "",
        result: "",
        result1: ""
      }));*/

    },
    startBusinessRule: function () {
      this._startRuleInstance();
    },
    startWorkflow: function () {
      var token = this._fetchToken();
      this._startInstance(token);

    },
    startProductsList: function () {

      this._getProductInfo(evt);
    },
    _startRuleInstance: function (sQuery) {
      var model = this.getView().getModel();
       //var result1;
      $.ajax({
        // url: "/bpmruleruntime/v2/workingset-rule-services",
        url: "/" + destinationName + "/rest/v2/workingset-rule-services",
        method: "POST",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
          "RuleServiceId": "fae08cc9ef0d41dd837776fd61b7b608",
          "Vocabulary": [
            {
              "Product": {
                "Category": sQuery
              }
            }
          ]
        }),
        success: function (result1) {
          model.setProperty("/result1", JSON.stringify(result1.Result[0], null, 4));
          debugger;
          systemID = result1.Result[0].Plants[0].SAPSystem;
          plantID = result1.Result[0].Plants[0].SAPPlant;
        }
      });
    },
    _startInstance: function (token) {
      var model = this.getView().getModel();
      //Method to call the workflow instance to process the sales order
      $.ajax({
        url: "/bpmworkflowruntime/v1/workflow-instances",
        method: "POST",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
          definitionId: "SalesOrderWorkflow",
          context: {
            "systemID": "OP",
            "PurchaseOrderByCustomer": "SO from Workflow",
            "Material": "MZ-TG-Y120",
            "SalesOrganization": "1710",
            "SoldToParty": "USCU_S10",
            "RequestedQuantityUnit": "PC",
            "RequestedQuantity": "1",
            "email": "chun.aun.gooi@sap.com",
            "SalesOrderType": "OR"

          }
        }),
        headers: {
          "X-CSRF-Token": token,
          "Content-Type": "application/json"
        },
        success: function (result) {
          model.setProperty("/result", JSON.stringify(result, null, 4));
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
    },
    _getProductInfo: function () {

      //VAlidate User selected productcategory
      //var selectedProductCategory = oEvent.getSource().getBindingContext().getProperty("PrdtCbx");
      //  sSelectedKey = selectedProductCategory.getSelectedKey(),
      //	  sValue = selectedProductCategory.getValue();

      //  ProductCategory = selectedProductCategory.getSelectedKey();
      //this._startRuleInstance();
      //Call Products API to get the products by Prod category
      // build filter array
      //  var aFilter = [];
      //    var sQuery = evt.getParameter("query");
      debugger;
      var sQuery = this.byId("idComboBox").getSelectedKey();
      this._startRuleInstance(sQuery);

      /*   if (sQuery) {
           aFilter.push(new Filter("ProductGroup", FilterOperator.Contains, "ZYouth"));
           aFilter.push(new Filter("PlantID", FilterOperator.Contains, "1710"));
         }*/
      // filter binding
      /*  var oList = this.getView().byId("__idProductsTable");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);*/

      var that = this;
      var eventBus = sap.ui.getCore().getEventBus();
      // subscribe to Delays
      eventBus.subscribe("root", "products-fetched", function (channel, event, data) {
        //  var productsModel = new sap.ui.model.json.JSONModel();
        that.getView().byId("__idProductsTable").setModel(productsModel);
        productsModel.setData(data);
      });
      //Set Products Model
      sap.ui.getCore().setModel(productsModel, "productsModel");

      // Publish Delays

      this.models.products.fetch(sQuery, systemID).then(function (data) {
        eventBus.publish("root", "products-fetched", data);
      });

    },
    onPress: function (oEvent) {
      // The source is the list item that got pressed
      //	this._showObject(oEvent.getSource());
      debugger;
      /* var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
       var selectedProductId = oEvent.getSource().getBindingContext().getProperty("ProductId");
       oRouter.navTo("ProductDetails", {
         productId: selectedProductId
       });*/
      var oItem = oEvent.getSource();
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("ProductDetails", {
        ProductId: oItem.getBindingContext().getProperty("ProductId")
      });
    },

    onNavBack: function () {
      history.go(-1);
    },
    onRefresh: function () {
      var oTable = this.byId("table");
      oTable.getBinding("items").refresh();
    }
  });
});
