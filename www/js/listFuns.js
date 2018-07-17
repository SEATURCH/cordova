var ko = require('knockout');

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
		}
	}
}