'use strict';
let inputBox = document.getElementById("myQuestion");
let questionLst = [];
let answerLst = [];
let currentFocus = null;

let createMsgBot = (msg) => {//creates html elements to render bot messages
  let msgContent = `<li class="chatbot-msg"><div class="chatbot-avatar"><img src="./images/bot.png" alt="chat bot"></div><div class="chatbot-paragraph">${msg}</div></li>`;
  $('#chatbot-messages-container').append(msgContent);
}
let createMsgUsr = (msg) => {//creates html elements to render user responses
  let msgContent = `<li id='chat-user-msg' class="chat-user-msg"><div class="chatbot-avatar"><img src="./images/client.png" alt="client avatar"></div><div class="chatbot-paragraph">${msg}</div></li>`;
  $('#chatbot-messages-container').append(msgContent);
}
let bottomScroll = () => { //automatically scrolls to the bottom of the message window
  $('.chatbot-board-inner').animate({ scrollTop: $('.chatbot-messages-wrapper').prop("scrollHeight") }, 'slow').parent().find('.slimScrollBar').css({ 'top': $('.chatbot-board-inner').height() + 'px' });
}
$('#chatbot-chat-container').on('click', () => {//triggers dialog box board 
  $('.bot-wrapper').show();
  $('.chatbot-board-inner').slimScroll({//enables slimscroll
    height: '100hv',
    start: 'bottom'
  })
  createMsgBot(`<p class='travis'><strong>Travis</strong> has joined the conversation</p>`);
  createMsgBot(`Hi There! I am <strong>Travis</strong>, your digital helper. 
  I was designed to provide info about the novel <strong>Covid-19 virus</strong>, also known as the
  Corona virus. <br> Is there anything I can answer for you today?`);
  $('#chatbot-chat-container').hide();
})
$('#close-div').on('click', () => {//closes dialog box board
  $('#chatbot-messages-container').html('');//resets chatboard when closed
  $('#chatbot-chat-container').show();
  $('.bot-wrapper').hide();
  inputBox.value = '';//clears search box
})

let autocomplete = (txtInp, qtnLst, ansrLst) => {//suggests questions based on user input
  txtInp.addEventListener("input", function (e) {
    let val = this.value;//value of search box
    closeAllLists();
    currentFocus = -1;//-1 is the input box numbers increase as user scrolls down
    let listDiv = document.createElement("div");//builds suggestion list
    listDiv.setAttribute("id", this.id + "autocomplete-list");
    listDiv.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(listDiv);
    let srt = sortMatches(qtnLst, ansrLst, val);//returns an array of possible matches [4,3,2,1,0,0] etc for each index
    let matches = srt[1]; //returns all matches from json file in array form

    for (let i = 0; i < qtnLst.length; i++) {//MAIN LOOP loops thru all questions and removes extra characters
      let question = qtnLst[i];
      let qTxt = "";
      let usrInp = val;
      let lowerTxt = "";
      let max = 1;//will only allow 1 suggestion to appear
      for (let letter in question) {
        qTxt += question[letter];//loops through each letter of the question to build qTxt
      }
      qTxt = qTxt.replace(/,/g, ", ");//filters spaces
      qTxt = qTxt.replace(/ +/g, " ");//adds space to end of each word
      let qWords = qTxt.split(" ");
      let qWords2 = qTxt.split(" ");

      for (let idx = 0; idx < usrInp.length; idx++) { //forces letters to be lowercase
        if (usrInp[idx] != "?" & usrInp[idx] != ".") {
          lowerTxt += usrInp[idx].toLowerCase();
        }
      }
      let editedTxt = lowerTxt.replace(/,/g, " ");//filters spaces
      editedTxt = editedTxt.replace(/ +/g, " ");
      let editedWords = editedTxt.split(" ");

      if (matches[i] > 0 & i < max) {  //matches[i] = values from sorting
        let itemDiv = document.createElement("div");  //Make div element for each match
        for (let j = 0; j < qWords.length; j++) { // make matching words bold 
          if (editedWords.indexOf(qWords[j].toLowerCase()) > -1) {
            if (j < qWords.length - 1) {
              if (qWords2[j].indexOf(",") == -1) {
                itemDiv.innerHTML += "<strong>" + qWords2[j] + " </strong>";
              } else itemDiv.innerHTML += "<strong>" + qWords2[j].substring(0, qWords2[j].length - 1) + "</strong>, ";
            } else {
              itemDiv.innerHTML += "<strong>" + qWords2[j] + "</strong>?";
            }
          } else if (j < qWords.length - 1) {
            itemDiv.innerHTML += qWords2[j] + " ";
          } else {
            itemDiv.innerHTML += qWords2[j] + "";//this was the ? that was doubling
          }
        }
        itemDiv.innerHTML += "<input type='hidden' value='" + qtnLst[i] + "'>"; //holds current array's value
        itemDiv.addEventListener("click", function (e) {
          txtInp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
          getAnswer();
          txtInp.value = '';
        });
        listDiv.appendChild(itemDiv);
      }
    } //end of MAIN LOOP
  });
  txtInp.addEventListener("keydown", function (e) {//allows user to scroll thru list
    let listDiv = document.getElementById(this.id + "autocomplete-list");
    if (listDiv) listDiv = listDiv.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(listDiv, currentFocus);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(listDiv, currentFocus);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (listDiv) listDiv[currentFocus].click();
      } else {
        closeAllLists();
        if (inputBox.value) {
          getAnswer(13)
        } else return;
      }
    }
  });
}// End of AUTOCOMPLETE FUNCTION

