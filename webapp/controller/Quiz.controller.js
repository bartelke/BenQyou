sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";

  return Controller.extend("bq.benqyou.controller.Quiz", {
    startQuiz() {
      const oModel = this.getView().getModel("loaderModel");
      oModel.setProperty("/isQuestionVisible", true);

      this.byId("startBtn").setVisible(false);
      // create deep copy of original questions:
      this._aOriginalQuestions = JSON.parse(
        JSON.stringify(this.getView().getModel("loaderModel").getData())
      );
      this.nextQuestion();
      this.byId("questionSection").setVisible(true);
    },
    nextQuestion() {
      const aData = this.getView().getModel("loaderModel").getData();

      if (aData.length > 0) {
        this.byId("question").setText(aData[0].key);
        const correctAnswer = aData[0].value;
        console.log(correctAnswer);
        this.setAnswers(correctAnswer);
        aData.shift();
      }
    },
    setAnswers(correctAnswer) {
      let copiedAnswers = JSON.parse(JSON.stringify(this._aOriginalQuestions));

      // remove correct answer from copied answers:
      copiedAnswers = copiedAnswers.filter(
        (item) => item.value !== correctAnswer
      );

      // select 3 random answers:
      const aAnswersToSet = copiedAnswers
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // add also correct answer:
      aAnswersToSet.push({ key: correctAnswer, value: correctAnswer });

      // shuffle answers:
      aAnswersToSet.sort(() => Math.random() - 0.5);
      console.log(aAnswersToSet);

      aAnswersToSet.forEach((element) => {
        this.byId(`RB1-${aAnswersToSet.indexOf(element) + 1}`).setText(
          element.value
        );
      });
    },
  });
});
