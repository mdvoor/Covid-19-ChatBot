//client side js for all data page

let populateTable = (data) => { //populates table with data from server
    let count = 1;
    for (let i of data) {
        $('tbody').append(`<tr id="${i._id}"><td id="td-count">${count}</td><td>${i.question}</td><td>${i.answer}</td></tr>`);
        count++;
    }
}

$.get('/api/covidData', (data) => { populateTable(data) }); //gets data from server

$('tbody').on('click', (e) => { //triggers/populates modal 
    let id = e.target.parentNode.getAttribute('id');
    $('#myModal').show();

    $.post('/api/dbRecord', { id }).done((data) => { //gets specific record data from server
        $('#id').val(data._id);
        $('#question').val(data.question);
        $('#answer').val(data.answer);
    })

    $('#deleteBtn').on('click', () => { //provides option to delete record
        $('#myModal').hide();
        $('#deleteModal').show();
        $('#deleteBtn2').attr('href', `/api/deleteRecord/${id}`); //initializes server route
    })
})

$(window).scroll(function () { //tracks scrolling to allow user to scroll back to top
    if ($(this).scrollTop() > 100) $('.arrBtn').fadeIn();
    else $('.arrBtn').fadeOut();
});

$('.arrBtn').click(function () { //animates scrolling on btn click
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
});

$('.close').on('click', () => { //closes edit modal
    $('#myModal').hide();
    $('#deleteModal').hide()
})

$('.closeDelete').on('click', () => { //closes delete modal
    $('#deleteModal').hide()
})
