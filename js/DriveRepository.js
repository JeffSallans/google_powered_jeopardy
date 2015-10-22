"use strict";
var DriveRepository = (function() {

	//Create an object to manage getting data from google drive
	//@$http {angular service} - the $http angular service
	//@_ {lodash} - the javascript library
	var _DriveRepository = function($http, _) {
		var self = this;

		self.$http = $http;
		self._ = _;
	};

	//@link {string} - url of published google drive in tab separated variable (TSV) format
	//@returns {promise} - returns a promise that resolves to an object that contains the following structure
	//  @filename {object} - File object with the following structure
	//	  @name {string} - Name of the file. testDocument.txt it would be testDocument
	//    @extension {string} - File type. testDocument.txt it would be txt
	//  @data {object} - data from the document
	_DriveRepository.prototype.getFile = function(link) {
		var self = this;

		//If https link is provided strip it out to http to avoid cross site scripting
		link = link.replace("https", "http");	

		return self.$http.get(link)
			//Success
			.then(function(response) {

				console.log("Recieved Data: ", response.data);

				//Get file name metadata
				var filename = getFilenameFromResponse(response);

				//Throw execption if file is not TSV
				if (filename.extension !== "tsv") {
					throw {
						message: "Recieved file is not of type csv",
						data: filename
					};
				};

				return {
					filename: filename,
					data: convertTsvToObject(response.data)
				};
			},
			//Fail
			function(error) {
				
				alert(error);
			});
	};

	//Converts data in a tab separated variable file format to JavaScript object
	//@tsvString {string} - See below
	//   tab deliminated columns
	//   new line deliminated rows
	//   the first row defines the schema
	//@returns {object} - Then schema of the object is all lower case
	var convertTsvToObject = function(tsvString) {

		//Separate string by new line
		var tsvRows = tsvString.split('\n');

		//Check if empty
		if (!tsvRows || tsvRows.length == 0) return {};

		//Separate string by tab
		var tsvRowsThenCells = self._.map(tsvRows, function(row) {
			return row.split('\t');
		});

		//Define the schema and remove it from data
		var tsvSchema = tsvRowsThenCells.shift();

		//Compute the result
		var result = self._.map(tsvRowsThenCells, function(row) {
			var rowResult = {};

			//Match up the schema name with the row value
			tsvSchema.forEach(function(notUsedElement, index) {

				var schemaElementName = tsvSchema[index].toLowerCase();
				rowResult[schemaElementName] = row[index];
			});

			return rowResult;
		})

		return result;
	};

	//@response {response} - 
	//@return {object} - The object with the following structure or null if the file doesn't exist
	//  @name {string} - Name of the file. testDocument.txt it would be testDocument
	//  @extension {string} - File type. testDocument.txt it would be txt
	var getFilenameFromResponse = function(response) {

		var headerFileDataString = response.headers("content-disposition");
		var getFilenameAndExtensionRegex = /filename="([^\.]*)\.(\w+)"/;

		var headerFileData = headerFileDataString.match(getFilenameAndExtensionRegex);

		//If match doesn't exist return null
		if (!headerFileData || headerFileDataString.length === 0) return null;

		return {

			//Index of 0 is entire match
			name: headerFileData[1],
			extension: headerFileData[2]
		};
	};

	return _DriveRepository;
})();