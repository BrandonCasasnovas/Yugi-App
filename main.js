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
                // store the response in global a variable for later manipulation
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
    // stores the name and ID of all cards exclusively into global variables for manipulation
    for (let i = 0; i < state.length; i++){
        cardName.push(state[i].name);
        cardID.push(state[i].id);
    }
}

const removeDuplicates = (arr) =>{
    // removes all multi-printed cards from the array list in preperation for plugging the cardList into the jquery drop down library as data source
    let finalArray = []
    for(let i = 0;i < arr.length; i++){
        // push all non duplicates to finalArray to filter out any duplicate/multi-printed cards 
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
            response(cardNames.slice(0, 20));
        }
    });
    $("#search_id").autocomplete({
        source: function (request, response) {
            let cardIDs = $.ui.autocomplete.filter(cardID, request.term);
            response(cardIDs.slice(0, 15));
        }
    });
}

const generateCardBlock = () => {
    
    
    let infoContainer = document.getElementById('info_container');

    if (document.getElementById('cardBlock_container') == null){
        let cardBlock = document.createElement('div');
        cardBlock.setAttribute("id", "cardBlock_container");
        cardBlock.setAttribute("class", "row");
        infoContainer.append(cardBlock);
        
        let cardNameContainer = document.createElement('div');
        cardNameContainer.setAttribute("id", "name_container");
        cardNameContainer.setAttribute("class", "row");
        cardBlock.prepend(cardNameContainer);
        
        let cardImage = document.createElement('div');
        cardImage.setAttribute("id", "img_container");
        cardImage.setAttribute("class", "col-md-4");
        cardBlock.append(cardImage);
        
        let cardText = document.createElement('div');
        cardText.setAttribute("id", "text_container");
        cardText.setAttribute("class", "col-md-8");
        cardBlock.append(cardText);

        let cardId = document.createElement('div');
        cardId.setAttribute("id", "card_id");
        cardId.setAttribute("class", "row");
        cardText.append(cardId);

        let attribute = document.createElement('div');
        attribute.setAttribute("id", "attribute");
        attribute.setAttribute("class", "row")
        cardText.append(attribute);

        let level = document.createElement('div');
        level.setAttribute("id", "level");
        level.setAttribute("class", "row");
        cardText.append(level);

        let atk = document.createElement('div');
        atk.setAttribute("id", "attack");
        atk.setAttribute("class", "row");
        cardText.append(atk);
        
        let def = document.createElement('div');
        def.setAttribute("id", "defense");
        def.setAttribute("class", "row");
        cardText.append(def);
        
        let cardType = document.createElement('div');
        cardType.setAttribute("id", "cardType");
        cardType.setAttribute("class", "row");
        cardText.append(cardType);
        
        let monsterType = document.createElement('div');
        monsterType.setAttribute("id", "monsterType");
        monsterType.setAttribute("class", "row");
        cardText.append(monsterType);
        
        let archetype = document.createElement('div');
        archetype.setAttribute("id", "archetype");
        archetype.setAttribute("class", "row");
        cardText.append(archetype);
        
        let banTcg = document.createElement('div');
        banTcg.setAttribute("id", "tcg_status");
        banTcg.setAttribute("class", "row");
        cardText.append(banTcg);
        
        let banOcg = document.createElement('div');
        banOcg.setAttribute("id", "ocg_status");
        banOcg.setAttribute("class", "row");
        cardText.append(banOcg);
        
        let description = document.createElement('div');
        description.setAttribute("id", "description");
        description.setAttribute("class", "row");
        cardText.append(description);
    
        let cardNameValue = document.getElementById("card_name_input").value;

        for (let i = 0; i < state.length; i++) {
            if (cardNameValue == state[i].name) {
                cardNameContainer.innerHTML += "<h>"+state[i].name+"</h>";
                cardImage.innerHTML += "<img id='card_image' class='img-responsive' src=https://ygoprodeck.com/pics/"+state[i].id+".jpg >"
                cardId.innerHTML += "ID: " + state[i].id;
                attribute.innerHTML += "Attribute: " + state[i].attribute;
                level.innerHTML += "Level: " + state[i]. level;
                atk.innerHTML += "Attack: " + state[i].atk;
                def.innerHTML += "Defense :" + state[i].def;
                cardType.innerHTML += "Card Type: " + state[i].type;
                monsterType.innerHTML += "Monster Type: " + state[i].race;
                archetype.innerHTML += "Archetype: " + state[i].archetype;
                banTcg.innerHTML += "TCG Ban Status: " + state[i].ban_tcg;
                banOcg.innerHTML += "OCG Ban Status: " + state[i].ban_ocg;
                description.innerHTML += "Description: " + state[i].desc;
            }
        }
    }
}

const generateThumnail = () => {
    // stores the user input value
    let cardNameValue = document.getElementById("card_name_input").value;
    let infoContainer = document.getElementById('info_container');
    // create container for thumbnails to populate
    if (document.getElementById('thumbnail_container') == null){
        let thumnailContainer = document.createElement('div');
        thumnailContainer.setAttribute("id", "thumbnail_container");
        thumnailContainer.setAttribute("class", "row");
        // inserts the thumbnail container at the top of the info_container div
        infoContainer.prepend(thumnailContainer);
    }
    // stores the ID's of multi-printed cards in the global array 'thumbnailIDs'
    thumbnailIDs = [];
    for (let i = 0; i < state.length; i++){
    if (cardNameValue == state[i].name){
        thumbnailIDs.push(state[i].id)
    }
}

    // for every multi-printed card, create a div to hold the thumbnail image
    thumbnailIDs.forEach(function(el){
        let newThumbnail = document.createElement('div');
        newThumbnail.setAttribute("data-id", el)
        newThumbnail.setAttribute("class", 'thumbnail')
        newThumbnail.innerHTML += `<img class='thumbnail_img col' src=https://storage.googleapis.com/ygoprodeck.com/pics_small/${el}.jpg >`
        thumbnail_container.appendChild(newThumbnail);
    });
}

const clearContent = () => {
    // targets the thumbnail container in preperation for clearing on new search
    let thumbnailContainer = document.getElementById('thumbnail_container');
    let cardBlock = document.getElementById('cardBlock_container');
    let infoContainer = document.getElementById('info_container');
    
    // if element exists, clear all contents from the parent element 'info_container'
    if (thumbnailContainer != null){
        thumbnailContainer.innerHTML = "";
        console.log('thumbnail cleared')
    } 
    if (cardBlock != null) {
        infoContainer.innerHTML = "";
        // document.getElementById('name_container').innerHTML = "";
        // document.getElementById('img_container').innerHTML = "";
        // document.getElementById('text_container').innerHTML = "";
        console.log('cardBlock cleared');
    }
}

const storeDuplicates = (arr) =>  {
    // result array which will contain all duplicate IDs within this scope
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
            generateCardBlock();
        }
    });
});
