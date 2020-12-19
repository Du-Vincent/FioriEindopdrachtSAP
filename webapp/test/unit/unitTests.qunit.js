/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"be/ap/product/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});