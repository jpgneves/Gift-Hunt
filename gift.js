var target = [0, 0];
var watcher = null;

function ping(distance) {

	var tracker = document.getElementById("tracker");
	var dtext = document.getElementById("distance");

	var text;

	if(distance > 1) {
		text = distance + " km"; 
	} else {
		text = distance * 1000 + " m";
	}

	dtext.innerHTML = text;

	if(distance <= 0.02) { // On tha spot (para um iPhone :P)
		tracker.className = "bam";
		setTimeout(deploy_gift, 3000);
		return;
	}

	if(distance <= 0.05) { // 50m
		tracker.className = "closest";
		return;
	}

	if(distance <= 0.07) { // 70m
		tracker.className = "close";
		return;
	}

	tracker.className = "far";


}

function check_gps(position) {

	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	
	var R = 6371; /* Raio da Terra, em KM */
	var dLat = (target[0] - lat).toRad();
	var dLon = (target[1] - lon).toRad();
	var s_lat = lat.toRad();
	var t_lat = target[0].toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(s_lat) * Math.cos(t_lat)
			* Math.sin(dLon/2) * Math.sin(dLon/2);

	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R*c;

	ping(d.toPrecisionFixed(8));
};

function setup_gps(t_lat, t_lon) {

	if(typeof(Number.prototype.toRad) === "undefined") {
		Number.prototype.toRad = function() {
			return this * Math.PI / 180;
		}
	}

	if (typeof(Number.prototype.toPrecisionFixed) === "undefined") {
		Number.prototype.toPrecisionFixed = function(precision) {
    		if (isNaN(this)) return 'NaN';
    		var numb = this < 0 ? -this : this;  // can't take log of -ve number...
    		var sign = this < 0 ? '-' : '';
    
 		   if (numb == 0) { n = '0.'; while (precision--) n += '0'; return n };  // can't take log of zero
  
		    var scale = Math.ceil(Math.log(numb)*Math.LOG10E);  // no of digits before decimal
		    var n = String(Math.round(numb * Math.pow(10, precision-scale)));
		    if (scale > 0) {  // add trailing zeros & insert decimal as required
			    l = scale - n.length;
			    while (l-- > 0) n = n + '0';
			    if (scale < n.length) n = n.slice(0,scale) + '.' + n.slice(scale);
			} else {          // prefix decimal and leading zeros if required
      			while (scale++ < 0) n = '0' + n;
      			n = '0.' + n;
   			}
    	return sign + n;
		}
	}


	if(navigator.geolocation) {
		watcher = navigator.geolocation.watchPosition(check_gps);
	} else {
		alert("EPIC FAIL!");
	}
	target = [t_lat, t_lon];

};


function deploy_gift() {
	var tracker = document.getElementById("tracker");
	var text = document.getElementById("text");
	var loader = document.getElementById("loader");
	var pic = document.getElementById("pic");
	var distanceText = document.getElementById("distance");
	var distanceLabel = document.getElementById("distance_label");

	tracker.className = "hidden";
	distanceText.className = "hidden";
	distanceLabel.className = "hidden";
	text.className = "show";
	loader.className = "show";

	setTimeout(function() {
		text.className = "";
		loader.className = "";

		setTimeout(function() {
			pic.className = "show";
		}, 1000)
	}, 3000);
	
}