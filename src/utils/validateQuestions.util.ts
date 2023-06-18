import {
    KeyDto,
    KeyFillIn,
    KeyMultipleChoices,
    KeySingleChoice,
    Question,
    QuestionFillIn,
    QuestionMultipleChoices,
    QuestionSingleChoice,
} from '../dto/quiz.dto';
import { questionTypes } from '../constants/questionTypes.constant';
import { plainToInstance } from 'class-transformer';

export const validateQuestion = (questions: Question[], keys?: KeyDto[]) => {
    if (questions.length !== keys?.length) {
        return false;
    }
    questions.sort((a, b) => a.questionId - b.questionId);
    keys.sort((a, b) => a.questionId - b.questionId);
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].questionId !== keys[i].questionId) {
            return false;
        }
        if (questions[i].type == questionTypes.SINGLE_CHOICE.value) {
            const question = plainToInstance(QuestionSingleChoice, questions[i]);
            const key = plainToInstance(KeySingleChoice, keys[i]);
            if (!question.answers.map((e) => e.answerId).includes(key.answerId)) {
                return false;
            }
            questions[i] = question;
            keys[i] = key;
        } else if (questions[i].type == questionTypes.MULTIPLE_CHOICE.value) {
            const question = plainToInstance(QuestionMultipleChoices, questions[i]);
            const key = plainToInstance(KeyMultipleChoices, keys[i]);
            for (const answerId of key.answerIds) {
                if (!question.answers.map((e) => e.answerId).includes(answerId)) {
                    return false;
                }
            }
            questions[i] = question;
            keys[i] = key;
        } else if (questions[i].type == questionTypes.FILL_IN.value) {
            questions[i] = plainToInstance(QuestionFillIn, questions[i]);
            keys[i] = plainToInstance(KeyFillIn, keys[i]);
            keys[i].answer = keys[i].answer.trim();
        } else {
            return false;
        }
    }
    return true;
};
