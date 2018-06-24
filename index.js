function initMap() {
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('load', function () {
        $.getJSON(API_URL + '/restaurants/geojson', function(response) {
            map.addLayer({
                'id': 'restaurants',
                'type': 'circle',
                'source': {
                    'type': 'geojson',
                    'data': response
                },
				'paint': {
					// make circles larger as the user zooms from z12 to z22
					'circle-color': {
						'property': 'rating',
						'stops': [[1, 'black'], [2, 'black'], [3, 'grey'], [4, 'green'], [5, 'red']]
					},
				}
            });

            map.on('mouseenter', 'restaurants', function(e) {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';

                var feature = e.features[0];
                var coordinates = feature.geometry.coordinates.slice();

                var description = '<center>' +
                                    e.features[0].properties.name + 
                                    '<br>' +
                                    e.features[0].properties.cuisine + 
                                    '<br>' +
                                    '<strong style="font-size: 30px">*</strong>'.repeat(e.features[0].properties.rating) +
                                  '</center>';

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map);
            });

            map.on('mouseleave', 'restaurants', function() {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });
        });
    });
}

const API_URL = 'http://127.0.0.1:5647';
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9jYW1ib2xlc3F1ZSIsImEiOiJjamhoczlzOWIwamtlMzhuMWxhZm90eHh2In0.t3JodxTpYHUTHUfT8a3mUQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [2.344,48.8556],
    zoom: 12,
});

$(document).ready(function() {
    initMap();
});
