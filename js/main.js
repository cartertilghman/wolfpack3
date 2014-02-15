    var _map;
    var groupMap[];
    var boolIFail=false;
    
    //replace with for loop in universal implementation
    var groupMap = [
        { id: "id0", latitude:"40.711568", longitude:"-73.010006" , timestamp:"1394000413"},
        { id: "id1", latitude:"40.716768", longitude:"-73.093696" , timestamp:"1393100413"},
        { id: "id2", latitude:"40.713368", longitude:"-73.910696" , timestamp:"1392500413" },
        { id: "id3", latitude: "42.713768", longitude:"-73.616696" , timestamp:"1392500413" },
        { id: "id4", latitude:"40.489391", longitude:"-75.016696" , timestamp:"1393100413" },
        { id: "id5", latitude: "40.793768", longitude:"-73.999997" , timestamp:"1393100413" },
        { id: "id6", latitude: "42.000011", longitude:"-71.308017" , timestamp:"1393100413" },
        ];
    
    var groupMarkers[];

    //40.7655,-73.97204 = NYC
    var currentLatitude = "40.7655";
    var currentLongitude = "-73.97204";
    if (groupMap[0].id == "id0"){
        currentLatitude = groupMap[0].latitude;  // "my" initial position (arbitrary; will be updated immediately)
        currentLongitude = groupMap[0].longitude;
    }
    
    

	var boolTripTrack=true;  

    //Create the google Maps and LatLng object 
    function drawMap()
    {
        //Creates a new google maps object
        var latlng = new google.maps.LatLng(currentLatitude,currentLongitude);
        myLatLng = latlng;
        var mapOptions = {
            center: latlng, //map initially centered at "me"
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 8,
			zoomControl: true,
            zoomControlOptions: {
              style: google.maps.ZoomControlStyle.SMALL,
			  position: google.maps.ControlPosition.LEFT_TOP
            },
        };
        
        if (boolTripTrack) //flag to determine whether map updates at a certain time
        {
            _map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
            drawGroup();
        }
        //send message to server with my ID, latlng position, and a timestamp
    }
    
    function drawGroup(){
        for (int i=0; i<groupMap.length; i++){
            iLatLng = new google.maps.LatLng(groupMap[i].latitude,groupMap[i].longitude);
            groupMarkers[i]=new Marker{
                position: iLatLng,
                map: _map,
                title: groupMarkers[i].id, // replace id with name linked from facebook
            }        
        }
    }
    
    var options = {
					 timeout: 10000,
					 maximumAge: 11000,
					 enableHighAccuracy: true
				  };
    
    //Success callback
	var suc = function(p){
		console.log("geolocation success",4);
        
        //Draws the map initially
		if( _map == null ) {
			currentLatitude = p.coords.latitude;
			currentLongitude = p.coords.longitude;
			drawMap();
		}
        else {
            myLatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
        }
        
        
        /*//Creates a new google maps marker object for using with the pins
        if((myLatLng.toString().localeCompare(oldLatLng.toString())) != 0){
            //Create a new map marker
            var Marker = new google.maps.Marker({
              position: myLatLng,
              map: _map
            });
            
            if( _llbounds == null ){
                //Create the rectangle in geographical coordinates
                _llbounds = new google.maps.LatLngBounds(new google.maps.LatLng(p.coords.latitude, p.coords.longitude));//original
            }
            else{
                //Extends geographical coordinates rectangle to cover current position
                _llbounds.moveTo(myLatLng);
            }*/
            
            //Sets the viewport to contain the given bounds & triggers the "zoom_changed" event
            //map.fitBounds(_llbounds);
           
        }
        oldLatLng = myLatLng;
	};

	var fail = function(){
        currentLatitude=groupMap[0].latitude;
        currentLongitude=groupMap[0].longitude;
        drawMap();
		console.log("Geolocation failed. \nPlease enable GPS in Settings.",1);
	};

    var getLocation = function()
    {
        console.log("in getLocation",4);
    }

    
    //Execute when the DOM loads
    //The Intel XDK intel.xdk.device.ready event fires once the Intel XDK has fully loaded. 
    //After the device has fired, you can safely make calls to Intel XDK function.    
    function onDeviceReady()
    {
        try
        {
            if (intel.xdk.device.platform.indexOf("Android")!=-1)
            {
                intel.xdk.display.useViewport(720,1280);
                document.getElementById("map_canvas").style.width="360";
            }
            else if (intel.xdk.device.platform.indexOf("iOS")!=-1)
            {
                if (intel.xdk.device.model.indexOf("iPhone")!=-1 || intel.xdk.device.model.indexOf("iPod")!=-1)
                {
                    intel.xdk.display.useViewport(320,320);
                    document.getElementById("map_canvas").style.width="320px";
                }
                else if (intel.xdk.device.model.indexOf("iPad")!=-1)
                {
                    intel.xdk.display.useViewport(768,768);
                    document.getElementById("map_canvas").style.width="768px";
                }
            }
            
           if (intel.xdk.iswin8) {
                document.getElementById("map_canvas").style.width = screen.width + "px"
                document.getElementById("map_canvas").style.height = screen.height + "px";
            }

            
			if (intel.xdk.geolocation != null)
			{
				document.getElementById("map_canvas").style.height = screen.height + "px";
                //was previously watchPosition 
				intel.xdk.geolocation.watchPosition(suc,fail,options);
			}
        }
        catch(e)
        {
            alert(e.message);
        }

        try
        {
            //lock orientation
            intel.xdk.device.setRotateOrientation("portrait");
            intel.xdk.device.setAutoRotate(false);
        }
        catch(e) {}

        try
        {
            //manage power
            intel.xdk.device.managePower(true,false);
        }
        catch(e) {}

		try
		{
			//hide splash screen
			intel.xdk.device.hideSplashScreen();
        }
        catch(e) {}		
    }


    document.addEventListener("intel.xdk.device.ready",onDeviceReady,false);