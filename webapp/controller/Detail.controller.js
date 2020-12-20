sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
    "sap/m/library",
], function (BaseController, JSONModel, formatter, mobileLibrary) {
    "use strict";
    

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("be.ap.product.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy : false,
				delay : 0,
				lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
            });

            // var oModel = new sap.ui.model.json.JSONModel("../model/categories.json");
            // var comboBox = this.getView().byId("selectCategory");
            // comboBox.setModel(oModel);

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

            this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
            
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onSendEmailPress : function () {
			var oViewModel = this.getModel("detailView");

			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},


		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onListUpdateFinished : function (oEvent) {
			var sTitle,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");

			// only update the counter if the length is final
			if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);
			}
        },
                
        updateInputFields : function(visible) {
            this.getView().byId("category").setEnabled(visible);
            this.getView().byId("supplier").setEnabled(visible);
            this.getView().byId("name").setEnabled(visible);
            this.getView().byId("description").setEnabled(visible);
            this.getView().byId("price").setEnabled(visible);
            this.getView().byId("uom").setEnabled(visible);
            this.getView().byId("weight").setEnabled(visible);
            this.getView().byId("width").setEnabled(visible);
            this.getView().byId("depth").setEnabled(visible);
            this.getView().byId("height").setEnabled(visible);
            this.getView().byId("unit").setEnabled(visible);
            this.getView().byId("weightButton").setEnabled(visible);
        },
        
        handleNewPress : function(oEvent) {
            this.getView().byId("new").setEnabled(false);
            this.getView().byId("saveNew").setVisible(true);
            this.getView().byId("saveEdit").setVisible(false);
            this.getView().byId("cancel").setVisible(true);

            this.updateInputFields(true);

            // this.getView().byId("category").setValue("");
            // this.getView().byId("supplier").setValue("");
            // this.getView().byId("name").setValue("");
            // this.getView().byId("description").setValue("");
            // this.getView().byId("price").setValue("");
            // this.getView().byId("uom").setValue("");
            // this.getView().byId("weight").setValue("");
            // this.getView().byId("width").setValue("");
            // this.getView().byId("depth").setValue("");
            // this.getView().byId("height").setValue("");
            // this.getView().byId("unit").setValue("");
            // this.getView().byId("weightButton").setValue("");
        },

        handleCancelPress : function(oEvent) {
            sap.m.MessageToast.show("Cancelled");

            this.getView().byId("saveNew").setVisible(false);
            this.getView().byId("saveEdit").setVisible(false);
            this.getView().byId("cancel").setVisible(false);
            this.getView().byId("new").setEnabled(true);

            this.updateInputFields(false);
        },

        handleEditPress : function(oEvent) {
            this.getView().byId("saveEdit").setVisible(true);
            this.getView().byId("saveNew").setVisible(false);
            this.getView().byId("cancel").setVisible(true);

            this.updateInputFields(true);
        },
            
        handleSavePressEdit : function(oEvent) {

             var category = this.getView().byId("category").getValue(),
             productID = this.getView().byId("productID").getValue(),
             supplier = this.getView().byId("supplier").getValue(),
             name = this.getView().byId("name").getValue(),
             description = this.getView().byId("description").getValue(),
             price = this.getView().byId("price").getValue(),
             uom = this.getView().byId("uom").getValue(),
             weight = this.getView().byId("weight").getValue(),
             width = this.getView().byId("width").getValue(),
             depth = this.getView().byId("depth").getValue(),
             height = this.getView().byId("height").getValue(),
             unit = this.getView().byId("unit").getValue();

                var productUpdate = {
                                     ProductId: productID,
                                     SupplierId: parseInt(supplier),
                                     Category : category,
                                     Weight: weight,
                                     WeightUnit: 'KG',
                                     Description: description,
                                     Name: name,
                                     Uom: 'PC',
                                     Price: price,
                                     Currency: 'EUR',
                                     Width: width,
                                     Depth: depth,
                                     Height: height,
                                     DimUnit: 'CM',
                                     };
                    var oModel = this.getView().getModel();
                    oModel.update("/ProductSet('" + productID + "')", productUpdate, { method: "PUT",
                                                                success: function(data) {
                                                                sap.m.MessageToast.show("Product Updated.");
                                                                }, error: function(e) {
                                                                sap.m.MessageToast.show("Error, product not updated.");}});

            // sap.m.MessageToast.show("Product Saved");

            this.getView().byId("saveEdit").setVisible(false);
            this.getView().byId("saveNew").setVisible(false);
            this.getView().byId("cancel").setVisible(false);
            this.getView().byId("new").setEnabled(true);

            this.updateInputFields(false);
        },


        
        handleSavePressNew : function(oEvent) {

             var category = this.getView().byId("category").getValue(),
             productID = this.getView().byId("productID").getValue(),
             supplier = this.getView().byId("supplier").getValue(),
             name = this.getView().byId("name").getValue(),
             description = this.getView().byId("description").getValue(),
             price = this.getView().byId("price").getValue(),
             uom = this.getView().byId("uom").getValue(),
             weight = this.getView().byId("weight").getValue(),
             width = this.getView().byId("width").getValue(),
             depth = this.getView().byId("depth").getValue(),
             height = this.getView().byId("height").getValue(),
             unit = this.getView().byId("unit").getValue();


                 var productCreate = {
                                     SupplierId: parseInt(supplier),
                                     Category : category,
                                     Weight: weight,
                                     WeightUnit: 'KG',
                                     Description: description,
                                     Name: name,
                                     Uom: 'PC',
                                     Price: price,
                                     Currency: 'EUR',
                                     Width: width,
                                     Depth: depth,
                                     Height: height,
                                     DimUnit: 'CM',
                                     };

                   var oModel = this.getView().getModel();
                   oModel.create("/ProductSet", productCreate, { method: "POST",
                                                                success: function(data) {
                                                                sap.m.MessageToast.show("Product Saved.");
                                                                }, error: function(e) {
                                                                sap.m.MessageToast.show("Error, product not saved.");}});

            // sap.m.MessageToast.show("Product Saved");

            this.getView().byId("save").setVisible(false);
            this.getView().byId("cancel").setVisible(false);
            this.getView().byId("new").setEnabled(true);

            this.updateInputFields(false);
        },



        handleDeletePress : function() {

            var oModel = this.getView().getModel();
            var productID = this.getView().byId("productID").getValue();

            oModel.callFunction("/SET_STATUS_PRODUCT", { method: "POST",
                                                        urlParameters:{"ProductID" : productID, "Status" : 2},
                                                        success: function(data) {
                                                        sap.m.MessageToast.show("Product Deleted.");
                                                        }, error: function(e) {
                                                        sap.m.MessageToast.show("Error, product not deleted.");}});


        },

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var sObjectId =  oEvent.getParameter("arguments").objectId;
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("ProductSet", {
					ProductId :  sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView : function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path : sObjectPath,
				events: {
					change : this._onBindingChange.bind(this),
					dataRequested : function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.ProductId,
				sObjectName = oObject.Name,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		_onMetadataLoaded : function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView"),
				oLineItemTable = this.byId("lineItemsList"),
				iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			oViewModel.setProperty("/lineItemTableDelay", 0);

			oLineItemTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for line item table
				oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
			});

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}
		}
	});

});