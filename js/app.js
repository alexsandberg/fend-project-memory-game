
 let cardList = [...document.querySelectorAll('.card')];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let deck = document.querySelector('.deck');

const shuffleFunc = function() {
    //shuffle the cards
    cardList = shuffle(cardList);

    //hide the deck
    deck.classList.add('hide');
    // deck.style.display = 'none';

    //delete the existing cards
    while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
    }

    //add the reordered cards
    for (let i=0; i<cardList.length; i++) {

        const item = document.createElement('li');
        item.innerHTML = cardList[i].innerHTML;
        item.className = 'card';
        item.id = cardList[i].id;
        deck.appendChild(item);
    }

    //redisplay the deck
    document.querySelector('.deck').classList.remove('hide');

};

// shuffle game with every page reload
shuffleFunc();


function displaySymbol(card) {
  card.classList.toggle('show');
}

function openCard(card) {
  card.classList.toggle('open');
}

const openList = new Array();

let card1;
let card2;
let card1Symbol;
let card2Symbol;

// function for counting game moves
let moveCounter = 0;
function moves() {
  moveCounter++; //increment moveCounter
  document.querySelector('.moves').innerHTML = moveCounter;
}

// function for changing stars
let starsNum = 3;
function stars() {
  if(moveCounter>8 && moveCounter<16) {
    // 2 stars
    document.getElementById('third-star').className = 'fa fa-star-o';
    starsNum = 2;
  }

  if(moveCounter>16) {
    // 1 star
    document.getElementById('second-star').className = 'fa fa-star-o';
    starsNum = 1;
  }
}

/////////////////
//timer functions
/////////////////

// formats numbers to two digits
const formatted = function(n) {
  return n.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
};

let seconds = 0;
let minutes = 0;
let hours = 0;

let timeReturn;
function timer() {
  timeReturn = setInterval(timerFunc, 1000);
}

// returns string of formatted time
const time = function() {
  return formatted(hours) + ":" + formatted(minutes) + ":" + formatted(seconds);
};

function timerFunc() {
  document.querySelector('.timer').innerHTML = time();
  seconds++;
  if((seconds%60)==0) {
    minutes++;
    seconds = 0;
  }
  if(((minutes%60)==0)&&(minutes>0)) {
      hours++;
      minutes = 0;
  }
}

// function for stopping timer
function stopTimer() {
  clearInterval(timeReturn);
  seconds = 0;
  minutes = 0;
  hours = 0;
}

// function for getting win time
let winSec = 0;
let winMin = 0;
let winHr = 0;
function winTime() {
  seconds--;
  if(seconds==1) {
    winSec = seconds + " second";
  } else {
    winSec = seconds + " seconds";
  }

  if(minutes==1) {
    winMin = minutes + " minute";
  } else {
    winMin = minutes + " minutes";
  }

  if(winHr==1) {
    winHr = hours + " hour";
  } else {
    winHr = hours + " hours";
  }
}

// start timer on page refresh
timer();

///////////////

// function for winning game
function win() {
  // get game time
  winTime();

  // stop timer
  stopTimer();

  let timeString;
  if(winHr=="0 hours") {
    timeString = winMin + " and " + winSec;
  } else {
    timeString = winHr + ", " + winMin + " and " + winSec;
  }

  document.querySelector('.win-page').classList.remove('hide');
  document.querySelector('.win-page').classList.add('win-pop');
  document.querySelector('.moves-win').innerHTML = moveCounter;
  document.querySelector('.win-time').innerHTML = timeString;

  if (starsNum == 1){
    document.querySelector('.stars-num').innerHTML = starsNum + " star";
  } else {
    document.querySelector('.stars-num').innerHTML = starsNum + " stars";
  }
}

let matches = 0;

