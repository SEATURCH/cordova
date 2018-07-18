// Entrypoint for weback, include main knockout binding and all scss
require('../css/tabs.scss');

var ko =  require('knockout');
var Swipe = require('swipejs');
var listFuns =  require('./listFuns');
var opennwith = require('./openwith');

var viewmodel = new function() {
    var self = this;

    self.importedList = ko.observableArray([]);
    self.scannedList = ko.observableArray([]);
    self.diffList = ko.computed( function(){
        return self.importedList().filter(function(item){
            return self.scannedList.indexOf(item) == -1 ;
        });
    });
};

window.viewModel = viewmodel;
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');
        var intiPage = 'Start';
        // Entrypoint for weback, used mainly to include konckout from npm wihtout having to donwload specifically
        listFuns.bind(viewmodel);
        ko.applyBindings(viewmodel);

        var element = document.getElementById('slider');
        opennwith.setupOpenwith();

        window.mySwipe = new Swipe(element, {
          startSlide: 0,
          speed:150,
          // auto: 3000,
          draggable: true,
          autoRestart: false,
          continuous: false,
          // disableScroll: true,
          stopPropagation: true,
          callback: function(index, element) {},
          transitionEnd: function(index, element) {}
        });
        console.log('Received Event: ' + id);
    }
};

app.initialize();


// cordova plugin add cc.fovea.cordova.openwith --variable ANDROID_MIME_TYPE="application/vnd.ms-excel" --variable IOS_URL_SCHEME=ccfoveaopenwithdemo  --variable IOS_UNIFORM_TYPE_IDENTIFIER=com.microsoft.excel.xls
// cordova plugin add cc.fovea.cordova.openwith --variable ANDROID_MIME_TYPE="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" --variable IOS_URL_SCHEME=ccfoveaopenwithdemo  --variable IOS_UNIFORM_TYPE_IDENTIFIER=com.microsoft.excel.xls

