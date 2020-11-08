// ООП обертка функций для работы с сервером

import thing from './thing';
import CONST from './const';

class Category {
    constructor (data) {
        for (let name in data)
            this[name] = data[name];
    }

    getQuizzes() {
        return new Promise((resolve, reject) => {
            thing.getQuizzes(this.id, (response) => {
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
            thing.startRun(this.id, (response) => {
                if (response.status) {
                    resolve(new Run(this, response));
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
            thing.endRun(this.quiz.id, this.questions.map(q => { return {id: q.id, answer: q.answer} }), (response) => {
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

    setAnswer(value) {
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

class Discout {
    constructor (data) {
        for (let name in data)
            this[name] = data[name];
    }

    generateCoupon() {
        return new Promise((resolve, reject) => {
            thing.generateCoupon(this.id, response => {
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

export default {
    getCategories: () => {
        return new Promise((resolve, reject) => {
            thing.getCategories((response) => {
                if (response.status) {
                    resolve(response.categories.map(crap => new Category(crap)));
                } else {
                    reject(response);
                }
            }).catch((response) => {
                reject(response);
            });
        });
    },

    getStats: () => {
        return new Promise((resolve, reject) => {
            thing.getStats(response => {
                if (response.status) {
                    resolve(response);
                } else {
                    reject(response);
                }
            }).catch((response) => {
                reject(response);
            });
        });
    },

    getDiscounts: () => {
        return new Promise((resolve, reject) => {
            thing.getDiscounts(response => {
                if (response.status) {
                    let result = {};
                    for (let name in response)
                        if (name != 'discounts')
                            result[name] = response[name];
                    result.discounts = response.discounts.map(a => {
                        return new Discout(a);
                    });
                    resolve(result);
                } else {
                    reject(response);
                }
            }).catch(response => {
                reject(response);
            });
        });
    },

    getCoupons: () => {
        return new Promise((resolve, reject) => {
            thing.getCoupons(response => {
                if (response.status) {
                    resolve(response);
                } else {
                    reject(response);
                }
            }).catch(response => {
                reject(response);
            });
        });
    }
};