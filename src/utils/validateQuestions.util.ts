import { KeyDto, Question } from '../dto/quiz.dto';
import { questionTypes } from '../constants/questionTypes.constant';

export const validateQuestion = async (questions: Question[], keys?: KeyDto[]) => {
    if (questions.length !== keys?.length) {
        return false;
    }
    questions.sort((a, b) => a.questionId - b.questionId);
    keys.sort((a, b) => a.questionId - b.questionId);
    const usedIds = new Set<number>();
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].questionId !== keys[i].questionId || usedIds.has(questions[i].questionId)) {
            return false;
        }
        usedIds.add(questions[i].questionId);
        if (questions[i].type == questionTypes.SINGLE_CHOICE.value) {
            if (!keys[i].answerId) {
                return false;
            }
            delete keys[i].answer;
            delete keys[i].answerIds;
            if (!questions[i].answers.map((e) => e.answerId).includes(keys[i].answerId as number)) {
                return false;
            }
        } else if (questions[i].type == questionTypes.MULTIPLE_CHOICE.value) {
            if (!keys[i].answerIds) {
                return false;
            }
            delete keys[i].answer;
            delete keys[i].answerId;
            for (const answerId of keys[i].answerIds as number[]) {
                if (!questions[i].answers.map((e) => e.answerId).includes(answerId)) {
                    return false;
                }
            }
        } else if (questions[i].type == questionTypes.FILL_IN.value) {
            if (!keys[i].answer) {
                return false;
            }
            delete keys[i].answerId;
            delete keys[i].answerIds;
            keys[i].answer = (keys[i].answer as string).trim();
        } else {
            return false;
        }
    }
    return true;
};
