sap.ui.define([
    "sap/ui/core/UIComponent",
    "bq/benqyou/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("bq.benqyou.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            // sap.ui.require(["lib/pdf"], function (pdfjsLib) {
            //     console.log("PDF.js załadowany:", typeof pdfjsLib);

            //     // (opcjonalnie) ustaw ścieżkę do workera:
            //     pdfjsLib.GlobalWorkerOptions.workerSrc = "lib/pdf.worker.js";
            // });

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        }
    });
});