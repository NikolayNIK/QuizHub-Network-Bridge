import shit from './shit';

import CONST from './const';

class Category {
    constructor (data) {
        for (let name in data)
            this[name] = data[name];
    }

    getQuizzes() {
        return new Promise((resolve, reject) => {
            shit.getQuizzes(this.id, (response) => {
                if (response.status) {
                    resolve(response.quizzes.map(crap => new Quiz(crap)));
                } else {
                    reject(response);
                }
            }).catch((response) => {
                reject(response);
            });
        });
    }
}

class Quiz {
    constructor (data) {
        for (let name in data)
            this[name] = data[name];
    }

    start() {
        return new Promise((resolve, reject) => {
            shit.startRun(this.id, (response) => {
                if (response.status) {
                    resolve(new Run(this.id, response));
                } else {
                    reject(response);
                }
            }).catch((response) => {
                reject(response);
            });
        });
    }
}

class Run {
    constructor (quiz, data) {
        this.quiz = quiz;
        this.questions = data.questions.map(el => new Question(el));
    }

    end() {
        return new Promise((resolve, reject) => {
            shit.endRun(this.quiz, this.questions.map(q => { return {id: q.id, answer: q.answer} }), (response) => {
                if (response.status) {
                    resolve(response);
                } else {
                    reject(response);
                }
            }).catch((response) => {
                reject(response);
            });
        });
    }
}

class Question {
    constructor (data) {
        for (let name in data)
            this[name] = data[name];
    }

    answer(value) {
        switch (this.type) {
            case CONST.QUESTION_TYPE.MULTIPLE_CHOISES:
                if (!Array.isArray(value) || value.some(a => !Number.isInteger(a)))
                    throw 'Дуяк, в вопрос с множественным выбором надо пихать только массивы целых чисел порядковых номеров ответа';
                value = value.sort();
                break;
            case CONST.QUESTION_TYPE.SINGLE_CHOISE:
                if (!Number.isInteger(value))
                    throw 'Дуяк, в вопрос с единственным выбором надо пихать целое число - порядковый номер ответа';
                break;
            case CONST.QUESTION_TYPE.TEXT:
                if (typeof value != 'string')
                    throw 'Дуяк, в вопрос с вводом текста нужно пихать, собсно, текст';
                break;
            default:
                console.warn('Unknown question type');
        }

        this.answer = value;
    }
}

export default {
    getCategories: () => {
        return new Promise((resolve, reject) => {
            shit.getCategories((response) => {
                if (response.status) {
                    resolve(response.categories.map(crap => new Category(crap)));
                } else {
                    reject(response);
                }
            }).catch((response) => {
                reject(response);
            });
        });
    }
};