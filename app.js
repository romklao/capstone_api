
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
            
            var name = "unknown";
            var rating = "unknown";
            var phone = "unknown";
            var hours = "unknown";
            var website = "unknown";
            var address = "unknown";

            if(item.venue.hours && item.venue.hours.status) {
                hours = item.venue.hours.status;
            }
            if(item.venue.name) {
                name = item.venue.name;
            }
            if(item.venue.rating) {
                rating = item.venue.rating;
            }
            if(item.venue.contact && item.venue.contact.phone) {
                contact = item.venue.contact.phone;
            }
            if(item.venue.url) {
                website = item.venue.url;
            }
            if(item.venue.location && item.venue.location.formattedAddress) {
                address = item.venue.location.formattedAddress[0] + ', ' + 
                          item.venue.location.formattedAddress[1];
            }
            var currentElement =  '<img class="showImage" src="' + imageLink + '">' +
                                    '<div class="showInfo">' +
                                        '<p><span>Name:</span>' + name + '</p>' + 
                                        '<p><span>Rating:</span>' + rating + '</p>' + 
                                        '<p><span>Phone:</span>' + contact + '</p>' +
                                        '<p><span>Status:</span>' + hours + '</p>' +
                                        '<p><span>Website:</span>' + '<a href="' + website + '" target="_blank">' + website + '</a></p>' +
                                        '<p><span>Address:</span>' + address + ' </p>' + 
                                    '</div><hr>' 
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









