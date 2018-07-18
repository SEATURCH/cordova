var ko = require('knockout');
var xlsx = require('xlsx');

// var functionality = {
// 	importList: function}{},
// 	scanItem:  function(){
// 		cordova.plugins.barcodeScanner.scan(
// 	      function (result) {
// 	          alert("We got a barcode\n" +
// 	                "Result: " + result.text + "\n" +
// 	                "Format: " + result.format + "\n" +
// 	                "Cancelled: " + result.cancelled);
// 	      }, 
// 	      function (error) {
// 	          alert("Scanning failed: " + error);
// 	      }
// 	   );
// 	}
// }



module.exports = {
	bind: function(viewmodel){
		viewmodel.scanItem =  function(){
        	console.log('Received cam');

			cordova.plugins.barcodeScanner.scan(
		      function (result) {
		          alert("Barcode: " + result.text + "\n");
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
		},
		viewmodel.parseXlsx =  function(scope, domEvent){
			var rABS = false;
			var files = domEvent.target.files, f = files[0];
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
				if(!rABS) data = new Uint8Array(data);
				var workbook = xlsx.read(data, {type: rABS ? 'binary' : 'array'});
				var idArray = [];
				Object.keys(workbook.Sheets.Sheet1)
					.filter(function(key){ return key.indexOf("B") >= 0 && workbook.Sheets.Sheet1[key].t =="n" })
					.forEach(function(key){ idArray.push(workbook.Sheets.Sheet1[key].w); });
				scope.importedList(idArray);
				domEvent.target.value = '';
			};
			if(rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
		}
	}
}