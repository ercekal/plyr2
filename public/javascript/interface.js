"use strict"

$(document).ready(function() {


  $("#searchInput").keyup(function () {
      //split the current value of searchInput
      var data = this.value.toUpperCase().split(" ");
      //create a jquery object of the rows
      var jo = $("#fbody").find("tr");
      if (this.value == "") {
          jo.show();
          return;
      }
      //hide all the rows
      jo.hide();

      //Recusively filter the jquery object to get results.
      jo.filter(function (i, v) {
          var $t = $(this);
          for (var d = 0; d < data.length; ++d) {
              if ($t.text().toUpperCase().indexOf(data[d]) > -1) {
                  return true;
              }
          }
          return false;
      })
      //show the rows that match.
      .show();
  }).focus(function () {
      this.value = "";
      $(this).css({
          "color": "black"
      });
      $(this).unbind('focus');
  }).css({
      "color": "#C0C0C0"
  });
  
  if (document.getElementById("map")) {
    addMapToStartPage();
  }

  if (document.getElementById("searchTextField")) {
    calculateCoordinates();
  }

  if (document.getElementById("event_date")) {
    setEventDate();
  }

  $(".clickable-row").click(function() {
    window.location = $(this).data("href");
  });

  function calculateCoordinates() {
    if(document.location.href.indexOf("/events/new") != -1) {
      function initialize() {
        var input = document.getElementById('searchTextField');
        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
              var place = autocomplete.getPlace();
              document.getElementById('cityLat').value = place.geometry.location.lat();
              document.getElementById('cityLng').value = place.geometry.location.lng();
             });
        }
        google.maps.event.addDomListener(window, 'load', initialize);
    }
  }

  function setEventDate() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(month)+"-"+(day);

    $('#event_date').val(today);
    $('#event_date').attr({'min': today});

    $(function(){
      $("#event_time").each(function(){
        var d = new Date(),
            h = d.getHours(),
            m = d.getMinutes();
        if(h < 10) h = '0' + h;
        if(m < 10) m = '0' + m;
        $(this).attr({
          'value': h + 1 + ':' + m,
          'min': h + ':' + m
        });
      });
    });
  }

  function addMapToStartPage() {
    var marker, i, map;

    var locations = [
      ['Bondi Beach', -33.890542, 151.274856, 4, "/events/index"],
      ['Coogee Beach', -33.923036, 151.259052, 5, "/events/index"],
      ['Cronulla Beach', -34.028249, 151.157507, 3, "/events/index"],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2,"/events/index"],
      ['Maroubra Beach', -33.950198, 151.259302, 1, "/events/index"]
    ];

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
      });
    } else {
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(51.5074, .1278),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    }

    var infowindow = new google.maps.InfoWindow();

    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent("Test name22" + "<br><a href='" + locations[i][4] + "'>Link</a>");
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
  }
});
