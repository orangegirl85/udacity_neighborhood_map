var initialLocations = [
        {
            name : 'San Marzzano',
            address : 'Bulevardul Cetatii 79, Timisoara 300254'
        },
        {
            name : 'L\'Osterietta',
            address : 'Str Miresei nr 1, Timisoara 300254'
        },
        {
            name : 'Pizzeria Giovanna',
            address : 'Strada Bucovina nr 43, Timișoara 300665'
        },
        {
            name : 'Viviani',
            address : 'Strada Teiului nr 3A 300658 Timisoara'

        },
        {
            name : 'Codrina',
            address : 'Str Burebista nr 10, Timisoara 300677'
        }
    ];

var Location = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);

    // this.title = ko.computed(function(){
    //     var title;
    //     var clicks = this.clickCount();
    //     if (clicks < 10) {
    //         title = 'Newborn';
    //     } else if (clicks < 50) {
    //         title = 'Infant';
    //     }
    //
    //     return title;
    // }, this);
};


var ViewModel = function() {
    var self = this;

    this.locationsList = ko.observableArray([]);
    initialLocations.forEach(function(locationItem){
        self.locationsList.push(new Location(locationItem));
    });
    this.currentLocation = ko.observable(this.locationsList()[0]);
    //
    //
    // this.incrementCounter = function() {
    //     self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    // };
    //
    this.setLocation = function(clickedLocation) {
        self.currentLocation(clickedLocation);
    }
};

ko.applyBindings(new ViewModel());
