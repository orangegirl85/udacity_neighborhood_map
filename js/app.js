var initialLocations = [
        {
            name : 'San Marzzano',
            address : 'Bulevardul Cetatii 79, Timisoara 300254'
        },
        {
            name : 'L\'Osterietta',
            address : 'Str Miresei 1, Timisoara 300254'
        },
        {
            name : 'Pizzeria Giovanna',
            address : 'Strada Bucovinei 43, Timișoara 300665'
        },
        {
            name : 'Viviani',
            address : 'Strada Teiului 3A, Timisoara 300658'

        },
        {
            name : 'Codrina',
            address : 'Strada Burebista 10, Timisoara 300677'
        }
    ];

var map;

function initMap(locationList) {
    var myPlace = {lat: 45.7674959, lng: 21.2171965};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: myPlace
    });


    var geocoder = new google.maps.Geocoder();

    function codeAddress(location) {

        geocoder.geocode( { 'address' : location.address() }, function( results, status ) {
            if( status == google.maps.GeocoderStatus.OK ) {
                location.marker = new google.maps.Marker( {
                    position: results[0].geometry.location,
                    map     : map
                } );

                addInfoWindow(location, map);

            } else {
                alert( 'Geocode was not successful for the following reason: ' + status );
            }
        } );
    }
    locationList().forEach(function(locationItem){
        codeAddress(locationItem);
    });
}


function addInfoWindow(location, map) {
    var infowindow = _setInfoWindow(location);
    location.marker.addListener('click', function() {
        infowindow.open(map, location.marker);
    });
}

function addInfoWindow1(location, map) {
    var infowindow = _setInfoWindow(location);
    infowindow.open(map, location.marker);

}

function _setInfoWindow(location) {
    var contentString = '<div class="content-marker">'+
        '<h1>'+ location.name() +'</h1>'+
        '<p>'+ location.address() +'</p>'+
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    return infowindow;
}

var Location = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
};


var ViewModel = function() {
    var self = this;

    this.locationsList = ko.observableArray([]);
    initialLocations.forEach(function(locationItem){
        self.locationsList.push(new Location(locationItem));
    });
    this.openInfoWindow = function(clickedLocation) {
        addInfoWindow1(clickedLocation, map);
    };

    initMap(this.locationsList);


    this.filter = ko.observable("");

    var stringStartsWith = function (string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    };

    this.filteredItems = ko.dependentObservable(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            self.locationsList().forEach(function (item) {
                if ( item.marker ) {
                    item.marker.setVisible(true);
                }
            });
            return self.locationsList();
        } else {
            return ko.utils.arrayFilter(self.locationsList(), function(item) {
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

ko.applyBindings(new ViewModel());
