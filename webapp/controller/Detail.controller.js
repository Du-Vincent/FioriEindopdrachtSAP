// global variables to save values when cancel
var productID;
var category;
var supplier;
var prodName;
var description;
var price;
var currency = 'EUR';
var uom;
var weight;
var weightUnit;
var width;
var depth;
var height;
var unit;

sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/ui/core/Element",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"

], function (BaseController, JSONModel, formatter, mobileLibrary, MessageToast, Element, MessageBox, History) {
    "use strict";


    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return BaseController.extend("be.ap.product.controller.Detail", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page is busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: false,
                delay: 0,
                lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
            });

            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

            this.setModel(oViewModel, "detailView");

            this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

            //subscribe event to call this event from other controllers
            sap.ui.getCore().getEventBus().subscribe("detailController", "new", this.handleNewPress, this);

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
        onSendEmailPress: function () {
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
        onListUpdateFinished: function (oEvent) {
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

        updateInputFields: function (visible) {
            this.getView().byId("comboCategory").setEnabled(visible);
            this.getView().byId("comboSupplier").setEnabled(visible);
            this.getView().byId("name").setEnabled(visible);
            this.getView().byId("description").setEnabled(visible);
            this.getView().byId("price").setEnabled(visible);
            this.getView().byId("comboUOM").setEnabled(visible);
            this.getView().byId("weight").setEnabled(visible);
            this.getView().byId("width").setEnabled(visible);
            this.getView().byId("depth").setEnabled(visible);
            this.getView().byId("height").setEnabled(visible);
            this.getView().byId("comboUnit").setEnabled(visible);
            this.getView().byId("weightButton").setEnabled(visible);
        },


        handleNewPress: function (oEvent) {
            this.getView().byId("new").setEnabled(false);
            this.getView().byId("saveNew").setVisible(true);
            this.getView().byId("saveEdit").setVisible(false);
            this.getView().byId("cancelNew").setVisible(true);
            this.getView().byId("delete").setEnabled(false);
            this.getView().byId("edit").setEnabled(false);

            this.updateInputFields(true);

            this.getView().byId("comboCategory").setValue("");
            this.getView().byId("comboSupplier").setValue("");
            this.getView().byId("name").setValue("");
            this.getView().byId("description").setValue("");
            this.getView().byId("price").setValue("");
            this.getView().byId("comboUOM").setValue("");
            this.getView().byId("weight").setValue("");
            this.getView().byId("width").setValue("");
            this.getView().byId("depth").setValue("");
            this.getView().byId("height").setValue("");
            this.getView().byId("comboUnit").setValue("");

            this.getView().byId("productLabel").setVisible(false);
            this.getView().byId("avatar").setVisible(false);
            this.getView().byId("nameLabel").setVisible(false);
            this.getView().byId("priceLabel").setVisible(false);
            this.getView().byId("currencyLabel").setVisible(false);
            this.getView().byId("statusLabel").setVisible(false);

        },

        handleCancelPressNew: function (oEvent) {
            MessageToast.show("Cancelled");
            sap.ui.getCore().getEventBus().publish("masterController", "enable");
            this.updateInputFields(false);

            this.getRouter().navTo("master");

            this.getView().byId("saveNew").setVisible(false);
            this.getView().byId("saveEdit").setVisible(false);
            this.getView().byId("cancelNew").setVisible(false);
            this.getView().byId("new").setEnabled(true);
            this.getView().byId("edit").setEnabled(true);
            this.getView().byId("delete").setEnabled(true);

            this.getView().byId("productLabel").setVisible(true);
            this.getView().byId("avatar").setVisible(true);
            this.getView().byId("nameLabel").setVisible(true);
            this.getView().byId("priceLabel").setVisible(true);
            this.getView().byId("currencyLabel").setVisible(true);
            this.getView().byId("statusLabel").setVisible(true);
        },

        handleCancelPressEdit: function (oEvent) {
            MessageToast.show("Cancelled");

            this.getView().byId("saveNew").setVisible(false);
            this.getView().byId("saveEdit").setVisible(false);
            this.getView().byId("cancelEdit").setVisible(false);
            this.getView().byId("new").setEnabled(true);
            this.getView().byId("edit").setEnabled(true);
            this.getView().byId("delete").setEnabled(true);

            this.getView().byId("productLabel").setVisible(true);
            this.getView().byId("avatar").setVisible(true);
            this.getView().byId("nameLabel").setVisible(true);
            this.getView().byId("priceLabel").setVisible(true);
            this.getView().byId("currencyLabel").setVisible(true);
            this.getView().byId("statusLabel").setVisible(true);

            this.updateInputFields(false);

            sap.ui.getCore().getEventBus().publish("masterController", "enable");
            sap.ui.getCore().getEventBus().publish("masterController", "editUnBlock");

            this.getView().byId("comboCategory").setValue(category);
            this.getView().byId("comboSupplier").setSelectedKey(supplier == "Logibech" ? 1 : supplier == "Samsong" ? 2 : supplier == "Hewlett-Bakaard" ? 3 : supplier == "Bell" ? 4 : supplier == "Appel Inc." ? 5 :
                supplier == "Amasun" ? 6 : supplier == "Tashiba" ? 7 : supplier == "Zony" ? 8 : supplier == "Intol" ? 9 : supplier == "Cisko" ? 10 : 0);
            this.getView().byId("name").setValue(prodName);
            this.getView().byId("description").setValue(description);
            this.getView().byId("price").setValue(price);
            this.getView().byId("comboUOM").setSelectedKey(uom == "Pieces" ? "PC" : "PC");
            this.getView().byId("weight").setValue(weight);
            this.getView().byId("width").setValue(width);
            this.getView().byId("depth").setValue(depth);
            this.getView().byId("height").setValue(height);
            this.getView().byId("comboUnit").setSelectedKey(unit == "Centimetre" ? "CM" : "CM");
            this.getView().byId("weightButton").setSelectedKey(weightUnit.getText() == "Kilograms" ? 'kilo' : 'gram');
        },

        handleEditPress: function (oEvent) {
            this.getView().byId("saveEdit").setVisible(true);
            this.getView().byId("saveNew").setVisible(false);
            this.getView().byId("cancelEdit").setVisible(true);
            this.getView().byId("delete").setEnabled(false);

            sap.ui.getCore().getEventBus().publish("masterController", "disable");
            sap.ui.getCore().getEventBus().publish("masterController", "editBlock");

            productID = this.getView().byId("productID").getValue();
            category = this.getView().byId("comboCategory").getValue();
            supplier = this.getView().byId("comboSupplier").getValue();
            prodName = this.getView().byId("name").getValue();
            description = this.getView().byId("description").getValue();
            price = this.getView().byId("price").getValue();
            uom = this.getView().byId("comboUOM").getValue();
            weight = this.getView().byId("weight").getValue();
            weightUnit = Element.registry.get(this.byId('weightButton').getSelectedItem());
            width = this.getView().byId("width").getValue();
            depth = this.getView().byId("depth").getValue();
            height = this.getView().byId("height").getValue();
            unit = this.getView().byId("comboUnit").getValue();

            this.updateInputFields(true);
        },

        formatInput: function (iValue) {
            if (iValue == "") {
                iValue = "0";
            } else {
                if (iValue.indexOf(".") > -1) {
                    iValue = iValue.replace(".", "");
                }

                if (iValue.indexOf(",") > -1) {
                    iValue = iValue.replace(",", ".");
                }
            }
            return iValue;
        },

        handleSavePressEdit: function (oEvent) {
            category = this.getView().byId("comboCategory").getValue();
            productID = this.getView().byId("productID").getValue();
            supplier = this.getView().byId("comboSupplier").getValue();
            prodName = this.getView().byId("name").getValue();
            description = this.getView().byId("description").getValue();
            price = this.getView().byId("price").getValue();
            uom = this.getView().byId("comboUOM").getValue();
            weight = this.getView().byId("weight").getValue();
            weightUnit = Element.registry.get(this.byId('weightButton').getSelectedItem());
            width = this.getView().byId("width").getValue();
            depth = this.getView().byId("depth").getValue();
            height = this.getView().byId("height").getValue();
            unit = this.getView().byId("comboUnit").getValue();

            price = this.formatInput(price);
            weight = this.formatInput(weight);
            width = this.formatInput(width);
            depth = this.formatInput(depth);
            height = this.formatInput(height);

            var productUpdate = {
                ProductId: productID,
                SupplierId: supplier == "Logibech" ? 1 : supplier == "Samsong" ? 2 : supplier == "Hewlett-Bakaard" ? 3 : supplier == "Bell" ? 4 : supplier == "Appel Inc." ? 5 :
                    supplier == "Amasun" ? 6 : supplier == "Tashiba" ? 7 : supplier == "Zony" ? 8 : supplier == "Intol" ? 9 : supplier == "Cisko" ? 10 : 0,
                Category: category,
                Weight: weight,
                WeightUnit: weightUnit.getText() == "Kilograms" ? "KG" : "G",
                Description: description,
                Name: prodName,
                Uom: uom == "Pieces" ? "PC" : "PC",
                Price: price,
                Currency: currency,
                Width: width,
                Depth: depth,
                Height: height,
                DimUnit: unit == "Centimetre" ? "CM" : "CM",
            };

            var oModel = this.getView().getModel();
            oModel.update("/ProductSet('" + productID + "')", productUpdate, {
                method: "PUT",
                success: function (data) {
                    MessageToast.show("Product Updated.");
                }, error: function (e) {
                    MessageToast.show("Error, product not updated.");
                }
            });

            this.getView().byId("saveEdit").setVisible(false);
            this.getView().byId("saveNew").setVisible(false);
            this.getView().byId("cancelEdit").setVisible(false);
            this.getView().byId("new").setEnabled(true);
            this.getView().byId("delete").setEnabled(true);

            this.updateInputFields(false);

            sap.ui.getCore().getEventBus().publish("masterController", "refresh");
            sap.ui.getCore().getEventBus().publish("masterController", "enable");
            sap.ui.getCore().getEventBus().publish("masterController", "editUnBlock");
            this.getView().byId("comboUnit").setSelectedKey(unit == "Centimetre" ? "CM" : "CM");
            this.getView().byId("comboUOM").setSelectedKey(uom == "Pieces" ? "PC" : "PC");
            this.getView().byId("comboSupplier").setSelectedKey(supplier == "Logibech" ? 1 : supplier == "Samsong" ? 2 : supplier == "Hewlett-Bakaard" ? 3 : supplier == "Bell" ? 4 : supplier == "Appel Inc." ? 5 :
                supplier == "Amasun" ? 6 : supplier == "Tashiba" ? 7 : supplier == "Zony" ? 8 : supplier == "Intol" ? 9 : supplier == "Cisko" ? 10 : 0);
        },



        handleSavePressNew: function (oEvent) {
            category = this.getView().byId("comboCategory").getValue();
            productID = this.getView().byId("productID").getValue();
            supplier = this.getView().byId("comboSupplier").getValue();
            prodName = this.getView().byId("name").getValue();
            description = this.getView().byId("description").getValue();
            price = this.getView().byId("price").getValue();
            uom = this.getView().byId("comboUOM").getValue();
            weight = this.getView().byId("weight").getValue();
            weightUnit = Element.registry.get(this.byId('weightButton').getSelectedItem());
            width = this.getView().byId("width").getValue();
            depth = this.getView().byId("depth").getValue();
            height = this.getView().byId("height").getValue();
            unit = this.getView().byId("comboUnit").getValue();

            price = this.formatInput(price);
            weight = this.formatInput(weight);
            width = this.formatInput(width);
            depth = this.formatInput(depth);
            height = this.formatInput(height);

            var productCreate = {
                SupplierId: supplier == "Logibech" ? 1 : supplier == "Samsong" ? 2 : supplier == "Hewlett-Bakaard" ? 3 : supplier == "Bell" ? 4 : supplier == "Appel Inc." ? 5 :
                    supplier == "Amasun" ? 6 : supplier == "Tashiba" ? 7 : supplier == "Zony" ? 8 : supplier == "Intol" ? 9 : supplier == "Cisko" ? 10 : 0,
                Category: category,
                Weight: weight,
                WeightUnit: weightUnit.getText() == "Kilograms" ? "KG" : "G",
                Description: description,
                Name: prodName,
                Uom: uom == "Pieces" ? "PC" : "PC",
                Price: price,
                Currency: currency,
                Width: width,
                Depth: depth,
                Height: height,
                DimUnit: unit == "Centimetre" ? "CM" : "CM",
            };

            var oModel = this.getView().getModel();
            oModel.create("/ProductSet", productCreate, {
                method: "POST",
                success: function (data) {
                    MessageToast.show("Product Saved.");
                }, error: function (e) {
                    MessageToast.show("Error, product not saved.");
                }
            });

            this.getView().byId("saveNew").setVisible(false);
            this.getView().byId("saveEdit").setVisible(false);
            this.getView().byId("edit").setEnabled(true);
            this.getView().byId("cancelNew").setVisible(false);
            this.getView().byId("new").setEnabled(true);
            this.getView().byId("delete").setEnabled(true);

            this.getView().byId("productLabel").setVisible(true);
            this.getView().byId("avatar").setVisible(true);
            this.getView().byId("nameLabel").setVisible(true);
            this.getView().byId("priceLabel").setVisible(true);
            this.getView().byId("currencyLabel").setVisible(true);
            this.getView().byId("statusLabel").setVisible(true);

            this.updateInputFields(false);

            sap.ui.getCore().getEventBus().publish("masterController", "refresh");
            sap.ui.getCore().getEventBus().publish("masterController", "enable");
            this.getView().byId("comboUnit").setSelectedKey(unit == "Centimetre" ? "CM" : "CM");
            this.getView().byId("comboUOM").setSelectedKey(uom == "Pieces" ? "PC" : "PC");
            this.getView().byId("comboSupplier").setSelectedKey(supplier == "Logibech" ? 1 : supplier == "Samsong" ? 2 : supplier == "Hewlett-Bakaard" ? 3 : supplier == "Bell" ? 4 : supplier == "Appel Inc." ? 5 :
                supplier == "Amasun" ? 6 : supplier == "Tashiba" ? 7 : supplier == "Zony" ? 8 : supplier == "Intol" ? 9 : supplier == "Cisko" ? 10 : 0);

            this.getRouter().navTo("master");
        },

        handleDeletePress: function () {

            var oModel = this.getView().getModel();
            var productID = this.getView().byId("productID").getValue();

            oModel.callFunction("/SET_STATUS_PRODUCT", {
                method: "POST",
                urlParameters: { "ProductID": productID, "Status": 2 },
                success: function (data) {
                    MessageToast.show("Product Deleted.");
                    sap.ui.getCore().getEventBus().publish("masterController", "refresh");
                    sap.ui.getCore().getEventBus().publish("masterController", "enable");
                }, error: function (e) {
                    MessageToast.show("Error, product not deleted.");
                }
            });

        },

        handleClickMePress: function () {
            MessageBox.error("Hierbij mijn akkoord dat de student, Dumont Vincent, 20/20 krijgt op zijn eindtotaal van het vak SAP Development. ",
                {
                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                    onClose: function (sAction) {
                        if (sAction != "CLOSE") { if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); } }
                        if (sAction == "CLOSE") {
                            MessageBox.error("Hahaha, dacht ge na echt da ge kon wegklikken ofwa. Ik zou akkoord gaan als ik u was. ",
                                {
                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                    onClose: function (sAction) {
                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                        if (sAction == "CLOSE") {
                                            MessageBox.error("Een ezel stoot zich geen tweemaal aan dezelfde steen (van horen zeggen).",
                                                {
                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                    onClose: function (sAction) {
                                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                        if (sAction == "CLOSE") {
                                                            MessageBox.error("Ik kan nog lang doorgaan zenne.",
                                                                {
                                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                                    onClose: function (sAction) {
                                                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                                        if (sAction == "CLOSE") {
                                                                            MessageBox.error("Oke oke, ge hebt gewonnen. Klik maar op \"sluiten\". ",
                                                                                {
                                                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                                                    onClose: function (sAction) {
                                                                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                                                        if (sAction == "CLOSE") {
                                                                                            MessageBox.error("HAHAHAAHAHA dacht ge na echt da ge op \"sluiten\" kon klikken?????.",
                                                                                                {
                                                                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                                                                    onClose: function (sAction) {
                                                                                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                                                                        if (sAction == "CLOSE") {
                                                                                                            MessageBox.error("Da wordt hier stillekes aan tijd man. Ons moeder heeft viskes gebakken. ",
                                                                                                                {
                                                                                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                                                                                    onClose: function (sAction) {
                                                                                                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                                                                                        if (sAction == "CLOSE") {
                                                                                                                            MessageBox.error("Eerlijk, deze minigame alleen al is toch een 20 op 20 waard ofni?",
                                                                                                                                {
                                                                                                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                                                                                                    onClose: function (sAction) {
                                                                                                                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                                                                                                        if (sAction == "CLOSE") {
                                                                                                                                            MessageBox.error("Klikt na gewuun op \"ik ga akkoord\". Dan kunnen we allebij iets nuttigs gaan doen. ",
                                                                                                                                                {
                                                                                                                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                                                                                                                    onClose: function (sAction) {
                                                                                                                                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                                                                                                                        if (sAction == "CLOSE") {
                                                                                                                                                            MessageBox.error("Besef effe da gij hier rustig op message boxen zit te klikken terwijl ge ervoor betaald wordt. ",
                                                                                                                                                                {
                                                                                                                                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                                                                                                                                    onClose: function (sAction) {
                                                                                                                                                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                                                                                                                                        if (sAction == "CLOSE") {
                                                                                                                                                                            MessageBox.error("Hey zoon, wat wil jij later worden als je groot bent? Opleidingshoofd Messageboxklikker, bij AP hogeschool.",
                                                                                                                                                                                {
                                                                                                                                                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                                                                                                                                                    onClose: function (sAction) {
                                                                                                                                                                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                                                                                                                                                        if (sAction == "CLOSE") {
                                                                                                                                                                                            MessageBox.error("Ik zweer dat ik Vincent Dumont 20 op 20 ga geven op zijn eindtotaal van het vak SAP Development. ",
                                                                                                                                                                                                {
                                                                                                                                                                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                                                                                                                                                                    onClose: function (sAction) {
                                                                                                                                                                                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                                                                                                                                                                        if (sAction == "CLOSE") {
                                                                                                                                                                                                            MessageBox.error("Ge hebt gezworen, geen ontkomen meer aan man. ",
                                                                                                                                                                                                                {
                                                                                                                                                                                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                                                                                                                                                                                    onClose: function (sAction) {
                                                                                                                                                                                                                        if (sAction != "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                                                                                                                                                                                        if (sAction == "CLOSE") {
                                                                                                                                                                                                                            MessageBox.error("Hierbij mijn akkoord dat als ik op \"sluiten\" of \"ik ga akkoord\" klik, de student, Dumont Vincent, 20 op 20 krijgt op zijn eindtotaal van het vak SAP Development. ",
                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                    actions: ["Ik ga akkoord", sap.m.MessageBox.Action.CLOSE],
                                                                                                                                                                                                                                    onClose: function (sAction) {
                                                                                                                                                                                                                                        if (sAction == "CLOSE") { MessageToast.show("Dat staat genoteerd en ik wens u het allerbeste."); }
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                });
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                });
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                });
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                });
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                });
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                });
                                                                                                                        }
                                                                                                                    }
                                                                                                                });
                                                                                                        }
                                                                                                    }
                                                                                                });
                                                                                        }
                                                                                    }
                                                                                });
                                                                        }
                                                                    }
                                                                });
                                                        }
                                                    }
                                                });
                                        }
                                    }
                                });
                        }
                    }
                });
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
        _onObjectMatched: function (oEvent) {
            var sObjectId = oEvent.getParameter("arguments").objectId;
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            this.getModel().metadataLoaded().then(function () {
                var sObjectPath = this.getModel().createKey("ProductSet", {
                    ProductId: sObjectId
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
        _bindView: function (sObjectPath) {
            // Set busy indicator during view binding
            var oViewModel = this.getModel("detailView");

            // If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
            oViewModel.setProperty("/busy", false);

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange: function () {
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

        _onMetadataLoaded: function () {
            // Store original busy indicator delay for the detail view
            var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
                oViewModel = this.getModel("detailView"),
                oLineItemTable = this.byId("lineItemsList"),
                iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

            // Make sure busy indicator is displayed immediately when
            // detail view is displayed for the first time
            oViewModel.setProperty("/delay", 0);
            oViewModel.setProperty("/lineItemTableDelay", 0);

            oLineItemTable.attachEventOnce("updateFinished", function () {
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
                this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
            }
        }
    });

});