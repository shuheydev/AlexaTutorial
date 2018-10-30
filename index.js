/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const fortunes = [
    { 'score': 'good', 'description': '星みっつで良いでしょう' },
    { 'score': 'normal', 'description': '星ふたつで普通でしょう' },
    { 'score': 'good', 'description': '星ひとつでイマイチでしょう' },
];

const luckyColors = [
    '赤',
    'ピンク',
    'オレンジ',
    'ブルー',
    '水色',
    '紺色',
    '紫',
    '黒',
    'グリーン',
    'レモンイエロー',
    'ホワイト',
    'チャコールグレー'
];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechOutput = '今日の運勢を占います。例えば、ふたご座の運勢を教えてと訊いてください。';

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .withSimpleCard('サンプル星占い', speechOutput)
            .getResponse();
    },
};

const HoroscopeIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'HoroscopeIntent';
    },
    async handle(handlerInput) {//async登場
        const sign = handlerInput.requestEnvelope.request.intent.slots.StarSign.value;

        const fortune = fortunes[Math.floor(Math.random() * 3)];

        const speechOutput = '今日の' + sign + 'の運勢は' + fortune.description+ '。';

        const reprompt = "他にラッキーカラーが占えます。ラッキーカラーを聞きますか？";

        //ここでawait
        //getSessionAttributesメソッドは非同期なのか。
        let attributes = await handlerInput.attributesManager.getSessionAttributes();
        attributes.sign = sign;//セッションオブジェクトに文字列「sign」をキーとしてsign変数の中身を入れる。

        //またawait
        await handlerInput.attributesManager.setSessionAttributes(attributes);//setし戻す


        return handlerInput.responseBuilder
            .speak(speechOutput+reprompt)
            .withSimpleCard(sign + 'の運勢：', speechOutput)
            .reprompt(reprompt)
            .getResponse();
    },
};

const LuckyColorIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'LuckyColorIntent';
    },
    async handle(handlerInput) {
        const attributes = await handlerInput.attributesManager.getSessionAttributes();

        let speechOutput;

        if(!attributes.sign)
        {
            speechOutput="そういえばまだ運勢を占っていませんでしたね。";
            speechOutput+="今日の運勢を占います。"+"例えば、ふたご座の運勢を教えてと訊いてください。";

            return handlerInput.responseBuilder
                .speak(speechOutput)
                .reprompt(speechOutput)
                .getResponse();
        }

        const luckyColor=luckyColors[Math.floor(Math.random()*12)];

        speechOutput="今日の"+attributes.sign+"のラッキーカラーは"+luckyColor+"です。素敵ないちにちを。";

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();           
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechOutput = '今日の運勢を占います。' +
            'たとえば、ふたご座の運勢を教えてと訊いてください。';

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        HoroscopeIntentHandler,
        LuckyColorIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
