const cowsayQuestionElem = document.querySelector('#question');
const cowsayAnswerElem = document.querySelector('#answer');

const cowsayQuestionSpeaker = document.querySelector('#question-speaker');
const cowsayAnswerSpeaker = document.querySelector('#answer-speaker');

const questionModifierCategory = document.querySelector('#category');
const questionModifierDifficulty = document.querySelector('#difficulty');

var buttons = [];
generateButtons();

var answerCorrect = '';
var question;

initCowsayQuestion();
initCowsayAnswer();

var questionLog = [];
var questionLogIndex = -1;

newQuestion(1, questionModifierCategory.value, questionModifierDifficulty.value);

/**
 * Retrieves and prepares the question to be used in the HTML
 * 
 * Most parameters are not modifiable for the sake of the
 * scope of the current project, but the functionality is
 * provided for the capability of scaling to such.
 * 
 * To skip parameters, replace with 'undefined' in the following way:
 * newQuestion(1, undefined, 'easy');
 * 
 * @param {number} amount Number of questions to retrieve (accessible in response.results[i])
 * @param {number} category The category of question, based on OpenTriviaDB's ordering
 * @param {string} difficulty Difficulty in 'easy', 'medium', or 'hard'
 * @param {string} type Offers choice between 'multiple' choice or 'boolean' true/false
 */
async function newQuestion(amount, category, difficulty, type) {
    questionLogIndex++;
    url = `https://opentdb.com/api.php?amount=${amount}`;
    if(category && category > 0)
        url = url.concat('&category=', category);
    if(difficulty)
        url = url.concat('&difficulty=', difficulty.toLowerCase());
    if(type)
        url = url.concat('&type=', type.toLowerCase());

    const promise = await fetch(url);
    promise.json().then((response) => {

        // 2 buttons for True/False, 4 for Multiple Choice
        buttons.forEach((button) => button.style.visibility = 'hidden');

        // If using multiple questions, call this in a loop and access [i] instead of [0]
        const trivia = response.results[0]
        answerList = trivia.incorrect_answers;
        answerList.push(trivia.correct_answer);
        shuffleArray(answerList);
        answerCorrect = answerList.indexOf(trivia.correct_answer);

        headerList = ['A', 'B', 'C', 'D'];

        // TODO: Check answer type and ensure formatted as '| A) True |  | B) False |'
        for (var i = 0; i < answerList.length; i++) {
            answerList[i] = HTMLFormat(headerList[i].concat(') ', `${answerList[i]}`));
            // answerList[i] = answerList[i].replaceAll(/&quot;/g, '\"');
            // answerList[i] = answerList[i].replaceAll(/&#039;/g, '\'');
            // answerList[i] = answerList[i].replaceAll(/&amp;/g, '\&');

            buttons[i].innerText = answerList[i];
            buttons[i].style.visibility = 'visible';
        }

        question = HTMLFormat(trivia.question);
        // question = question.replaceAll(/&quot;/g, '\"');
        // question = question.replaceAll(/&#039;/g, '\'');
        // question = question.replaceAll(/&amp;/g, '\&');

        questionLog[questionLogIndex] = trivia;
        questionLog[questionLogIndex].attempts = 0;
        questionLog[questionLogIndex].solved = false;

        cowsayQuestion(question, cowsayQuestionSpeaker.value);
        cowsayAnswer('Thinking of an answer...', cowsayAnswerSpeaker.value, 'think');
    });
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function HTMLFormat(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}


/**
 * Formats the given text into a response cowsay with a given format
 * 
 * The following function does the same, just for the Answering entity
 * 
 * @param {*} text Text to be spoken by the cow
 * @param {*} style Used with the speaker selection to change who is speaking (such as a Chicken instead)
 */
async function cowsayQuestion(text, style) {
    fetch(`https://helloacm.com/api/cowsay/?msg=${text}&f=${style}`).then(cowsayPromise => cowsayPromise.text()).then(cowsayResponse => {
        cowsayQuestionElem.innerText = cowsayFormat(JSON.parse(cowsayResponse));
    });
}

async function cowsayAnswer(text, style, sayOrThink) {
    fetch(`https://helloacm.com/api/cow${sayOrThink}/?msg=${text}&f=${style}`).then(cowsayPromise => cowsayPromise.text()).then(cowsayResponse => {
        cowsayAnswerElem.innerText = cowsayFormat(JSON.parse(cowsayResponse));
    });
}

function cowsayFormat(text) {
    var cowsayFormatted = text;
    cowsayFormatted = cowsayFormatted.replaceAll('\\n', '\n');
    cowsayFormatted = cowsayFormatted.replaceAll('\\\\', '\\');
    cowsayFormatted = cowsayFormatted.replaceAll('\\\/', '\/');
    cowsayFormatted = cowsayFormatted.replaceAll('\\\"', '\"');
    cowsayFormatted = cowsayFormatted.substring(1, cowsayFormatted.length - 1);
    cowsayFormatted = HTMLFormat(cowsayFormatted);
    cowsayFormatted = ' '.concat(cowsayFormatted);
    return cowsayFormatted
}

function checkAnswer(buttonValue) {
    cowsayAnswer(`The answer is... ${headerList[buttonValue]}!`, cowsayAnswerSpeaker.value, 'say');
    questionLog[questionLogIndex].attempts++;
    if (buttonValue == answerCorrect) {
        cowsayQuestion("That is... CORRECT!", cowsayQuestionSpeaker.value);
        questionLog[questionLogIndex].solved = true;
        setTimeout(() => newQuestion(1, questionModifierCategory.value, questionModifierDifficulty.value), '2000');
    } else {
        cowsayQuestion("That is... INCORRECT!", cowsayQuestionSpeaker.value);
        setTimeout(() => cowsayQuestion(question, cowsayQuestionSpeaker.value), '2000');
        setTimeout(() => cowsayAnswer('Thinking of an answer...', cowsayAnswerSpeaker.value, 'think'), '2000');
    }
}

// Initialization things
function generateButtons() {
    for(var i = 0; i < 4; i++) {
        buttons[i] = document.querySelector(`#button${i}`);
    }
    buttons.forEach(button => {
        button.onclick = function(){checkAnswer(button.value)};
    });
    document.querySelector('#newquestion').onclick = function(){
        newQuestion(1, questionModifierCategory.value, questionModifierDifficulty.value);
    };
}


// Some hardcoded cowsay items to help with having existing objects 
// while the page is still loading (mainly if it takes a while)
function initCowsayQuestion() {
    cowsayQuestionElem.innerText = ` ____________________________
( Thinking of an question... )
 ----------------------------
        o   ^__^
         o  (oo)\\_______
            (__)\\       )\\\/\\
                ||----w |
                ||     ||
`;
}

function initCowsayAnswer() {
    cowsayAnswerElem.innerText = ` __________________________
( Thinking of an answer... )
 --------------------------
        o   ^__^
         o  (oo)\\_______
            (__)\\       )\\\/\\
                ||----w |
                ||     ||
`;
}