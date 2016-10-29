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

function initMap() {
    var myPlace = {lat: 45.7674959, lng: 21.2171965};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: myPlace
    });
    var marker = new google.maps.Marker({
        position: myPlace,
        map: map
    });


    var geocoder = new google.maps.Geocoder();

    function codeAddress(address) {

        geocoder.geocode( { 'address' : address }, function( results, status ) {
            if( status == google.maps.GeocoderStatus.OK ) {
                var marker = new google.maps.Marker( {
                    position: results[0].geometry.location,
                    map     : map
                } );
            } else {
                alert( 'Geocode was not successful for the following reason: ' + status );
            }
        } );
    }
    initialLocations.forEach(function(locationItem){
        codeAddress(locationItem.address);
    });
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
    this.currentLocation = ko.observable(this.locationsList()[0]);
    
    this.setLocation = function(clickedLocation) {
        self.currentLocation(clickedLocation);
    }
};

ko.applyBindings(new ViewModel());
