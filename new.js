const API_URL = 'http://127.0.0.1:5647';

$(document).ready(function() {
    var address_suggestions = {};
    $('#address').on('keyup', function() {
        $.getJSON('https://api-adresse.data.gouv.fr/search/', {q: $(this).val(), type: ''}, function(response) {
            address_suggestions = {};
            var suggestions = $('#address_suggestions');
            suggestions.empty();
            suggestions.append($('<option>---select an address---</option>'));
            $.each(response.features, function(index, item) {
                address_suggestions[item.properties.id] = item;
                suggestions.append($('<option value="' + item.properties.id + '">' + item.properties.label + '</option>'));
            });
        });
    });

    $('#address_suggestions').on('change', function() {
        var optionSelected = $("option:selected", this);
        var address = address_suggestions[optionSelected[0].value];
        $('#address').val(address.properties.name);
        $('#zip').val(address.properties.postcode);
        $('#city').val(address.properties.city);
        $('#lat').val(address.geometry.coordinates[1]);
        $('#lng').val(address.geometry.coordinates[0]);
    });

    $('form').on('submit', function(e) {
        e.preventDefault();

        data = {};
        coordinates = {};
        $.each($(this).serializeArray(), function(index, field) {
            data[field.name] = field.value;
        });

        $('.alert').remove();

        $.ajax({
            type: 'POST',
            url: API_URL + '/restaurants',
            data: JSON.stringify(data),
            success: function(response) {
                $('body').append(
                    $('<div class="alert alert-success alert-dismissible fade show" style="width:50%;left:20%">success ' + response.data.name + '</div>')
                );
            },
            error: function(response) {
                if (response.status == 400) {
                    $('body').append(
                        $('<div class="alert alert-danger alert-dismissible fade show" style="width:50%;left:20%">error</div>')
                    );
                } else {
                    alert('Unknown error')
                }
            },
            dataType: 'json'
        });
    });
});
