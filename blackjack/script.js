//This was created using a tutorial from udemy.com: https://www.udemy.com/courses/search/?q=javascript%20html%20game%20from%20scratch%20blackjack&src=sac&kw=blackjack
//Modified by Tim Cullingham for educational purposes
//Primary changes to javascript are adding sound effects, a card counting function and improving the dealers ai
//The source code is included in the root folder

let cards = [];
let playerCard = [];
let dealerCard = [];
let cardCount = 0;
let suits = ["spades", "hearts", "clubs", "diams"];
let numb = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
let message = document.getElementById("message");
let output = document.getElementById("output");
let dealerHolder = document.getElementById("dealerHolder");
let playerHolder = document.getElementById("playerHolder");
let deckItem = document.getElementById("deckfive");
let myDollars = 100;
let pValue = document.getElementById("pValue");
let dValue = document.getElementById("dValue");
let endplay = false;
let dollarValue = document.getElementById("dollars");



//bet is limited to 1-100 using an anon function
document.getElementById('mybet').onchange = function(){
    //if the value is less than 0 change it to 0
    if(this.value < 0){this.value = 0;}
    //if the value is more than myDollars change it to myDollars
    if(this.value > myDollars){this.value=myDollars;}
    //output bet amount
    message.innerHTML = "Bet changed to $"+this.value;
}

//creating a for loop that iterates through both suits and values to create 52 cards
for(s in suits){
    //when the uppercase first letter of a suit equals spades or clubs, display it as black, otherwise display it as red
    let suit = suits[s][0].toUpperCase();
    let bgcolor = (suit == "S" || suit == "C") ? "black" : "red";
    for(n in numb){
        //if the card value is greater than 9, the value is 10, or else it is 11
        let cardValue = (n>9) ? 10 : parseInt(n)+1
        //the card object has a suit, icon, color, number and value
        let card = {
            suit:suit,
            icon:suits[s],
            bgcolor:bgcolor,
            cardnum:numb[n],
            cardvalue:cardValue
        }
        //push a card into the cards array until it loops fully
        cards.push(card);
    }
}


//function that starts the game using the other functions
function Start(){ 
    shuffle(cards);
    dealNew();
    //play cardflip
    let x = document.getElementById("cardflip"); 
    function playCard() { 
    x.play(); 
    } 
    playCard();
    //hide start button and show dollars remaining
    document.getElementById('start').style.display = 'none';
    document.getElementById('dollars').innerHTML = myDollars;
}

//deal a new hand
function dealNew(){
    //player shouldnt know the dealers hand until later
    dValue.innerHTML = "?";
    //clear out variables 
    playerCard = [];
    dealerCard = [];
    dealerHolder.innerHTML = "";
    playerHolder.innerHTML = "";

    //grab mybet value and adjust myDollars 
    let betvalue = document.getElementById('mybet').value;
    myDollars=myDollars-betvalue;
    //output myDollars
    document.getElementById('dollars').innerHTML = myDollars;
    //show actions 
    document.getElementById('myactions').style.display = 'block';
    //show current bet
    message.innerHTML = "Current bet is $"+betvalue;
    //disable further betting
    document.getElementById('mybet').disabled = true;
    document.getElementById('maxbet').disabled = true;
    deal();
    //hide deal button
    document.getElementById('btndeal').style.display = 'none';
    updateDeck();
}

//keeps from going over the max amount of cards
function redeal(){
    cardCount++;
    //if the card count is 50, shuffle and reset and output message
    if(cardCount > 50){
    shuffle(cards);
    cardCount = 0;
    message.innerHTML = "New Shuffle";
    }
}

function deal(){
    // card count reshuffle
    for(x=0;x<2;x++){
        //for both the player and dealer, deal two cards and output them
        dealerCard.push(cards[cardCount]);
        dealerHolder.innerHTML += cardOutput(cardCount, x);
        //cover up the first dealer card
        if(x==0){
            dealerHolder.innerHTML += "<div id='cover' style='left:100px'></div>";
        }
        //checking there are enough cards left
        redeal()
        //deal player
        playerCard.push(cards[cardCount]);
        playerHolder.innerHTML += cardOutput(cardCount, x);
        redeal()
    } 
    //end play if player has a blackjack
    let playervalue = checktotal(playerCard);
    if(playervalue == 21 && playerCard.length == 2){
        playend();
    }
    //display the value of player cards
    pValue.innerHTML = playervalue;
    updateDeck();
}

//grab whatever the value of myDollars is and add it to mybet and make message
function maxbet(){
    document.getElementById('mybet').value = myDollars;
    message.innerHTML = "Bet changed to $"+myDollars;
}

//handles hit and hold
function cardAction(a){
    switch (a){
        case 'hit':
            playucard();  //add new card to players hand
            //play cardflip
            updateDeck();
            let x = document.getElementById("cardflip"); 
            function playCard() { 
            x.play(); 
            } 
            playCard();
            break;
        case 'hold':
            playend(); //playout and calculate   
            break;
        default:        
            playend(); //playout and calculate
    }
}



