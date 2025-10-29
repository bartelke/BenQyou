sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("bq.benqyou.controller.Main", {
        onInit() {
        },
        onFileUpload: function (oEvent) {
            const oModel = this.getView().getModel("loaderModel")
            const aFiles = oEvent.getParameter("files");
            const oFile = aFiles && aFiles[0];
            const that = this;
            if (!oFile) return;
            const reader = new FileReader();

            reader.onload = async function (e) {
                const typedarray = new Uint8Array(e.target.result);

                const pdfjsLib = window.pdfjsLib;
                if (!pdfjsLib) {
                    console.error("Error with PDF.js library.");
                    return;
                }

                try {
                    const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                    console.log("file name: ", oFile.name);
                    console.log("pages: ", pdf.numPages);

                    const allLines = [];
                    let id = 0;

                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const textContent = await page.getTextContent();

                        // group text fragments by Y - position
                        const linesMap = new Map();

                        textContent.items.forEach(item => {
                            const y = Math.round(item.transform[5]);
                            if (!linesMap.has(y)) {
                                linesMap.set(y, []);
                            }
                            linesMap.get(y).push(item.str);
                        });

                        // sort by Y - position
                        const sortedYs = Array.from(linesMap.keys()).sort((a, b) => b - a);

                        sortedYs.forEach(y => {
                            const line = linesMap.get(y).join(' ');
                            const parts = line.split("=");
                            const key = parts[0];
                            const value = parts[1] !== undefined ? parts[1] : null;
                            allLines.push({ id, key, value });
                            id += 1;
                        });
                    }

                    oModel.setData(allLines);
                    that.onOpenDialog();
                } catch (err) {
                    console.error("Error while loading PDF file: ", err);
                }
            };

            reader.readAsArrayBuffer(oFile);
        },
        onOpenDialog: async function () {
            this.oDialog ??= await this.loadFragment({
                name: "bq.benqyou.view.Loader"
            });

            this.oDialog.open();
        },
        onPressDelete: function (oEvent) {
            const idToRemove = oEvent.getSource().getBindingContext("loaderModel").getProperty("id");
            const oModel = this.getView().getModel("loaderModel");
            const data = oModel.getData();
            const index = data.findIndex(item => item.id === idToRemove);
            if (index !== -1) {
                data.splice(index, 1); 
                oModel.refresh(true);
            }
        }
    });
});