//******************************************************
function closeAllLists() {//close autocomplete lists
  let autoLst = document.getElementsByClassName("autocomplete-items");
  for (let i = 0; i < autoLst.length; i++) autoLst[i].parentNode.removeChild(autoLst[i]);
}

//==========  FUNCTIONS AUTOCOMPLETE NEEDS =============
function sortMatches(questionLst, lst2, val) {
  let matchCount = 0;
  let matches = [];
  let srt = [];
  for (let i = 0; i < questionLst.length; i++) {  //loop through all the possible questions 
    matches[i] = 0;//Count number of matches 
    let question = questionLst[i];
    let editedQ = question.replace(/\?/g, ""); //remove ?
    editedQ = editedQ.replace(/,/g, " "); //replace commas with space.
    editedQ = editedQ.replace(/ +/g, " "); //remove double spaces
    let questionWords = editedQ.split(" "); //converts all saved question into an array of words
    let editedVal = val.replace(/\?|\./g, " "); // replace ? & . Need \ before special characters
    editedVal = editedVal.replace(/,/g, " "); // replace commas
    editedVal = editedVal.replace(/ +/g, " "); //remove double spaces
    if (editedVal[editedVal.length - 1] == " " & i == 0) { editedVal = editedVal.slice(0, -1); } //if last is space remove it
    let valArr = editedVal.split(" ");
    for (let j = 0; j < valArr.length; j++) {//loops thru each word in the input sentence
      for (let k = 0; k < questionWords.length; k++) {
        if (valArr[j].toUpperCase() == questionWords[k].toUpperCase()) {
          matches[i]++;
          break;
        }
      }
    }
  } //end of i loop
  //Sort according to matches
  for (let j = 0; j < questionLst.length - 1; j++) {//loop through all question words
    for (let i = 0; i < questionLst.length - 1; i++) {  //loop through words user entered
      if (matches[i] > matchCount) { matchCount = matches[i]; }
      if (matches[i] < matches[i + 1]) {
        let questionLstT = questionLst[i];
        questionLst[i] = questionLst[i + 1];
        questionLst[i + 1] = questionLstT; //switch questions
        let lst2T = lst2[i];
        lst2[i] = lst2[i + 1];
        lst2[i + 1] = lst2T;   //switch answers
        let matchesT = matches[i];
        matches[i] = matches[i + 1];
        matches[i + 1] = matchesT; //switch matches
      }
    }
  }
  srt[0] = matchCount;
  srt[1] = matches;
  return srt;
}//end of sortMatches

//****************************************************************
let lowerArray = () => { //make Question Array all lower case
  let lowerQuestions = [];
  for (let i = 0; i < questionLst.length; i++) {
    lowerQuestions[i] = questionLst[i].toLowerCase();
  }
  return lowerQuestions;
}

let filterQuestion = (tempValue, mark) => { //pass value when not using Question input, mark true to add Question mark
  let canChange = false;
  if (tempValue == undefined || tempValue == null) {
    tempValue = inputBox.value;
    canChange = true;
  }
  let value = ""
  tempValue = tempValue.replace(/ +/g, " "); //replace double spaces with single spaces
  if (tempValue.length == 0) {
    return value;
  }
  for (let i = 0; i < tempValue.length; i++) {
    if (tempValue[i] != "." & tempValue[i] != ":" & tempValue[i] != ";") {
      value = value + tempValue[i];
    }
  }
  if (value[value.length - 1] != "?" & mark != false) {//ass question mark to the end of suggested question
    value = value + "?";
  }
  value = value.replace(/ \?/g, "?"); //handle blank space at end of question
  if (value.length > 0) {
    value = value[0].toUpperCase() + value.substring(1, value.length); //make sure 1st letter of question is capitalized
  }
  if (canChange & value.length > 5) {
    inputBox.value = value;
  } //change question asked to match filter
  return value;
}

let filterAllQuestions = () => {
  for (let i = 0; i < questionLst.length; i++) {
    questionLst[i] = filterQuestion(questionLst[i]);
  }
}
$('#ask-btn').on('click', () => {
  if (inputBox.value) {
    getAnswer(13);
  } else return;

});

