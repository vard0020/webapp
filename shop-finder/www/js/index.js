var vard0020_app = {
    
    pages: [],
    links: [],
    numLinks: 0,
    numPages: 0,
    
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('DOMContentLoaded', this.receivedEvent, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        vard0020_app.receivedEvent('deviceready');
    },
    
    receivedEvent: function() {
        vard0020_app.handleClickAndTouch();
    },
    
     handleClickAndTouch: function() {
         pages = document.querySelectorAll('[data-role="page"]');	
         numPages = pages.length;
         links = document.querySelectorAll('[data-role="pagelink"]');
         numLinks = links.length;
         for(var i=0;i<numLinks; i++){
            //either add a touch or click listener
             if(this.detectTouchSupport( )){
               links[i].addEventListener("touchend", vard0020_app.handleTouch, false);
             }
                links[i].addEventListener("click", vard0020_app.handleNav, false);	
         }
      },
    
      handleTouch: function(ev){
      ev.preventDefault();
      ev.stopImmediatePropagation();
      var touch = ev.changedTouches[0]; //this is the first object touched
      var newEvt = document.createEvent("MouseEvent");	
      //old method works across browsers, though it is deprecated.
      newEvt.initMouseEvent("click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
      ev.currentTarget.dispatchEvent(newEvt);
      //send the touch to the click handler
    },

    
    //handle the click event
    handleNav: function(ev){
	ev.preventDefault();
	var href = ev.target.href;
	var parts = href.split("#");
	vard0020_app.loadPage( parts[1] );	
        return false;
    },
    
    //Deal with history API and switching divs
    loadPage: function( url ){
	if(url == null){
		//home page first call
		pages[0].style.display = 'block';
		history.replaceState(null, null, "#home");	
        
	}else{
    
    for(var i=0; i < numPages; i++){
      if(pages[i].id == url){
        pages[i].className = "active";
        history.pushState(null, null, "#" + url);
          if (pages[i].id == "two") {
           vard0020_app.checkGeolocation();   
          }else if (pages[i].id == "three"){
              vard0020_app.findPhoneContacts();
          }
      }else{
        pages[i].className = "";	
      }
    }
    for(var t=0; t < numLinks; t++){
      links[t].className = "";
      if(links[t].href == location.href){
        links[t].className = "activetab";
      }
    }
	}
},


    //Finding and Displaying Contacts////////////////////
    findPhoneContacts: function(){
        var options = new ContactFindOptions( );
        options.filter = "";  //leaving this empty will find return all contacts
        options.multiple = true;  //return multiple results
        var filter = ["displayName", "phoneNumbers"];   //an array of fields to compare against the options.filter 
        navigator.contacts.find(filter, vard0020_app.successFunc, vard0020_app.errFunc, options);
    
    },
    successFunc: function(contacts){
        var v = Math.floor((Math.random() * contacts.length) + 1);
        console.log(contacts[v].phoneNumbers);
          document.getElementById("contact").innerHTML = "Name: " + contacts[v].displayName + " </br> Phone number: <a href='Phone number:" + contacts[v].phoneNumbers[0].value + "'>" + contacts[v].phoneNumbers[1].value + "</a>";
        
    },
    
    errFunc: function(){
        document.getElementById("contact").innerHTML = "Sorry no contacts found..";
    },
    //Finding and displaying geolocation///////////////////////////
    checkGeolocation: function(){
      if( navigator.geolocation ){
      //finding the position
        var params = {enableHighAccuracy: false, timeout:36000, maximumAge:60000};
        navigator.geolocation.getCurrentPosition( this.reportPosition, this.gpsError, params ); 
       }
          else{
                alert("Geolocation not supported..");
              }
         },
        
    reportPosition: function( position ){ 
        //creating canvas element
        var canvas = document.createElement("canvas");
        canvas.id = "myCanvas";
        canvas.width = 320;
        canvas.height = 320;
        document.body.appendChild(canvas);
        var context = canvas.getContext('2d');

          //creating and drawing image to Canvas element
          var imageObj = document.getElementById("map");
          imageObj.onload = function() {
          context.drawImage(imageObj, 0, 0);       
          };        
         //referencing to google static maps and setting the lattitude and longitude 
          imageObj.src = "http://maps.google.com/maps/api/staticmap?sensor=false&center=" + position.coords.latitude + ',' +      
                 position.coords.longitude + "&zoom=12&size=200x200&markers=color:red|label:T|" + position.coords.latitude + ','              + position.coords.longitude; 
      },
    
    //Test for browser support of touch events
    detectTouchSupport: function(){
      msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
      var touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof                 DocumentTouch));
      return touchSupport;
    },
};

vard0020_app.initialize();