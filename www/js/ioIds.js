var xlsx = require('xlsx');
window.xlsx = xlsx;

// Define your file handler
const validTypes = ["application/vnd.ms-excel", "application/vnd.ms-excel", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template", "application/vnd.ms-excel.sheet.macroEnabled.12", "application/vnd.ms-excel.template.macroEnabled.12",
  "application/vnd.ms-excel.addin.macroEnabled.12", "application/vnd.ms-excel.sheet.binary.macroEnabled.12"]

var parseXlsx = function(rABS, data) {
	if(!rABS) data = new Uint8Array(data);
	var workbook = xlsx.read(data, {type: rABS ? 'binary' : 'array'});
	var idArray = [];
	Object.keys(workbook.Sheets.Sheet1)
		.filter(function(key){ return key.indexOf("B") >= 0 && workbook.Sheets.Sheet1[key].t =="n" })
		.forEach(function(key){ idArray.push(workbook.Sheets[workbook.SheetNames[0]][key].w); });
	return idArray;
}

var getDiffFiles = function(viewModel){
	var fileName = 'MissingCodes_' + new Date().toLocaleDateString().split('/').join('_');
	// App sandbox/storage
	var fsLocation = (window.cordova.platformId == 'android') ? cordova.file.externalDataDirectory : cordova.file.documentsDirectory; 
	window.resolveLocalFileSystemURL(fsLocation, function (fs) {
		fs.createReader().readEntries( function(allEntries){
			var diffFiles = allEntries.filter(function(d){ return d.isFile && (d.name.indexOf("MissingCodes_") >= 0); });
			viewModel.diffFiles(diffFiles);
		});
	});
}

var exportExcel = function(scope, domEvent){
	var fileName = 'MissingCodes_' + new Date().toLocaleDateString().split('/').join('_');
	var dupes = scope.diffFiles().filter(function(df){ return df.name.indexOf(fileName) >= 0});
	if(dupes.length > 0) fileName += "_(" + dupes.length + ")";
	fileName += ".xlsx";
	// App sandbox/storage
	var fsLocation = (window.cordova.platformId == 'android') ? cordova.file.externalDataDirectory :cordova.file.documentsDirectory; 
	window.resolveLocalFileSystemURL(fsLocation, function (fs) {
	// window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
	    console.log('file system open: ' + fs.name);
	    // fs.root.getFile(fileName, { create: true, exclusive: false }, function (fe) {
	    fs.getFile(fileName, { create: true, exclusive: false }, function (fe) {
	        console.log("fileEntry is file?" + fe.isFile.toString());
			fe.createWriter(function (fileWriter) {
			        fileWriter.onwriteend = function() {
			            console.log("Successful file write...");
			            getDiffFiles(scope);
			            delete window.saveAs;
			        };
			        fileWriter.onerror = function (e) {
			            console.log("Failed file write: " + e.toString());
			        	delete window.saveAs;
			        };
		            
		            window.saveAs = function(blob) { fileWriter.write(blob); }
		            // Create a new instance of a Workbook class
					var wb = xlsx.utils.book_new();
					xlsx.utils.book_append_sheet(wb, xlsx.utils.aoa_to_sheet(
						['Missing'].concat(viewModel.importedList()).map(function(i){ return [i]; }))
					, "Sheet 1");
					xlsx.writeFile(wb, 'out.xlsx');
			    });
	    }, function(d){
	    	console.log("Error on file create");
	    	console.log(d);
	    });

	}, function(d){
    	console.log("Error on file system load");
    	console.log(d);
    });
};

var listFromOpenInit = function(viewmodel) {
		cordova.openwith.init(
	    function() { console.log('init success!'); },
	    function(err) { console.log('init failed: ' + err); }
  	);
		cordova.openwith.addHandler(
    	function(intent){
	        if (intent.items.length == 0) return;
	        var firstFile = intent.items[0];
	        window.firstFile = firstFile;
	        if (validTypes.indexOf(firstFile.type) == -1 ) {
	          alert("Not valid file type");
	          return;
	        }
        	var url = 'file://' + firstFile.path;
        	console.log('file open: ' + url);
        	window.resolveLocalFileSystemURL(url,
				function(fileEntry){
					fileEntry.file(function (file) {
					        var reader = new FileReader();
					        reader.onload = function(e) {
								var data = e.target.result;
								var idArray = parseXlsx(false, data);
								viewmodel.importedList(idArray);
							};
							reader.readAsArrayBuffer(file);
					    }, function(d){ console.log("error on file read"); console.log(d)});
	        	},
	        	function(d){
	        		console.log("Error on file retrieve");
					console.log(d);
			});
  	});
}

var scanItem =  function(viewmodel, event, scanned){
	scanned = scanned || {};

	cordova.plugins.barcodeScanner.scan(
      function (result) {
      	if(result.cancelled){
      		viewmodel.scannedList().forEach(function(si){ scanned[si] = "unique" });
      		viewmodel.scannedList(Object.keys(scanned));
      	} else{
      		scanned[result.text] = "unique";
			scanItem(viewModel, event, scanned);
      	} 
      },
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          "preferFrontCamera" : false,
          "prompt" : "Place a barcode inside the scan area",
          "formats" : "CODE_39"
      }
   	);
}

var listFromExcel =  function(scope, domEvent){
	var files = domEvent.target.files, f = files[0];
	var reader = new FileReader();
	reader.onload = function(e) {
		var data = e.target.result;
		var idArray = parseXlsx(false, data);
		scope.importedList(idArray);
		domEvent.target.value = '';
	};
	reader.readAsArrayBuffer(f);
}



// ---------------------
// Module Exports
module.exports = {
	listFromOpenInit: listFromOpenInit,
	getDiffFiles: getDiffFiles,
	bind: function(viewmodel){
		viewmodel.scanItem =  scanItem,
		viewmodel.listFromExcel = listFromExcel,
		viewmodel.exportExcel = exportExcel
	}
}