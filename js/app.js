var initialLocations = [
    {
        name: 'San Marzzano',
        address: 'Bulevardul Cetatii 79, Timisoara 300254',
        foursquareId: '4c8e253ed2aea0937da9cb69'
    },
    {
        name: 'L\'Osterietta',
        address: 'Str Miresei 1, Timisoara 300254',
        foursquareId: '4c3cc4907d00d13a655f3950'
    },
    {
        name: 'Pizzeria Giovanna',
        address: 'Strada Bucovinei 43, Timișoara 300665',
        foursquareId: '4c7d00af9efda1433d2c87e2'
    },
    {
        name: 'Viviani',
        address: 'Strada Teiului 3A, Timisoara 300658',
        foursquareId: '51377968e4b07b01af962f6c'

    },
    {
        name: 'Codrina',
        address: 'Strada Burebista 10, Timisoara 300677',
        foursquareId: '4be04d07652b0f4784dd7111'
    }
];


var map, geocoder, infowindow;
function initMap() {
    var myPlace = {lat: 45.7674959, lng: 21.2171965};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: myPlace
    });

    geocoder = new google.maps.Geocoder();

    infowindow = new google.maps.InfoWindow({
        content: ''
    });

    ko.applyBindings(new ViewModel());
}

function codeAddress(location) {

    geocoder.geocode({'address': location.address()}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            location.marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                animation: google.maps.Animation.DROP
            });
            var openInfoFromMap = true;
            getFoursquareData(location, openInfoFromMap);

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function googleApiError() {
    alert('Google Maps API Error');
}


function addInfoWindow(location, tips) {
    var infowindow = _setInfoWindow(location, tips);
    location.marker.addListener('click', function () {
        infowindow.open(map, location.marker);
        location.bounceOnce();
    });
}

function addInfoWindow1(location, tips) {
    var infowindow = _setInfoWindow(location, tips);
    infowindow.open(map, location.marker);
    location.bounceOnce();
}


function _setInfoWindow(location, tips) {
    var contentString = '<div class="content-marker">' +
        '<h1>' + location.name() + '</h1>' +
        '<p>' + location.address() + '</p><ul>';
    tips.forEach(function (tip) {
        contentString += "<li>" + tip + "</li>";
    });

    contentString += '</ul></div>';

    infowindow.setContent(contentString);

    return infowindow;
}

var Location = function (data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.foursquareId = ko.observable(data.foursquareId);
};

Location.prototype.bounceOnce = function () {
    var marker = this.marker;
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
        marker.setAnimation(null);
    }, 700);
};

function getFoursquareData(location, openInfoFromMap) {
    var oauth_token = 'FSHZRS24QF5WBOSI40TZYLKKXZYUFZXEFPJXRINNJAH25U3N';

    $.ajax({
            url: "https://api.foursquare.com/v2/venues/" + location.foursquareId() + "/tips?oauth_token=" + oauth_token + "&v=20161106"
        })
        .done(function (data) {
            var tips = [];
            var items = data.response.tips.items;
            if (items.length) {
                items.forEach(function (item) {
                    tips.push(item.text);
                });
            } else {
                tips.push("No tips! :(");
            }
            if (openInfoFromMap) {
                addInfoWindow(location, tips);
            } else {
                addInfoWindow1(location, tips);
            }
        })
        .fail(function () {
            alert('There was an error with the Foursquare api!');
        });
}


var ViewModel = function () {
    var self = this;

    self.locationsList = ko.observableArray([]);
    initialLocations.forEach(function (locationItem) {
        self.locationsList.push(new Location(locationItem));
    });
    self.openInfoWindow = function (clickedLocation) {
        var openInfoFromMap = false;
        getFoursquareData(clickedLocation, openInfoFromMap);
    };

    self.locationsList().forEach(function (locationItem) {
        codeAddress(locationItem);
    });

    self.filter = ko.observable("");

    var stringStartsWith = function (string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    };

    self.filteredItems = ko.dependentObservable(function () {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            self.locationsList().forEach(function (item) {
                if (item.marker) {
                    item.marker.setVisible(true);
                }
            });
            return self.locationsList();
        } else {
            return ko.utils.arrayFilter(self.locationsList(), function (item) {
                if (stringStartsWith(item.name().toLowerCase(), filter)) {
                    item.marker.setVisible(true);
                    return true;
                } else {
                    item.marker.setVisible(false);
                    return false;
                }
            });
        }
    });
};



