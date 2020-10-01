
//set dark map
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});

// set map
var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: []
});

darkmap.addTo(map);

// set json url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// start the json
d3.json(queryUrl, function(data){
    // create a function that return all thestyle of the maps

    function Maplayers(feature) {
        return {
            opacity: 1,
            fillOpacity: 0.5,
            fillColor: ColorType(feature.properties.mag),
            radius: RadiusSize(feature.properties.mag * 0.85),
            stroke: true,
            weight: 0.1  

        };
    }

        // Assign color to quake based on mag
    function ColorType(magnitude) {
        switch(true) {
        case magnitude > 5:
            return "red";
        case magnitude > 4:
            return "orange";
        case magnitude > 3:
            return "yellow";
        case magnitude > 2:
            return "green";
        case magnitude > 1:
            return "blue";
        default:
            return "gray";
        }
    }

    // create a function to call my readius size
    function RadiusSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;

    }

    // geojson function of data

    L.geoJson(data, {
        // need to make each circle marker
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng)
        },

        // setting the stly of the circle marker
        style: Maplayers,

        // bind pop up
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Location: "+ feature.properties.place + "<br>Magnitude " + feature.properties.mag);

        }

    }).addTo(map);

    // set up the legend
    var legend = L.control({
        position: "bottomright"
    });

    // add legend details
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var mags = [0,1,2,3,4,5]
        var colors = ["gray", "blue", "green", "yellow", "orange", "red"];

        // run colors for length of mags 012345
        for (var x = 0 ; x < mags.length; x++) {
            div.innerHTML +=
                "<x style='background: " + colors[x] + "'></i> " + mags[x] + (mags[x + 1] ? '-' + mags[x + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(map);


});






