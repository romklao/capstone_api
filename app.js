
var FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v2/venues/explore';
var version = '20170101';
var client_id = 'MY3IL31RJIXONBRRWUZ4W444CAXYRBL2WDJTA4X2RV3WLJBW';
var client_secret = 'FVVETISC243FKU03APPTF5KX53KMEJAHTKUX0IFAHCQVMIDQ';
// var google_api_key = 'AIzaSyAqAzetfWusypCLeR3E5Wg5njcfp7a_e8w';


function initMap() {
// Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      scrollwheel: false,
      zoom: 8
    });
}

function getDataFromApi(city, callback) {
    var settings = {
        url: FOURSQUARE_BASE_URL,
        data: {
            r: 'json',
            near: city,
            query: 'romantic',
            // venuePhotos: '1',
            limit: '10',
            radius: '10000',
            v: version,
            client_id: client_id,
            client_secret: client_secret
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
        data.response.groups[0].items.forEach(function(item) {
            console.log('getdata')
            resultElement += '<p>' + item.venue.name + '</p>' + 

                            '<p>' + item.venue.location.address + ',' + item.venue.location.city + '</p>' + '<hr>';
            console.log('results');
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
    initMap();
    console.log('hi')
});









