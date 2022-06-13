//client side js for new questions form

let listenForData = () => { //listens for change in new questions DB
    let dataListen = setInterval(() => {
        $.get('/api/newQuestionsData', (data) => {
            if (data.length) {
                $('.formHeading').text("Please Fill Out The Fields Below.");
                $('#question, #answer, #relevant, .submitBtn').removeAttr('disabled');
                populateQ(data);
                clearInterval(dataListen);
            }
        });
    }, 1000);
}

let disableForm = () => { //disables form when new questions do not exist
    $('.formHeading').text("There are no new questions to answer.");
    $('#question, #answer, #relevant, .submitBtn').attr('disabled', 'true');
    listenForData();
}

let populateQ = (data) => { //populates form with data from server
    console.log(data)
    if (data.length) for (let i of data) { $('#question').append(`<option value="${i._id}">${i.question}</option>`) }
    else disableForm();
}

$.get('/api/newQuestionsData', (data) => { //retrieves new questions data from DB
    console.log(data)
    populateQ(data)
});

$('select').on('click', () => { //disables
    if ($('#relevant').val() == 'false') $('#answer').attr('disabled', 'true');
    else $('#answer').removeAttr('disabled');
})


