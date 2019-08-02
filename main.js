
'use strict';

$(document).ready(function () {
// Global variables
let state;
let cardName = [];
let cardID = [];
let cardList;
let duplicatePrints;
let thumbnailIDs = [];
let currentState = history.state;



const cardInfoApi = () => {
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
                // console.log('success!', request);
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
    let finalArray = [];
    for(let i = 0;i < arr.length; i++){
        // push all non duplicates to finalArray to filter out any duplicate/multi-printed cards 
        if(finalArray.indexOf(arr[i]) == -1){
            finalArray.push(arr[i]);
        }
        // console.log('stuff added');
    }
    return finalArray;
}

// handles the autocomplete dropdown on the search input boxes for name and ID using the jquery autocomplete library
window.onload = function () {
    $("#card_name_input").autocomplete({
        source: function (request, response) {
            let cardNames = $.ui.autocomplete.filter(cardList, request.term);
            response(cardNames);
        }
    });
}

// this function generates the DOM elements on the page and fills them with appropriate api data based on user input
const generateCardBlock = (cardParams) => {
 
    let infoContainer = document.getElementById('info_container'); //define parent element all generated DOM elements will be apended to
    
    // the below if statement is only running if something gets passed to this function
    if (cardParams != "") { 
        if (document.getElementById('cardBlock_container') == null) {
            let cardBlock = document.createElement('div');
            cardBlock.setAttribute("id", "cardBlock_container");
            cardBlock.setAttribute("class", "row block");
            infoContainer.append(cardBlock);

            let cardNameContainer = document.createElement('div');
            cardNameContainer.setAttribute("id", "name_container");
            cardNameContainer.setAttribute("class", "col");
            cardBlock.prepend(cardNameContainer);
            
            let articleContainer = document.createElement('div');
            articleContainer.setAttribute("id", "article_container");
            articleContainer.setAttribute("class", "row block");
            infoContainer.append(articleContainer);

            let cardImage = document.createElement('div');
            cardImage.setAttribute("id", "img_container");
            cardImage.setAttribute("class", "col-md-4");
            articleContainer.append(cardImage);

            let clickZoom = document.createElement('span');
            clickZoom.setAttribute("id", "click_to_zoom");
            clickZoom.setAttribute("class", "row");
            clickZoom.textContent = "Click and hold to zoom";
            cardImage.append(clickZoom);

            let cardText = document.createElement('div');
            cardText.setAttribute("id", "text_container");
            cardText.setAttribute("class", "col-md-8");
            articleContainer.append(cardText);

            let cardId = document.createElement('li');
            cardId.setAttribute("id", "card_id");
            cardId.setAttribute("class", "text_node");
            cardText.append(cardId);

            let attribute = document.createElement('li');
            attribute.setAttribute("id", "attribute");
            attribute.setAttribute("class", "text_node")
            cardText.append(attribute);

            let level = document.createElement('li');
            level.setAttribute("id", "level");
            level.setAttribute("class", "text_node");
            cardText.append(level);

            let atk = document.createElement('li');
            atk.setAttribute("id", "attack");
            atk.setAttribute("class", "text_node");
            cardText.append(atk);

            let def = document.createElement('li');
            def.setAttribute("id", "defense");
            def.setAttribute("class", "text_node");
            cardText.append(def);

            let cardType = document.createElement('li');
            cardType.setAttribute("id", "cardType");
            cardType.setAttribute("class", "text_node");
            cardText.append(cardType);

            let monsterType = document.createElement('li');
            monsterType.setAttribute("id", "monsterType");
            monsterType.setAttribute("class", "text_node");
            cardText.append(monsterType);

            let archetype = document.createElement('li');
            archetype.setAttribute("id", "archetype");
            archetype.setAttribute("class", "text_node");
            cardText.append(archetype);

            let banTcg = document.createElement('li');
            banTcg.setAttribute("id", "tcg_status");
            banTcg.setAttribute("class", "text_node");
            cardText.append(banTcg);

            let banOcg = document.createElement('li');
            banOcg.setAttribute("id", "ocg_status");
            banOcg.setAttribute("class", "text_node");
            cardText.append(banOcg);

            let pendulumEffect = document.createElement('li');
            pendulumEffect.setAttribute("id", "pendulumEffect");
            pendulumEffect.setAttribute("class", "text_node");
            cardText.append(pendulumEffect);

            let description = document.createElement('li');
            description.setAttribute("id", "description");
            description.setAttribute("class", "text_node");
            cardText.append(description);

                      
            for (let i = 0; i < state.length; i++) {
                // this checks the searched card's params and pipes the appropriate data into the their respective DOM created fields
                if (cardParams === state[i].name || cardParams == state[i].id) {
                    let effects = state[i].desc.split('----------------------------------------');
                    // console.log(effects[0]);
                    cardNameContainer.innerHTML += "<h>" + state[i].name + "</h>";
                    cardImage.innerHTML += "<img id='card_image' class='img-responsive' src=https://ygoprodeck.com/pics/" + state[i].id + ".jpg >"
                    cardId.innerHTML += "ID: " + state[i].id;

                    // Applies "N/A" if spell or trap card for the "attribute" field"
                    if (state[i].type == 'Trap Card' || state[i].type =='Spell Card'){
                        attribute.innerHTML += "Attribute: " + "N/A";   
                    } else{
                        attribute.innerHTML += "Attribute: " + state[i].attribute;
                    }
                    
                    // Dynamically inserts 'Rank' or 'Level' if an xyz monster or normal monster 
                    if (state[i].type == 'XYZ Monster'){
                        level.innerHTML += "Rank: " + (state[i].level ? state[i].level : "N/A");  
                    } else if (state[i].type == 'Trap Card' || state[i].type=='Spell Card') {
                        level.innerHTML += "Level: " + "N/A";
                    } else{
                        level.innerHTML += "Level: " + (state[i].level ? state[i].level : "N/A");
                    }

                    atk.innerHTML += "Attack: " + (state[i].atk ? state[i].atk : "N/A");
                    def.innerHTML += "Defense : " + (state[i].def ? state[i].def : "N/A");
                    cardType.innerHTML += "Card Type: " + state[i].type;
                    monsterType.innerHTML += "Monster Type: " + state[i].race;
                    archetype.innerHTML += "Archetype: " + (state[i].archetype ? state[i].archetype : "N/A");
                    banTcg.innerHTML += "TCG Ban Status: " + (state[i].ban_tcg ? state[i].ban_tcg : "Unlimited")
                    banOcg.innerHTML += "OCG Ban Status: " + (state[i].ban_ocg ? state[i].ban_ocg : "Unlimited")
                    // If the card is a pendulum type, it splits the two effects into two seperate fields, if not - it just places the the card description in the default description element
                    if (effects.length > 1){
                        pendulumEffect.innerHTML += effects[0];
                        description.innerHTML += effects[1];
                    } else if (effects.length == 1){
                        description.innerHTML += "Description: " + effects[0];
                    }
                // prevents right click menu of image so on mobile if a user clicks to zoom, they don't get forced into default save image menu
                $("#card_image").on("contextmenu",function(e){
                return false;
});   
                }
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
        newThumbnail.setAttribute("data-card_id", el)
        newThumbnail.setAttribute("class", 'thumbnail')  
        newThumbnail.innerHTML += `<img class='thumbnail_img col' src=https://storage.googleapis.com/ygoprodeck.com/pics_small/${el}.jpg >`
        thumbnail_container.appendChild(newThumbnail);
    });
}

const doThumbnailsExist = () => {
    let thumbnails = document.getElementsByClassName('thumbnail_img').length;
    if (thumbnails == 0){
        return false;
    } else return true;
}

const clickableThumbnails = () => {
    let thumbnailsExist = doThumbnailsExist();

    if (thumbnailsExist = true) {
        let thumbnails = document.querySelectorAll('.thumbnail_img');
        for (let i = 0; i < thumbnails.length; ++i) {
            thumbnails[i].addEventListener('click', function () {
                var card_id = this.parentElement.getAttribute('data-card_id');
                clearContent();
                // console.log(card_id);
                generateCardBlock(card_id);
            });
        
        }
    }
}

const clearContent = () => {
    // targets the thumbnail container in preperation for clearing on new search
    let thumbnailContainer = document.getElementById('thumbnail_container');
    let cardBlock = document.getElementById('cardBlock_container');
    let infoContainer = document.getElementById('info_container');

    // if element exists, clear all contents from the parent element 'info_container'
    if (thumbnailContainer != null){
        thumbnailContainer.innerHTML = "";
        // console.log('thumbnail cleared')
    } 
    // if there is card content within the cardBlock, clear it
    if (cardBlock != null) {
        infoContainer.innerHTML = "";
        // document.getElementById('name_container').innerHTML = "";
        // document.getElementById('img_container').innerHTML = "";
        // document.getElementById('text_container').innerHTML = "";
        // console.log('cardBlock cleared');
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
        //   console.log('cards pushed to dupes array')
        }
      }
    });
    return duplicates;
}

