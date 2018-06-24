const API_URL = 'http://127.0.0.1:5647';

$(document).ready(function() {
    $.get(API_URL + '/stats/visits_by_year', function(response) {
        var dataPoints = [];
        $.each(response, function(index, item) {
            dataPoints.push({label: item.visited_at, y:item.count});
        });
        var chart = new CanvasJS.Chart('visits-by-year', {
            title: {
                text: "By year"              
            },
            data: [
                {
                    type: "column",
                    dataPoints: dataPoints
                }
            ]
        });
        chart.render();
    });

    $.get(API_URL + '/stats/restaurants_by_cuisine', function(response) {
        var dataPoints = [];
        $.each(response, function(index, item) {
            dataPoints.push({label: item.cuisine, y:item.count});
        });
        var chart = new CanvasJS.Chart('restaurants-by-cuisine', {
            title: {
                text: "By cuisine"
            },
            data: [
                {
                    type: "pie",
                    indexLabel: "{label} {y}",
                    startAngle: 240,
                    dataPoints: dataPoints
                }
            ]
        });
        chart.render();
    });
});
