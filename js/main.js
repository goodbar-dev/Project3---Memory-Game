/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 /* BEGIN CLASSES */

 //Card Class Definition
let Card = function(name) {
  this.id = 0;
  this.name = name;
  this.displayed = false;
  this.locked = false;
}
Card.prototype.flip = function() {
  $('#card-' + this.id).toggleClass("flipped");
}
Card.prototype.isDisplayed = function() {
  if ($('#card-' + this.id).hasClass("flipped")) {
    this.displayed = true;
  } else {
    this.displayed = false;
  }
}
Card.prototype.lock = function() {
  this.locked = true;
  $('#card-' + this.id + ' figure:last-child').addClass("match");
}

/* END CLASSES */

/* BEGIN VARIABLES */

//create a list that holds all of your cards
let cards = new Array(
     new Card("fa-diamond")
   , new Card("fa-diamond")
   , new Card("fa-paper-plane-o")
   , new Card("fa-paper-plane-o")
   , new Card("fa-anchor")
   , new Card("fa-anchor")
   , new Card("fa-bolt")
   , new Card("fa-bolt")
   , new Card("fa-cube")
   , new Card("fa-cube")
   , new Card("fa-leaf")
   , new Card("fa-leaf")
   , new Card("fa-bicycle")
   , new Card("fa-bicycle")
   , new Card("fa-bomb")
   , new Card("fa-bomb")
 );

//define array to contain all the open cards.
let openCards = new Array();
//holds the number of clicks it takes to find all matches.
let moveCount;
//holds the number of clicks it takes to find all matches.
let gameTimeCount;
//initializes timer counting every second.
let gameTimer = setInterval(onGameTimerCount, 1000);

/* END VARIABLES */

/* BEGIN FUNCTIONS */

function onGameTimerCount(){
  gameTimeCount++;
  $('.time').text(" (" + gameTimeCount + " seconds)");
}

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

/**
 * Display the cards on the page
 *   - initialize the board/counters/stars
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function buildBoard() {
  //clear game board.
  $('.deck').empty();
  openCards = [];

  //initialize counters
  moveCount = 0;
  gameTimeCount = 0;
  $('.moves').text(moveCount);
  $('.time').text(" (0 seconds)");

  //initialize star ratings
  $('#star-3').removeClass('fa-star-o');
  $('#star-3').addClass('fa-star');
  $('#star-2').removeClass('fa-star-o');
  $('#star-2').addClass('fa-star');
  $('#star-1').removeClass('fa-star-o');
  $('#star-1').addClass('fa-star');

  //shuffle the list of cards
  shuffle(cards);

  //loop through each card and create its HTML
  for (let i = 0; i < cards.length; i++) {
    //add each card's HTML to the page
    $('.deck').append('<li id=\"card-' + i + '\" class=\"card\"><figure class="back"></figure><figure class=\"front fa ' + cards[i].name + '\"></figure>');
    cards[i].id = i;
  }

  $('.card').on('click', onCardClicked);
}

//look for any matches for the selected card.
function findCardMatch(selectedCard) {
  let matchFound = false;

  for (let i = 0; i < openCards.length; i++) {
      //check if card symbol name matches any open cards; if so,
      //leave them flipped and lock them.
      if (selectedCard.name == openCards[i].name) {
        selectedCard.lock();
        openCards[i].lock();
        openCards = [];
        matchFound = true;

        if (allCardsMatched()) {
          //stop timer
          clearTimeout(gameTimer);
          //display message with the final score once all cards have been matched
          //alert('All Cards Matched in ' + moveCount + ' moves!');
          $('.modal-content p').remove();
          $('.modal-content').append("<p>Congratulations!  You won in " + moveCount + " moves and " + gameTimeCount + " seconds!");
          $('#myModal').css("display", "block");
        }
      }
  }

  return matchFound;
}

//Check all cards to see if all have been matched.
function allCardsMatched() {
  let allMatched = true;

  for (let i = 0; i < cards.length; i++) {
      if (!cards[i].locked) {
        allMatched = false;
      }
  }

  return allMatched;
}

//When a card is selected, flip it, search for a match and leave it in the proper state.
function onCardClicked() {
  //get the card that was clicked
  let selectedId = $(this).attr('id').replace('card-','');
  let selectedCard = cards[selectedId];

  if (selectedCard.isDisplayed() || openCards.length >= 2) {
    return;
  } else {
    //increment click counter
    moveCount++;
    $('.moves').text(moveCount);

    //check move count and decrement stars if needed.
    if (moveCount == 20) {
      $('#star-3').removeClass('fa-star');
      $('#star-3').addClass('fa-star-o');
    } else if (moveCount == 30) {
      $('#star-2').removeClass('fa-star');
      $('#star-2').addClass('fa-star-o');
    } else if (moveCount == 40) {
      $('#star-1').removeClass('fa-star');
      $('#star-1').addClass('fa-star-o');
    }

    //display the card.
    selectedCard.flip();

    //after short delay, check if there is a match.
    //this is done so that the cards do not immediately flip back
    //preventing you from seeing the 2nd card.
    setTimeout(function() {
      if (!findCardMatch(selectedCard)) {
        //add selected card to list of open cards
        openCards.push(selectedCard);

        if (openCards.length == 2) {
          //hide both cards
          openCards[0].flip();
          openCards[1].flip();
          openCards = [];
        }
      }
    }, 800);
  }
}

//When the closed button is clicked on the modal window.
function onModalClosedClicked() {
  $('#myModal').css("display", "none");
}

/* END FUNCTIONS */

$(document).ready(function() {
  buildBoard();
  $('.restart').on('click', buildBoard);
  $('.close').on('click', onModalClosedClicked);
});