const searchCard = () => {
    
    document.getElementById("name_search").addEventListener("click", function () {

        let cardNameValue = document.getElementById("card_name_input").value;
        
        if (cardName.includes(cardNameValue)) {
            clearContent();
            if (duplicatePrints.includes(cardNameValue) == true) {
                generateThumnail();
                clickableThumbnails();
            } else {
                generateCardBlock(cardNameValue);
            } 
        } else if (cardNameValue == ""){
            alert("Please enter a card name into the search bar.")
        } else{
            alert("Please use the dropdown menu you to assist you with your search.")
        }
        
    });
    // Execute a function when the user releases a key on the keyboard
    let nameInput = document.getElementById("card_name_input");
    nameInput.addEventListener("keyup", function (event) {


        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // console.log("enter pressed");
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("name_search").click();
        }
    });
}
// This ensures that whatever is typed 
function toTitleCase(str) 
{
   return str.split(/\s+/).map( s => s.charAt( 0 ).toUpperCase() + s.substring(1).toLowerCase() ).join( " " );
}
////////////////////////// program logic begins here //////////////////////////

cardInfoApi();
searchCard();
// ensures all words in search input are capital case to match incoming cards from API 
$('#card_name_input').on('keyup', function(event) {
    var $t = $(this);
    $t.val( toTitleCase( $t.val() ) );
});

});



