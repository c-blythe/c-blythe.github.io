const searchbar = document.querySelector('#searchbar');
const results = document.querySelector('#search-results');
searchHelpButtonInit();

searchbar.addEventListener('keyup', (ev) => {
    if (ev.key === 'Enter') {
        results.innerHTML = '';
        switch (searchbar.value.toLowerCase()) {
            case '!all':
                questionLog.forEach((question) => getQuestion(question));
                break;
            case '!solved':
                getSolved(true);
                break;
            case '!unsolved':
            case '!not solved':
                getSolved(false);
                break;
            case '!easy':
                getDifficulty('easy');
                break;
            case '!medium':
                getDifficulty('medium');
                break;
            case '!hard':
                getDifficulty('hard');
                break;
            case '!none':
                break;
            default:
                questionLog.forEach((question) => {
                    if (question.question.toLowerCase().includes(searchbar.value.toLowerCase())) 
                        getQuestion(question);
                });
                break;
        }        
    }
});

function getSolved(solved) {
    questionLog.forEach((pastQuestion) => {
        if (pastQuestion.solved === solved) {
            getQuestion(pastQuestion);
        }
    });
}

function getDifficulty(difficulty) {
    questionLog.forEach((pastQuestion) => {
        if (pastQuestion.difficulty === difficulty) {
            getQuestion(pastQuestion);
        }
    })
}

function getQuestion(pastQuestion) {
    let mainLi = document.createElement('li');
    mainLi.innerText = HTMLFormat(pastQuestion.question);
    mainLi.className = 'question-li'

    let subLiCategory = document.createElement('li');
    subLiCategory.innerText = 'Category: '.concat(pastQuestion.category);

    let subLiDifficulty = document.createElement('li');
    subLiDifficulty.innerText = 'Difficulty: '.concat((pastQuestion.difficulty.charAt(0).toUpperCase()) + pastQuestion.difficulty.slice(1));

    let subLiAnswers = document.createElement('li');
    subLiAnswers.innerText = 'Answers:'
    pastQuestion.incorrect_answers.forEach((answer) => {
        let answerLi = document.createElement('li');
        answerLi.innerText = answer;
        answerLi.className = 'answer-li';

        if (answer.substring(3, answer.length)  === pastQuestion.correct_answer) {
            answerLi.className = answerLi.className.concat(' ', 'correct-li');
        }
        subLiAnswers.appendChild(answerLi);
    })

    let subLiSolved = document.createElement('li');
    let solved = pastQuestion.solved ? 'Yes' : 'No'
    subLiSolved.innerText = 'Solved: '.concat(solved);
    
    let subLiAttempts = document.createElement('li');
    subLiAttempts.innerText = 'Attempts: '.concat(pastQuestion.attempts);

    mainLi.appendChild(subLiCategory);
    mainLi.appendChild(subLiDifficulty);
    mainLi.appendChild(subLiAnswers);
    mainLi.appendChild(subLiSolved);
    mainLi.appendChild(subLiAttempts);
    [...mainLi.children].forEach((child) => child.className = 'sub-li');

    results.appendChild(mainLi);
}


function searchHelpButtonInit() {
    const helpButton = document.querySelector('#search-help');
    helpButton.onclick = function(){
        text = 'Search Button Help';
        text = text.concat('\n\n', 'Keywords:');
        text = text.concat('\n', ' - All');
        text = text.concat('\n', '   - Gets every question');
        text = text.concat('\n', ' - None');
        text = text.concat('\n', '   - Doesn\'t get any questions');
        text = text.concat('\n', ' - Solved');
        text = text.concat('\n', '   - Gets every solved question');
        text = text.concat('\n\n', ' - Unsolved');
        text = text.concat('\n', ' - Not Solved');
        text = text.concat('\n', '   - Gets every unsolved question');
        text = text.concat('\n', ' - Easy');
        text = text.concat('\n', ' - Medium');
        text = text.concat('\n', ' - Hard');
        text = text.concat('\n', '   - Gets every question with the corresponding difficulty');

        text = text.concat('\n\n', 'Usage:');
        text = text.concat('\n', ' - Enter a "!" followed by any keyword and press enter');
        text = text.concat('\n', ' - If the search is not a keyword, then it will search for any questions\n    that contain the query');

        alert(text);
    }
}