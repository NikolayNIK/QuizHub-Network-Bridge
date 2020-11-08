// функции для работы с сервером 

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

async function request (request, callback) {
    request.user = await getUser();
    return $.post(CONST.URL, JSON.stringify(request), callback, 'json');
}

export default {
    request: (request, callback) => {
        return request(request, callback);
    },

    testVerification: (callback) => {
        return request({action: 'testVerification'}, callback);
    },

    getStats: (callback) => {
        return request({action: 'global.getStats'}, callback);
    },

    getDiscounts: (callback) => {
        return request({action: 'global.getDiscounts'}, callback);
    },

    getCoupons: (callback) => {
        return request({action: 'global.getCoupons'}, callback);
    },

    getCategories: (callback) => {
        return request({action: 'global.getCategories'}, callback);
    },

    getQuizzes: (category, callback) => {
        return request({
            action: 'global.getQuizzes',
            categoryId: category
        }, callback);
    },

    startRun: (quiz, callback) => {
        return request({
            action: 'quiz.startRun',
            quizId: quiz
        }, callback);
    },

    endRun: (quiz, answers, callback) => {
        return request({
            action: 'quiz.endRun',
            quizId: quiz,
            answers: answers
        }, callback);
    },

    generateCoupon: (discount, callback) => {
        return request({
            action: 'coupons.generateNew',
            discountId: discount
        }, callback);
    }
};