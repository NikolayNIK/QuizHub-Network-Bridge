import api from './importme';
import CONST from './const';

function test() {
    debugger;
    // получение категорий
    api.getCategories().then(categories => {
        debugger;
        // успешное получение категорий
        categories.forEach(category => {
            // получение викторин
            category.getQuizzes().then(quizzes => {
                debugger;
                // успешное получение викторин
                quizzes.forEach(quiz => {
                    // начало забега
                    quiz.start().then(run => {
                        debugger;
                        // успешное начало забега
                        // ответ на каждый вопрос
                        run.questions.forEach(question => {
                            switch (question.type) { // в зависимости от типа принимает разную дичь
                                case CONST.QUESTION_TYPE.SINGLE_CHOISE:
                                    question.answer(0);
                                    break;
                                case CONST.QUESTION_TYPE.MULTIPLE_CHOISES:
                                    question.answer([0]);
                                    break;
                                case CONST.QUESTION_TYPE.TEXT:
                                    question.answer('text');
                                    break;
                                default:
                                    throw 'нам подбросили левый тип вопроса: ' + question.type;
                            }
                        });

                        // закончить забег
                        run.end().then(response => {
                            debugger;
                            // успешное завершение забега
                            console.log(response);
                        }).catch(shit => {
                            debugger;
                            // ошибка завершения забега
                            console.error(shit);
                        });
                    }).catch(shit => {
                        debugger;
                        // ошибка начала забега
                        console.error(shit);
                    });
                });
            }).catch(shit => {
                debugger;
                // ошибка получения викторин
                console.error(shit);
            });
        });
    }).catch(shit => {
        debugger;
        // ошибка получения категорий
        console.error(shit);
    });
}

export default {
    test: test
};