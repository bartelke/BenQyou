sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("bq.benqyou.controller.Main", {
        onInit() {
        },
onFileUpload: function (oEvent) {
    const aFiles = oEvent.getParameter("files");
    const oFile = aFiles && aFiles[0];
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
                    allLines.push(line);
                });
            }

            console.log(allLines);
        } catch (err) {
            console.error("Error while loading PDF file: ", err);
        }
    };

    reader.readAsArrayBuffer(oFile);
}


    });
});