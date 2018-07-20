// Entrypoint for weback, include main knockout binding and all scss
require('../css/tabs.scss');
require('./_custom-bindings');

var ko =  require('knockout');
var ioIds =  require('./ioIds');
var email =  require('./email');

var viewmodel = new function() {
    var self = this;

    self.importedList = ko.observableArray([]);
    self.scannedList = ko.observableArray([]);
    self.diffList = ko.computed( function(){
        return self.importedList().filter(function(item){
            return self.scannedList.indexOf(item) == -1 ;
        });
    });

    self.diffFiles = ko.observableArray([]);
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
    neededPermissions: [],
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // permissions
        var permissions = cordova.plugins.permissions;
        permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, function(){}, function(d){
            permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, function(){}, function(d){ console.log("Could not request storage permissions") });
        });
        var intiPage = 'Start';
        // Entrypoint for weback, used mainly to include konckout from npm wihtout having to donwload specifically
        
        ioIds.listFromOpenInit(viewmodel);
        ioIds.getDiffFiles(viewModel);
        ioIds.bind(viewmodel);
        
        viewModel.selectEmail = email.selectEmail;


        ko.applyBindings(viewmodel);

        console.log('Received Event: ' + id);
    }
};

app.initialize();


// cordova plugin add cc.fovea.cordova.openwith --variable ANDROID_MIME_TYPE="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel.sheet.macroEnabled.12" --variable IOS_URL_SCHEME=ccfoveaopenwithdemo  --variable IOS_UNIFORM_TYPE_IDENTIFIER=com.microsoft.excel.xls
// cordova plugin add cc.fovea.cordova.openwith --variable ANDROID_MIME_TYPE="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" --variable IOS_URL_SCHEME=ccfoveaopenwithdemo  --variable IOS_UNIFORM_TYPE_IDENTIFIER=com.microsoft.excel.xls

// cordova plugin add cc.fovea.cordova.openwith --variable ANDROID_MIME_TYPE="application/vnd.ms-excel.sheet.macroEnabled.12" --variable EXTRA_MIME_TYPES="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" --variable IOS_URL_SCHEME=ccfoveaopenwithdemo  --variable IOS_UNIFORM_TYPE_IDENTIFIER=com.microsoft.excel.xls
