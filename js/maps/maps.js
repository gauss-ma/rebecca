//function myMap() {
//var mapProp= {
//  center: new google.maps.LatLng(-34.6247472,-58.4490894),
//  zoom:6,
//};
//var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
//}
var map;
var myCenter = new google.maps.LatLng(-34.6247472,-58.4490894);
var emisor;
var receptor;
var infowindow;

function initialize() {
  var mapProp = {
    center: myCenter,
    zoom: 5,
    //mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

function setEmisor(){
	//google.maps.event.addListener(map, 'click', function(event) {
	var MarkerListener=google.maps.event.addListener(map, 'click', function(event) {
	
	var ubicacion=event.latLng;

  	if (!emisor || !emisor.setPosition) {
  	  emisor = new google.maps.Marker({
  	  position: ubicacion,
  	  map: map,
  	  icon: {
  	    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
  	  }
  	});
  	} 
  	else { emisor.setPosition(ubicacion);
  	}
  	console.log("Emisor");
  	$("#emis_lat").val(emisor.position.lat());
  	$("#emis_lon").val(emisor.position.lng());
  	$("#emis_dist").val(0);

	google.maps.event.removeListener(MarkerListener);

	});
};

function setReceptor(){
	//google.maps.event.addListener(map, 'click', function(event) {
	var MarkerListener=google.maps.event.addListener(map, 'click', function(event) {
	  var ubicacion=event.latLng;


	  if (!receptor || ! receptor.setPosition) {
	    receptor = new google.maps.Marker({
	    position: ubicacion,
	    map: map,
	    icon: {
	      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
	    }
	  });
	  } 
	  else { receptor.setPosition(ubicacion)}
  	  console.log("Receptor");
	  $("#recep_lat").val(receptor.position.lat());
	  $("#recep_lon").val(receptor.position.lng());
	  //$("#recep_dist").val(google.maps.geometry.spherical.computeDistanceBetween (emisor,receptor));
	
	$("#recep_dist").val(Math.round(google.maps.geometry.spherical.computeDistanceBetween (emisor.position, receptor.position)/1000.));

	google.maps.event.removeListener(MarkerListener);
	});
};

google.maps.event.addDomListener(window, 'load', initialize);
