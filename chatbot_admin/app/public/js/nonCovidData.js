//client side js for nonCovidData page

let populateTable = (data) => { //populates table with data from server
    let count = 1;
    if (!data.length) {
        $('.covid-head').text('There are no non-Covid questions to view at this time.');
        $('table').hide()
    } else {
        for (let i of data) {
            $('tbody').append(`<tr id="${i._id}"><td id="td-count">${count}</td><td>${i.question}</td><td><a href="/api/deleteNonCovid/${i._id}"<button type="button" class="btn btn-danger" id="deleteBtn">Delete</button></a></td></tr>`);
            count++;
        }
    }
}

$.get('/api/nonCovidData', (data) => { populateTable(data) }); //gets data from server

$(window).scroll(function () { //tracks scrolling to allow user to scroll back to top
    if ($(this).scrollTop() > 100) $('.arrBtn').fadeIn();
    else $('.arrBtn').fadeOut();
});

$('.arrBtn').click(function () { //animates scrolling on btn click
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
});

