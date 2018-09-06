window.initGoogleMaps = function () {

  $('.google-map-canvas').each(function () {

    var id = $(this).data('map-id');
    var markers = JSON.parse($(this).data('markers').replace('"', '\\"').replace('&quot;', '\\"').replace(new RegExp('\'', 'g'), '"').replace(new RegExp('\n', 'g'), ''));
    var mapMarkers = [];
    var mapNodeProxy = $(this);

    var map = new google.maps.Map($(this).get(0), {
      center: {
        lat: 0,
        lng: 0
      },
      zoom: 10,
      mapTypeId: google.maps.MapTypeId[$(this).data('type')],
      draggable: $(this).data('draggable'),
      scrollwheel: $(this).data('scrollwheel'),
      mapTypeControl: $(this).data('map-type-control'),
      zoomControl: $(this).data('zoom-control'),
      streetViewControl: $(this).data('street-view-control')
    });

    var infowindow = new google.maps.InfoWindow({
      maxWidth: 250
    });

    $.each(markers.markers, function (index, markerData) {

      var marker = new google.maps.Marker({
        map: map,
        draggable: false,
        position: {
          lat: parseFloat(markerData.lat),
          lng: parseFloat(markerData.lng)
        },
        title: (markerData.title ? markerData.title : '')
      });

      mapMarkers.push(marker);

      if (markerData.title != '' || markerData.text != '') {

        google.maps.event.addListener(marker, 'click', function () {

          var content;
          if (markerData.title != '') {
            content = '<h6>' + markerData.title + '</h6>';
          }

          if (markerData.text != '') {
            content += '<p>' + markerData.text + '</p>';
          }

          infowindow.setContent(content);
          infowindow.open(map, this);

        });

      }

      if ($(mapNodeProxy).data('fit-bounds') == 1) {

        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < mapMarkers.length; i++) {
          bounds.extend(mapMarkers[i].getPosition());
        }

        if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
          bounds.extend(new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01));
          bounds.extend(new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01));
        }

        map.fitBounds(bounds);

      }

    });

    if ($(this).data('fit-bounds') == 0) {
      map.setCenter({
        lat: $(this).data('lat'),
        lng: $(this).data('lng')
      });

      map.setZoom($(this).data('zoom'));
    }

    if (map.getTilt()) {
      map.setTilt($(this).data('tilt'));
    }

  });

}

$(function() {
  initGoogleMaps();
})