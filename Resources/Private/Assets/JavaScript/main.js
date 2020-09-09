window.initGoogleMaps = function () {

  $('.google-map-canvas').each(function () {

    var id = $(this).data('map-id');

    var markers = JSON.parse($(this).data('markers').replace(new RegExp('\'', 'g'), '"').replace(new RegExp('\n', 'g'), ''));

    var mapMarkers = new Array();

    var map = new google.maps.Map($(this).get(0), {
      center: { lat: 0, lng: 0 },
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

    $.each(markers.markers, function (index, value) {

      for (var key in markers.markers[index]) {

        geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': markers.markers[index][key][0].street + ', ' + markers.markers[index][key][0].zip + ', ' + markers.markers[index][key][0].city + ', ' + markers.markers[index][key][0].country }, function (results, status) {

          if (status == google.maps.GeocoderStatus.OK) {

            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });

            mapMarkers.push(marker);

            if (markers.markers[index][key][0].title != '' || markers.markers[index][key][0].text != '') {

              google.maps.event.addListener(marker, 'click', function () {

                var content;

                if (markers.markers[index][key][0].title != '') {

                  content = '<h6>' + markers.markers[index][key][0].title + '</h6>';

                }

                if (markers.markers[index][key][0].text != '') {

                  content += '<p>' + markers.markers[index][key][0].text + '</p>';

                }

                infowindow.setContent(content);
                infowindow.open(map, this);

              });

            }

          }

          if ($('.google-map-canvas[data-map-id=' + id + ']').data('fit-bounds') == 1) {

            var bounds = new google.maps.LatLngBounds();

            for (var i = 0; i < mapMarkers.length; i++) {

              bounds.extend(mapMarkers[i].getPosition());

            }

            if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
              var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
              var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
              bounds.extend(extendPoint1);
              bounds.extend(extendPoint2);
            }

            map.fitBounds(bounds);

          }

        });

      }

    });

    if ($(this).data('fit-bounds') == 0) {

      map.setCenter({ lat: $(this).data('lat'), lng: $(this).data('lng') });
      map.setZoom($(this).data('zoom'));

    }

    if (map.getTilt()) {

      map.setTilt($(this).data('tilt'));

    }

  });

}

$(document).ready(initGoogleMaps);