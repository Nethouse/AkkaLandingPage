$(function () {

    $('.gmap-marker').each(function (ind, el) {
        var lat = $(el).attr('data-map-lat');
        var lng = $(el).attr('data-map-lng');
        console.log(lat + ':' + lng);
        var map = new GMaps({
            div: $(el).attr('id'),
            lat: lat,
            lng: lng,
            zoom: 16,
            scrollwheel: false
        });

        map.addMarker({
            lat: lat,
            lng: lng,
            title: $(el).attr('data-map-title')
        });
    });
});