//adding new cards
function playucard(){
    //grab next card push into card array
    playerCard.push(cards[cardCount]);
    //update the innerHTML
    playerHolder.innerHTML += cardOutput(cardCount, (playerCard.length -1));
    //update the cards and increment
    redeal();
    //check the value of the players cards
    let rValu = checktotal(playerCard);
    pValue.innerHTML = rValu;
    //if the value of the players cards is over 21 then end play
    updateDeck();
    if(rValu>21){
        message.innerHTML +"busted!";
        playend();
    }
}

//update the display to reflect endgame state
function playend(){
    endplay=true;
    //stop covering dealer card
    document.getElementById('cover').style.display = 'none';
    //hide actions
    document.getElementById('myactions').style.display = 'none';
    //show deal button
    document.getElementById('btndeal').style.display = 'block';
    //allow betting
    document.getElementById('mybet').disabled = false;
    document.getElementById('maxbet').disabled = false;
    //show endgame message
    message.innerHTML = "Game Over<br>";
    let payoutJack = 1;
    let dealervalue = checktotal(dealerCard);
    let playervalue = checktotal(playerCard);
    dValue.innerHTML = dealervalue;
    pValue.innerHTML = playervalue;

    //if the dealervalue is less than 17 and the player has not busted and dealer value is less than player value the computer hits
    while(dealervalue < 17 && playervalue < 22 && dealervalue < playervalue){
        dealerCard.push(cards[cardCount]);
        dealerHolder.innerHTML += cardOutput(cardCount, (dealerCard.length -1));
        redeal();
        dealervalue = checktotal(dealerCard);
        dValue.innerHTML = dealervalue;
    }
    //if dealer value is less than player value and dealer value is less than 22 and the player value is less than 22 the computer hits
    while(dealervalue < playervalue && dealervalue < 22 && playervalue < 22){
        dealerCard.push(cards[cardCount]);
        dealerHolder.innerHTML += cardOutput(cardCount, (dealerCard.length -1));
        redeal();
        dealervalue = checktotal(dealerCard);
        dValue.innerHTML = dealervalue;
    }

    //Winner?
    
    //is it a player blackjack?
    if(playervalue == 21 && playerCard.length == 2){
        message.innerHTML = "Player Blackjack";
        //if so the payout is 1.5
        payoutJack = 1.5;
        //play applause
        playend();
        let x = document.getElementById("applause"); 
        function playWin() { 
        x.play(); 
        } 
        playWin();
    }
    //grab the bet value to update the players dollars if they win
    let betvalue = parseInt(document.getElementById('mybet').value)*payoutJack;
    //PLAYER WINS
    if((playervalue < 22 && dealervalue < playervalue) || (dealervalue > 21 && playervalue < 22)){
        message.innerHTML +='<span style="color:white">You WIN!! You won $'+betvalue+'</span>';
        myDollars = myDollars + (betvalue *2);
        let x = document.getElementById("applause"); 
        function playWin() { 
        x.play(); 
        } 
        playWin();
    }
    //DEALER WINS
    else if(playervalue > 21){
        message.innerHTML +='<span style="color:red">Dealer Wins :( <br> You lost $'+betvalue+'</span>';
        let x = document.getElementById("boo"); 
        function playBoo() { 
        x.play(); 
        } 
        playBoo();
    }
    //PUSH (tie)
    else if (playervalue == dealervalue){
        message.innerHTML +='<span style="color:blue">PUSH</span>';
        myDollars = myDollars + betvalue;
    }
    //DEALER WINS
    else {
        message.innerHTML +='<span style="color:red">Dealer Wins :( <br> You lost $'+betvalue+'</span>';
        let x = document.getElementById("boo"); 
        function playBoo() { 
        x.play(); 
        } 
        playBoo();
    }
    pValue.innerHTML = playervalue;
    dollarValue.innerHTML = myDollars;

}

//check the total of the array values
function checktotal(arr){
    let rValue = 0;
    //checking the ace
    let aceAdjust = false;
    //first ace has a value of 11 and second ace has a value of 1
    for(var i in arr){
        if(arr[i].cardnum =='A' && !aceAdjust){
            aceAdjust=true;
            rValue=rValue+10;
        }
        rValue=rValue+arr[i].cardvalue;
    }
    //if the ace in your hand and the r value is greater than 11 then subtract 10
    if(aceAdjust && rValue >21 ){
        rValue=rValue-10;
    }
    return rValue;
}

//setting the position of the cards
function cardOutput(n, x){
    //first card goes to 100px from the left, next moves 60px ect...
    let hpos = (x>0) ? x*80+100 : 100;
    return  '<div class="icard '+cards[n].icon+'" style="left:'+hpos+'px;"><div class="top-card suit">'+cards[n].cardnum+'<br></div><div class="content-card suit"></div><div class="bottom-card suit">'+cards[n].cardnum+'<br></div></div>';
}

//function that shuffles the array
function shuffle(array){
    for(let i = array.length -1;i>0;i--){
        let j = Math.floor(Math.random() * (i+1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

//display the amount of cards dealt
function updateDeck()
{
    document.getElementById('deckCount').innerHTML = cardCount;
}


