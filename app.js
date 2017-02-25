
var FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v2/venues/explore';
var version = '20170101';
var client_id = 'MY3IL31RJIXONBRRWUZ4W444CAXYRBL2WDJTA4X2RV3WLJBW';
var client_secret = 'FVVETISC243FKU03APPTF5KX53KMEJAHTKUX0IFAHCQVMIDQ';
var map;

function getDataFromApi(location, category, callback) {
    console.log('getdata')
    var settings = {
        url: FOURSQUARE_BASE_URL,
        data: {
            r: 'json',
            near: location,
            query: 'romantic',
            section: category,
            venuePhotos: '1',
            // limit: '10',
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

function initMap() {
// Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        scrollwheel: false,
        zoom: 8
    });
}

function displaySearchData(data) {
    var resultElement = '';
    if(data.response) {
        console.log('data');
        initMap();

        var bounds = new google.maps.LatLngBounds();

        data.response.groups[0].items.forEach(function(item) {
            console.log('getdata', item)
            var photoInfo = item.venue.photos.groups[0].items[0];
            var prefix = photoInfo.prefix;
            var suffix = photoInfo.suffix;
            var size = "180x165";
            var imageLink = prefix + size + suffix;
            
            var currentElement = '<a href="' + item.venue.url + '" target="_blank">' + '<img class="showImage" src="' + imageLink + '">' + '</a>';
                currentElement += '<div class="showInfo">'
            var name = rating = phone = website = address = "unknown";

            if(item.venue.name) {
                currentElement += '<p><span>Name:</span>' + item.venue.name + '</p>'
            }
            if(item.venue.rating) {
                currentElement += '<p><span>Rating:</span>' + item.venue.rating + '</p>'
            }
            if(item.venue.contact && item.venue.contact.phone) {
                currentElement += '<p><span>Phone:</span>' + item.venue.contact.phone + '</p>'
            }
            if(item.venue.hours && item.venue.hours.status) {
                currentElement += '<p><span>Status:</span>' + item.venue.hours.status + '</p>'
            }
            if(item.venue.url) {
                currentElement += '<p><span>Website:</span>' + '<a href="' + item.venue.url + '" target="_blank">' + item.venue.url + '</a></p>'
            }
            if(item.venue.location && item.venue.location.formattedAddress) {
                currentElement += '<p><span>Address:</span>' + item.venue.location.formattedAddress[0] + ', '
                                  + item.venue.location.formattedAddress[1]; + ' </p>'
            }
            currentElement += '</div><hr>'
            resultElement += currentElement

            var myLatLng = {lat: item.venue.location.lat, lng: item.venue.location.lng};
            var infowindow = new google.maps.InfoWindow({
                content: currentElement,
            });
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: item.venue.name
            });

            marker.addListener('click', function() {
              infowindow.open(map, marker);
            });

            bounds.extend(marker.getPosition());                   
            console.log('results');
        
        });
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
    }
    else {
        resultElement += '<p>No results</p>';
    }
    $('#js-place-info').html(resultElement);
}

function searchSubmit() {
    $('#js-search-form').submit(function(event) {
        event.preventDefault();
        var searchLocation = $(this).find('#js-input').val();
        var category = $('form input[type=radio]:checked').val();
        console.log('category', category);
        getDataFromApi(searchLocation, category, displaySearchData);
       
    });
}

$(function() {
    searchSubmit();
    console.log('hi')
});