function getAnswer(key) {
  if (key === 13) {
    createMsgUsr(inputBox.value)
    createMsgBot(`<div class="suggestDiv"><p>Was this what you were looking for?</p>
                      <p><strong>${questionLst[0]}</strong></p>
                     <div class='btnDiv'> <button class="q-btn">yes</button><button class="q-btn">no</button></div></div>`);
    bottomScroll();
    let newQuestion = inputBox.value;
    inputBox.value = '';
    $('.q-btn').click(function () {
      $('.btnDiv').remove(); //removes the suggested question buttons
      if (this.innerHTML === 'yes') {
        createMsgUsr(`<b>${questionLst[0]}</b>`);
        createMsgBot(`${answerLst[0]}<p><b>Is there anything more you would like to know?</b></p>`);
      } else {
        createMsgUsr(`No`);
        let question = {
          "question": newQuestion
        }
        $.post('/api/saveNewQuestion', question).done((data) => {
          if (data) {
            createMsgBot(`<p><b>I am unsure of what you are asking.</b><br>Your question has been sent to a professional for answering.<br>This link may be helpful:</p><a href='${data}' target='_blank'>${question.question}</a><p><b>Is there anything more you would like to know?</b></p>`);
            bottomScroll();
          } else {
            createMsgBot('<p><b>I am unsure of what you are asking.</b><br>Your question has been sent to a professional for answering.<br>Please allow me more time to gather information</p><p><b>Is there anything more you would like to know?</b></p>')
            bottomScroll();
          }
        })
      }
      bottomScroll();
    })
    inputBox.value = '';
    return;
  }
  let onQuestion = findQuestionIndex(); //returns an index number of the answer
  if (onQuestion > -1) {
    if (answerLst[onQuestion] == undefined || answerLst[onQuestion] == null) {//if answer is undefined or null return ''
      answerLst[onQuestion] = "";
    }
    createMsgUsr(`<b>${questionLst[onQuestion]}</b>`)
    createMsgBot(`${answerLst[onQuestion]} <p><b>Is there anything more you would like to know?</b></p>`)
    bottomScroll();
    return;
  } else {
    onQuestion = questionLst.length;
    filterAllQuestions(); //double check to make sure questions asked match new question format
    getAnswer();
  }
}//end of getAnswer FUNCTION

function findQuestionIndex() { //look for index of question
  let question = inputBox.value;
  question = filterQuestion(question);
  let inputLower = question.toLowerCase();
  let lowerQuestions = lowerArray(questionLst);
  let index = lowerQuestions.indexOf(inputLower);
  return index;
}
function addActive(autoList, currentFocus) {
  if (currentFocus >= autoList.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = (autoList.length - 1);
  autoList[currentFocus].classList.add("autocomplete-active");
  return currentFocus;
}
function removeActive(divList) {
  for (let i = 0; i < divList.length; i++) {
    divList[i].classList.remove("autocomplete-active");
  }
}
document.addEventListener("click", (e) => { //closes list when page is clicked
  closeAllLists(e.target);
});

/**************************************
        Support Nav Tabs
***************************************/
$('#data-chat').on('click', (e) => {
  e.preventDefault();
  createMsgBot(`<b>Is there anything in specific you would like to know about the Covid-19 virus?</b>`);
  bottomScroll();
})
$('#data-help').on('click', (e) => {
  e.preventDefault();
  createMsgBot(`<b>Welcome to the HELP section!</b>
    <p>Simply type your question below and hit ENTER, or click on the find icon to the right of the searchbar.</p>`);
  bottomScroll();
})
$('#data-support').on('click', (e) => {
  e.preventDefault();
  createMsgBot(`<b>Welcome to the FAQ section</b><p>Below are associated links for more information on covid-19:</p>
    <a href='https://www.who.int/emergencies/diseases/novel-coronavirus-2019'>World Health Organization</a><br>
    <a href='https://www.nhs.uk/conditions/coronavirus-covid-19/'>National Health Service</a><br>
    <a href='https://www.cdc.gov/coronavirus/2019-ncov/index.html'> Centers for Disease Control and Prevention</a><br>`);
  bottomScroll();
})
//***********************************************
let loadQuestions = () => {//loads question and answer dataset onload
  let dataSet = null;
  $.get('/api/dataSet', (data) => {
    dataSet = data;
    $(document).trigger('dataLoaded');//waits for data to fully load before continuing
  })
  $(document).on('dataLoaded', () => {
    if (dataSet) {
      for (let i in dataSet) {//populates question and answer arrays for autofill
        questionLst.push(dataSet[i]['question']);
        answerLst.push(dataSet[i]["answer"]);
      }
    }
  });
}
let onLoad = () => {//Runs Script When Page Finishes Loading
  loadQuestions();
  autocomplete(inputBox, questionLst, answerLst);
}

