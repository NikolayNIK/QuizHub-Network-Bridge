import $ from 'jquery';
import bridge from '@vkontakte/vk-bridge';
import CONST from './const';

bridge.send("VKWebAppInit", {});

async function createToken() {
    let response = await bridge.send("VKWebAppGetAuthToken", {
        app_id: CONST.APP_ID,
        scope: ''
    });
    // TODO check successfullness
    return response.access_token;
}

async function fetchUserVkId() {
    let response = await bridge.send("VKWebAppGetUserInfo");
    // TODO check successfullness
    return response.id;
}

var user;
async function fetchUser() {
    user = {
        token: await createToken(),
        id: await fetchUserVkId()
    };

    return user;
}

async function getUser() {
    return user ? user : await fetchUser();
}

// заебашить запрос на сервер
async function fuck (request, callback) {
    request.user = await getUser();
    return $.post(CONST.URL, JSON.stringify(request), callback, 'json');
}

export default {
    fuck: (request, callback) => {
        return fuck(request, callback);
    },

    testVerification: (callback) => {
        return fuck({action: 'testVerification'}, callback);
    },

    getStats: (callback) => {
        return fuck({action: 'global.getStats'}, callback);
    },

    getDiscounts: (callback) => {
        return fuck({action: 'global.getDiscounts'}, callback);
    },

    getCoupons: (callback) => {
        return fuck({action: 'global.getCoupons'}, callback);
    },

    getCategories: (callback) => {
        return fuck({action: 'global.getCategories'}, callback);
    },

    getQuizzes: (category, callback) => {
        return fuck({
            action: 'global.getQuizzes',
            categoryId: category
        }, callback);
    },

    startRun: (quiz, callback) => {
        return fuck({
            action: 'quiz.startRun',
            quizId: quiz
        }, callback);
    },

    endRun: (quiz, answers, callback) => {
        return fuck({
            action: 'quiz.endRun',
            quizId: quiz,
            answers: answers
        }, callback);
    },

    generateCoupon: (discount, callback) => {
        return fuck({
            action: 'coupons.generateNew',
            discoutId: discount
        }, callback);
    }
};