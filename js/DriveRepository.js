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
	//@returns {promise} - returns a promise that resolves to an object that contains the data from the link
	_DriveRepository.prototype.getData = function(link) {
		var self = this;

		return self.$http.get(link)
			//Success
			.then(function(response) {

				console.log("Recieved Data: ", response.data);

				return convertTsvToObject(response.data);
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

	return _DriveRepository;
})();