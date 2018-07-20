var selectEmail = function(viewmodel, event) {
    var diffFiles = viewmodel.diffFiles();
    if(diffFiles.length == 0){
        alert("No files found");
        return;
    }
    var config = {
        title: "Select File",
        items:[ diffFiles ],
        positiveButtonText: 'Ok',
        negativeButtonText: 'Cancel',
        theme: "dark",  //light or dark theme, not available on iOS yet
        wrapWheelText: false, //wrap the wheel for infinite scroll, not available on iOS
        displayKey: "name"
    };
         
    window.SelectorCordovaPlugin.show(config, function(result) {
        var selectedFile = diffFiles[result[0].index];
        cordova.plugins.email.open({
            subject: selectedFile.name,
            attachments: selectedFile.nativeURL
        });
    }, function() {
        console.log('Canceled');
    });
}


module.exports = {
    selectEmail: selectEmail
}