// function for comparing cards for match
function compareCards(card) {

  // second card
  if(openList.length==1){
    card2 = card;
    openList.push(card2); // add to list
    card2.removeEventListener('click', cardActions); // remove listener

    // pause all other listeners while cards are verifying
    pauseListeners(card2);

    // reset event listeners after card animations
    setTimeout(function() {
      redoListener();
    }, 1500);

    moves();
    stars();

    //second card symbol
    card2Symbol = card2.getElementsByTagName('I')[0].className;

    // if match
    // symbol must be same but card itself must be different
    if((card1Symbol == card2Symbol) && !(card1.classList == card2.classList)) {
      card1.classList.add('match');
      card2.classList.add('match');

      matches++; // iterate matches

      // show win page after 8 matches
      if(matches==8){
        setTimeout(function() {
          win()
        }, 1000);
      }
      // no match
    } else {
      setTimeout(function() {
        card1.classList.add('no-match');
      }, 200)

      setTimeout(function() {
        card2.classList.add('no-match');
      }, 200)

      // add back both event listeners after cards flip back
      for(let i=0; i<openList.length; i++) {
        const temp = openList[i];
        setDelay(temp);
      }
      function setDelay(temp) {
        setTimeout(function(){
          temp.addEventListener('click', cardActions);
        }, 2000);
      }

      //flip both cards back
      for(let i=0; i<openList.length; i++) {
        const temp = openList[i];
        setTimeout(function(){
          displaySymbol(temp)
          temp.classList.remove('no-match');
        }, 1600);
        setTimeout(function(){
          openCard(temp)
        }, 1600);
      }
    }
  }

  // first card
  if(openList.length==0) {
    card1 = card;
    openList.push(card1); // add to list

    // remove event listener
    card1.removeEventListener('click', cardActions);

    // pause all other listeners
    pauseListeners(card1);

    // reset event listeners after card flip
    setTimeout(function() {
      redoListener();
    }, 300);

    // first card symbol
    card1Symbol = card1.getElementsByTagName('I')[0].className;
  }

  // clear the list after 2 cards
  if(openList.length==2) {
      openList.pop();
      openList.pop();
  }
}

function cardActions(e) {
  let temp = e.currentTarget;
  displaySymbol(temp);
  openCard(temp);
  compareCards(temp);
}

// event listeners for cards
const cardListeners = function() {
  const cards = document.querySelectorAll('.card');
  for(let i=0; i<16; i++) {
    let card = cards[i];
    card.addEventListener('click', cardActions);
  }
};
cardListeners(); // add listeners when page is refreshed

// function used for pausing listeners during game play
function pauseListeners(card) {

  let tempList = [...document.querySelectorAll('.card')];

  for(let i=0; i<tempList.length; i++) {
     if(tempList[i].classList.contains('open'))
     tempList.splice(i,1);
  }

  //remove any event listener that doesn't match the current card in play
  for(let i=0; i<tempList.length; i++) {
     tempList[i].removeEventListener('click', cardActions);
     // console.log('removed ' + tempList[i].id);
  }
}

// function for re-adding listeners to cards that are still in play
function redoListener() {
  let tempList = [...document.querySelectorAll('.card')];
  for(let i=0; i<tempList.length; i++) {
    if(!(tempList[i].classList.contains('open')))
    {
      tempList[i].addEventListener('click', cardActions);
    }
  }
}

// restart game function
function restartGame() {
  shuffleFunc(); // reshuffle cards

  // reset move counter
  document.querySelector('.moves').innerHTML = '0';
  moveCounter = 0;

  // reset matches
  matches = 0;

  cardListeners();// add event listeners

  // reset stars
  document.getElementById('third-star').className = 'fa fa-star';
  document.getElementById('second-star').className = 'fa fa-star';

  // clear and reset timer
  stopTimer();
  timer();

  // clear openList
  openList.pop();

}

// restart button functionality
const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', function(event) {
  restartGame();
});

// play again button functionality
const playAgainButton = document.querySelector('.play-again');
playAgainButton.addEventListener('click', function(event) {
  restartGame();
  document.querySelector('.win-page').classList.add('hide');
});
