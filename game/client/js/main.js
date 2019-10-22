//main

var cellClickedFunction;
var playerArray = [];
var winConditions = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]]

function startGame(player) {
    var row = document.getElementById("gameGrid").rows;
    cellClickedFunction = function(){
            clickedOnCell(event, player)
    }
    for (var i = 0; i < row.length; i++) {
        for (var j = 0; j < row[i].cells.length; j++ ) {
            row[i].cells[j].addEventListener('click', cellClickedFunction)
        }
    }
    document.getElementById("playerIdSpan").innerHTML = player;
    // document.getElementById("playerIdSpan").classList.add("player" + player);
}

function clickedOnCell(e, player) {
    if(player === "X") {
        //make a blue cell
        e.target.classList.add("playerX")
        e.target.innerHTML = "X";
    } else if (player === "O") {
        //make a red cell
        e.target.classList.add("playerO")
        e.target.innerHTML = "O";
    }
    e.target.removeEventListener('click', cellClickedFunction);
    var cellNumber = e.target.getAttribute("number");
    cellNumber = parseInt(cellNumber)
    playerArray.push(cellNumber);
    playerArray.sort();
    console.log(playerArray);
    if(playerArray.length >= 3){
        checkCells(player, playerArray);
    }
    Client.sendClick(cellNumber, player)
}

function checkCells(player, playerArraySet) {
    console.log("checking cells...")
    if(compareArrays(playerArraySet, winConditions[0]) ||
       compareArrays(playerArraySet, winConditions[1]) ||
       compareArrays(playerArraySet, winConditions[2]) ||
       compareArrays(playerArraySet, winConditions[3]) ||
       compareArrays(playerArraySet, winConditions[4]) ||
       compareArrays(playerArraySet, winConditions[5]) ||
       compareArrays(playerArraySet, winConditions[6]) ||
       compareArrays(playerArraySet, winConditions[7])) {
           winGame(player);
       }
}


function compareArrays(array1,array2){

    const intersection = array1.filter(element => array2.includes(element));

    if(intersection.length >= 3) {
        return true;
    } else {
        return false;
    }

}

function winGame(player) {
    console.log("win game")
    document.getElementById("gameWon").style.display = "block";
    document.getElementById("winnerName").innerHTML = player + "";
    Client.gameWon(player)
}
