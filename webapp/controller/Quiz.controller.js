sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";

  return Controller.extend("bq.benqyou.controller.Quiz", {
    onTest: function () {
      alert("Test");
      console.log(this.getView().getModel("loaderModel"));
    },
    startQuiz: function () {
      this.byId("startBtn").setVisible(false);
      this.nextQuestion();
    },
    nextQuestion: function () {
      const aData = this.getView().getModel("loaderModel").getData();
      if (aData.length > 0) {
        this.byId("question").setText(aData[0].key);
        aData.shift();
      }
    },
  });
});
