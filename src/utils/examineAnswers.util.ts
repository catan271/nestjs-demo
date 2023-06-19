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
            if (!answers[i].answer) {
                return -1;
            }
            answers[i].answer = answers[i].answer?.trim();
            if (answers[i].answer === keys[i].answer) {
                points++;
            } else {
                answers[i].correctAnswer = keys[i].answer as string;
            }
        } else if (keys[i].answerId) {
            if (!answers[i].answerId) {
                return -1;
            }
            if (answers[i].answerId === keys[i].answerId) {
                answers[i].correct.push(answers[i].answerId as number);
                points++;
            } else {
                answers[i].wrong = [answers[i].answerId as number];
                answers[i].missing = [keys[i].answerId as number];
            }
        } else if (keys[i].answerIds) {
            if (!answers[i].answerIds) {
                return -1;
            }
            for (const id of keys[i].answerIds as number[]) {
                if (!(answers[i].answerIds as number[]).includes(id)) {
                    answers[i].missing.push(id);
                }
            }
            for (const id of answers[i].answerIds as number[]) {
                if ((keys[i].answerIds as number[]).includes(id)) {
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
