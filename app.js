'use strict'

var FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v2/venues/explore';
var version = '20170101';
var client_Id = 'MY3IL31RJIXONBRRWUZ4W444CAXYRBL2WDJTA4X2RV3WLJBW';
var client_Secret = 'FVVETISC243FKU03APPTF5KX53KMEJAHTKUX0IFAHCQVMIDQ';
var map;

function getDataFromApi(location, category, callback) {
    var settings = {
        url: FOURSQUARE_BASE_URL,
        data: {
            r: 'json',
            near: location,
            query: 'romantic',
            section: category,
            venuePhotos: '1',
            radius: '10000',
            v: version,
            client_id: client_Id,
            client_secret: client_Secret
        },
        dataType: 'JSONP',
        type: 'GET',
        success: callback
    };
    $.ajax(settings);
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
    var currentElement;
    if(data.response) {
        initMap();
        var bounds = new google.maps.LatLngBounds();

        data.response.groups[0].items.forEach(function(item) {
            if (item.venue.photos.groups[0]) {
                var photoInfo = item.venue.photos.groups[0].items[0];
                var prefix = photoInfo.prefix;
                var suffix = photoInfo.suffix;
                var size = "210x190";
                var imageLink = prefix + size + suffix;
            }
            else {
                return 
            }
            currentElement = '<div class="imageAndInfo">'
            currentElement += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 containerImage">' + 
                                    '<a href="' + item.venue.url + '" target="_blank">' + '<img class="showImage" src="' + imageLink + '">' +
                                    '<div class="middle">' +
                                        '<div class="text">Visit Website</div>' +
                                    '</div>' + '</a>' +
                              '</div>'
            currentElement += '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 showInfo">'
            
            if(item.venue.name) {
                currentElement += '<p class="name"><a id="linkName" href="' + item.venue.url + '" target="_blank">' +
                                   item.venue.name + '</a></p>'
            }
            if(item.venue.price && item.venue.price.tier) {
                currentElement += '<span class="priceToolTip" data-toggle="tooltip" data-placement="bottom" title="' + item.venue.price.message + '">'

                var tier = item.venue.price.tier
                    for(var i = 0; i < tier; i++) {
                        currentElement += '<span class="glyphicon glyphicon-usd"></span>'
                    }
                    currentElement += ' &bull; '
                currentElement += '</span>'
            }            
            if(item.venue.hours && item.venue.hours.status) {
                currentElement += '<span>' + item.venue.hours.status + '</span>'

            }
            if(item.venue.location && item.venue.location.formattedAddress) {
                currentElement += '<p>' + item.venue.location.formattedAddress[0] + ', ' 
                                  + item.venue.location.formattedAddress[1] + '</p>'
                if(item.venue.contact && item.venue.contact.phone) {
                    currentElement += '<p><i class="material-icons">phone</i>' + item.venue.contact.phone + '</p>'
                }
            }
            if(item.venue.rating) {
                currentElement += '<input name="input-3" value="'+ item.venue.rating/2 + '" class="rating-loading">' 
            }
            currentElement += '</div>'
            currentElement += '</div>'
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
              $('.rating-loading').rating({displayOnly: true, step: 0.5});
              $('.priceToolTip').tooltip();
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
    $('.rating-loading').rating({displayOnly: true, step: 0.5});
    $('.priceToolTip').tooltip();
}

function searchSubmit() {
    $('#js-search-form').submit(function(event) {
        event.preventDefault();
        var jsInput = $('#js-input');

        if (!jsInput.val()) {
            $('.mapWrap').removeClass('mapWrapShown');
            $('.information').hide();
            swal({
                title: "Please enter a city",
                confirmButtonColor: "#f48be3",
            });
        } else {
            var searchLocation = jsInput.val();
            var category = $('form input[type=radio]:checked').val();

            getDataFromApi(searchLocation, category, function(data) {
                if (data && data.response.groups) {
                    $('.information').show();
                    $('.mapWrap').addClass('mapWrapShown');
                    displaySearchData(data);
                } else {
                    $('.mapWrap').removeClass('mapWrapShown');
                    $('.information').hide();
                    swal({
                        title: "No results",
                        confirmButtonColor: "#f48be3",
                    });
                }
            });
            jsInput.val('');
        }
    });
}

$(function() {
    searchSubmit();
});









