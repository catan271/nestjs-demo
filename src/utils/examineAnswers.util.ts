import { KeyDto, StudentAnswerDto } from '../dto/quiz.dto';

export const examineAnswers = (answers: StudentAnswerDto[], keys: KeyDto[]) => {
    if (answers.length !== keys.length) {
        return -1;
    }
    let points = 0;
    answers.sort((a, b) => a.questionId - b.questionId);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i].questionId !== answers[i].questionId) {
            return -1;
        }
        answers[i].correct = [];
        answers[i].wrong = [];
        answers[i].missing = [];
        if (keys[i].answer) {
            answers[i].answer = answers[i].answer?.trim();
            if (answers[i].answer === keys[i].answer) {
                points++;
            } else {
                answers[i].correctAnswer = keys[i].answer;
            }
        } else if (keys[i].answerId) {
            if (answers[i].answerId === keys[i].answerId) {
                answers[i].correct = [answers[i].answerId];
                points++;
            } else {
                answers[i].wrong = [answers[i].answerId];
            }
        } else if (keys[i].answerIds) {
            answers[i].answerIds ||= [];
            for (const id of keys[i].answerIds) {
                if (!answers[i].answerIds.includes(id)) {
                    answers[i].missing.push(id);
                }
            }
            for (const id of answers[i].answerIds) {
                if (keys[i].answerIds.includes[id]) {
                    answers[i].correct.push(id);
                } else {
                    answers[i].wrong.push(id);
                }
            }
            if (!answers[i].wrong.length && !answers[i].missing.length) {
                points++;
            }
        }
    }
    return points;
};
