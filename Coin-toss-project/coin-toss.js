
let score = JSON.parse(localStorage.getItem('score')) ||{
    wins :0,
    losses :0
};

updateScoreElement1();

function pickcomputerMove1(){

    const randomNumber = Math.random();

    let result='';

    if (randomNumber >= 0 && randomNumber < 1/2){
        result  = 'Heads';
    }else if(randomNumber >= 1/2 && randomNumber < 1){
        result = 'Tails';
    }

    return result;
}



function playCoinTossGame(playerinput){

    const result = pickcomputerMove1();

    let verdict = '';

    if(playerinput === 'Heads' && result ==='Heads'){
        verdict ='you won the coin toss :)';
    }else if(playerinput === 'Tails' && result === 'Heads'){
        verdict ='you lost the coin toss :(';
    }else if(playerinput === 'Tails' && result === 'Tails'){
        verdict = 'you won the coin toss :)';
    }else if(playerinput === 'Heads' && result === 'Tails'){
        verdict = 'you lost the coin toss :(';
    }

    if(verdict === 'you won the coin toss :)'){
        score.wins += 1;
    }else if (verdict === 'you lost the coin toss :('){
        score.losses += 1;
    }

    localStorage.setItem('score',JSON.stringify(score));

    updateScoreElement1();

    document.querySelector('.js-result1').innerHTML = `Result of coin toss was ${result}`;

    document.querySelector('.js-moves1').innerHTML = `You picked ${playerinput}. `;

}

function updateScoreElement1(){
    document.querySelector('.js-score1')
    .innerHTML = `Wins:${score.wins},Losses:${score.losses}`;
}