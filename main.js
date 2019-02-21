'use strict';

// Global variables
let state;
let cardName = [];
let cardID = [];
let cardList;
let duplicatePrints;
let thumbnailIDs = [];


const apiCall = () => {
	// api call to YGOpro's Yugioh card database
    let requestURL = 'https://db.ygoprodeck.com/api/v2/cardinfo.php';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onerror = function(){
        alert('Cannot connect to server');
        }
    
        request.onload = function () {
        // Process our return data
            if (request.status >= 200 && request.status < 300) {
                // This will run when the request is successful
                console.log('success!', request);
                state = request.response[0];
                nameIdGeneration();
                if (cardID.length <= state.length){
                    cardList = removeDuplicates(cardName);
                }
                // stores all duplicate cards in a global array named duplicatePrints
                duplicatePrints = storeDuplicates(cardName);
            } 
        }
}
const nameIdGeneration = () => {
    for (let i = 0; i < state.length; i++){
        cardName.push(state[i].name);
        cardID.push(state[i].id);
    }
}

const removeDuplicates = (arr) =>{
    let finalArray = []
    for(let i = 0;i < arr.length; i++){
        // if the string i is iterating over in the passed array does not exist in final_array, it adds that string to final_array
        if(finalArray.indexOf(arr[i]) == -1){
            finalArray.push(arr[i])
        }
        console.log('stuff added');
    }
    return finalArray;
}

// handles the autocomplete dropdown on the search input boxes for name and ID using the jquery autocomplete library
window.onload = function () {
    $("#card_name_input").autocomplete({
        source: function (request, response) {
            let cardNames = $.ui.autocomplete.filter(cardList, request.term);
            response(cardNames.slice(0, 15));
        }
    });
    $("#search_id").autocomplete({
        source: function (request, response) {
            let cardIDs = $.ui.autocomplete.filter(cardID, request.term);
            response(cardIDs.slice(0, 15));
        }
    });
}

const generateThumnail = () => {
 
    let cardNameValue = document.getElementById("card_name_input").value;
    let infoContainer = document.getElementById('info_container');
    let thumnailContainer = document.createElement('div');
    thumnailContainer.setAttribute("id", "thumnail_container");
    thumnailContainer.setAttribute("class", "row");
    infoContainer.prepend(thumnailContainer);

    for (let i = 0; i < state.length; i++){

        if (cardNameValue == state[i].name){
            thumbnailIDs.push(state[i].id)
        }
    }

    thumbnailIDs.forEach(function(el){
        let newThumbnail = document.createElement('div');
        newThumbnail.setAttribute("data-id", el)
        newThumbnail.setAttribute("class", 'thumbnail')
        newThumbnail.innerHTML += "<img class='thumbnail_img col' src=https://storage.googleapis.com/ygoprodeck.com/pics_small/"+el+".jpg >"
        thumnail_container.appendChild(newThumbnail);

    });
}


const clearContent = () => {
    document.getElementById('name_container').innerHTML = "";
    document.getElementById('img_container').innerHTML = "";
    document.getElementById('card_id').innerHTML = "";
    document.getElementById('row_1').innerHTML = "";
    document.getElementById('row_1_2').innerHTML = "";
    document.getElementById('row_2').innerHTML = "";
    document.getElementById('row_2_2').innerHTML = "";
    document.getElementById('row_3').innerHTML = "";
    document.getElementById('row_4').innerHTML = "";
    document.getElementById('row_5').innerHTML = "";
    document.getElementById('row_6').innerHTML = "";
}

const storeDuplicates = (arr) =>  {

    let duplicates = [];
  
    arr.forEach(function(element, index) {
      
      // Find if there is a duplicate or not
      if (arr.indexOf(element, index + 1) > -1) {
        
        // Find if the element is already in the result array or not
        if (duplicates.indexOf(element) === -1) {
          duplicates.push(element);
          console.log('cards pushed to dupes array')
        }
      }
    });
  
    return duplicates;
  }

// program logic begins here
apiCall();

$(document).ready(function () {
    
    document.getElementById("name_search").addEventListener("click", function () {
 
        clearContent();

        let cardNameValue = document.getElementById("card_name_input").value;

        if (duplicatePrints.includes(cardNameValue) == true){
            generateThumnail();
        } else {

            let cardNameContainer = document.getElementById('name_container');
            let cardImage = document.getElementById('img_container');
            let cardId = document.getElementById('card_id');
            let attribute = document.getElementById('row_1');
            let level = document.getElementById('row_1_2');
            let atk = document.getElementById('row_2');
            let def = document.getElementById('row_2_2');
            let cardType = document.getElementById('row_3');
            let monsterType = document.getElementById('row_4');
            let archetype = document.getElementById('row_5');
            let description = document.getElementById('row_6');

            for (let i = 0; i < state.length; i++) {
                if (cardNameValue == state[i].name) {
                    cardNameContainer.innerHTML += "<h>"+state[i].name+"</h>";
                    cardImage.innerHTML += "<img id='card_image' class='img-responsive' src=https://ygoprodeck.com/pics/"+state[i].id+".jpg >"
                    cardId.innerHTML += "ID: " + state[i].id;
                    row_1.innerHTML += "Attribute: " + state[i].attribute;
                    row_1_2.innerHTML += "Level: " + state[i].level;
                    row_2.innerHTML += "Attack: " + state[i].atk;
                    row_2_2.innerHTML += "Defense :" + state[i].def;
                    row_3.innerHTML += "Card Type: " + state[i].type;
                    row_4.innerHTML += "Monster Type: " + state[i].race;
                    row_5.innerHTML += "Archetype: " + state[i].archetype;
                    row_6.innerHTML += "Description: " + state[i].desc;
                }
            }
        }
    });
});
