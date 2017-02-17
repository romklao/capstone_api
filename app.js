
var FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v2/venues/explore';
var version = '20170101';
var CLIENT_ID = 'MY3IL31RJIXONBRRWUZ4W444CAXYRBL2WDJTA4X2RV3WLJBW';
var CLIENT_SECRET = 'FVVETISC243FKU03APPTF5KX53KMEJAHTKUX0IFAHCQVMIDQ';

function getDataFromApi(searchTerm, callback) {
    var settings = {
        url: FOURSQUARE_BASE_URL,
        data: {
            s: searchTerm,
            r: 'json',
            query: 'romantic',
            venuePhotos: '1',
            limit: '10',
            v: version,
            CLIENT_ID: CLIENT_ID,
            CLIENT_SECRET: CLIENT_SECRET
        },
        dataType: 'JSONP',
        type: 'GET',
        success: callback
    };
    $.ajax(settings);
    console.log('settings');
}

function displaySearchData(data) {
    var resultElement = '';
    if(data.response) {
        console.log('data');
        data.response.groups.forEach(function(item) {
            console.log('getdata')
            resultElement += '<p>' + item.venue.name + '</p>' + 
                            '<p>' + item.venue.location + '</p>';
        });
    }
    else {
        resultElement += '<p>No results</p>';
    }
    $('.js-place-info').html(resultElement);
}

function searchSubmit() {
    $('.js-search-form').submit(function(event) {
        event.preventDefault();
        var searchLocation = $(this).find('.js-input').val();
        getDataFromApi(searchLocation, displaySearchData);
    });
}

$(function() {
    searchSubmit();
    console.log('hi')
});









