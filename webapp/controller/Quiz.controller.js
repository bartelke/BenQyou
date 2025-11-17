sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox"],
  (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("bq.benqyou.controller.Quiz", {
      startQuiz() {
        const oModel = this.getView().getModel("loaderModel");
        // set counters to zero:
        oModel.setProperty("/correctNum", 0);
        oModel.setProperty("/wrongNum", 0);

        // switch visibility:
        oModel.setProperty("/isQuestionVisible", true);
        this.byId("startBtn").setVisible(false);

        // create deep copy of original questions:
        this._aOriginalQuestions = JSON.parse(
          JSON.stringify(this.getView().getModel("loaderModel").getData())
        );
        this.nextQuestion(true);
      },
      nextQuestion(bSkipAnswerCheck) {
        const oModel = this.getView().getModel("loaderModel");
        const aData = oModel.getData();

        // update question number label:
        const oPageNumLabel = this.byId("pageNum");
        const totalQuestions = this._aOriginalQuestions.length;
        const currentQuestionNum = totalQuestions - aData.length + 1;
        oPageNumLabel.setText(`${currentQuestionNum}/${totalQuestions}`);

        // check previous answer if flag is not set:
        if (!bSkipAnswerCheck) {
          const bIsAnswerCorrect = this.checkAnswer();
          oModel.setProperty(
            "/correctNum",
            oModel.getProperty("/correctNum") + (bIsAnswerCorrect ? 1 : 0)
          );
          oModel.setProperty(
            "/wrongNum",
            oModel.getProperty("/wrongNum") + (bIsAnswerCorrect ? 0 : 1)
          );
        }

        if (aData.length > 0) {
          // update new answer if there are still questions left:
          const correctAnswer = aData[0].value;

          this.prevCorrectAnswer = correctAnswer;
          this.byId("question").setText(aData[0].key);

          this.setAnswers(correctAnswer);
          aData.shift();
        } else {
          this.showFinalMessage();
        }
      },
      setAnswers(correctAnswer) {
        let copiedAnswers = JSON.parse(
          JSON.stringify(this._aOriginalQuestions)
        );

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

        aAnswersToSet.forEach((element) => {
          this.byId(`RB1-${aAnswersToSet.indexOf(element) + 1}`).setText(
            element.value
          );
        });
      },
      checkAnswer() {
        const selectedAnswer = this.byId("buttonGroup")
          .getSelectedButton()
          .getText();
        const oBundle = this.getView().getModel("i18n").getResourceBundle();

        if (selectedAnswer === this.prevCorrectAnswer) {
          MessageToast.show(oBundle.getText("correctAnswer"));
          return true;
        } else {
          MessageBox.error(
            `${oBundle.getText("wrongAnswer")} ${this.prevCorrectAnswer}`
          );
          return false;
        }
      },
      showFinalMessage() {
        const oBundle = this.getView().getModel("i18n").getResourceBundle();
        const oMsg = oBundle.getText("finalMessage");
        MessageBox.information(
          oMsg
            .replace(
              "{0}",
              this.getView().getModel("loaderModel").getProperty("/correctNum")
            )
            .replace("{1}", this._aOriginalQuestions.length),
          {
            onClose: () => {
              location.reload();
            },
          }
        );
      },
    });
  }
);
