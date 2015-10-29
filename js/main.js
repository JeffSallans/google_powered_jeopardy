"use strict";
angular.module('jeopardyApp', [])
	.controller('HomeController', ['$scope', '$http', function($scope, $http) {

		//Date for Copyright
		var date = new Date();
		$scope.year = date.getFullYear()

		//Google Drive data variables
		$scope.driveRepo = new DriveRepository($http, _);
		$scope.fileName = null;
		$scope.jeopardyCategories = [];

		//The current question to display, show null to hide the question
		$scope.selectedJeopardyQuestion = null;

		//If the answer should be shown
		$scope.shouldShowAnswer = false;

		$scope.setLink = function() {

			$scope.errorMessage = null;

			$scope.driveRepo.getFile($scope.googleDriveLink)
				//Success
				.then(function(file) {
					console.log("Google Link Data: ", file);

					$scope.fileName = file.filename.name.replace('-Sheet1', '');
					$scope.jeopardyCategories = _.toArray(_.groupBy(file.data, function(e) {
						return e.category;
					}));
				},
				//Fail
				function(error) {
					$scope.errorMessage = error.message;
					console.error(error);
				})
		};

		//Call the appropriate functions based on the question state
		//@question {object} - An element from the list of jeopardyCategories
		$scope.stepThoughQuestionState = function(question) {

			//Check if selected question has been set
			if ($scope.selectedJeopardyQuestion !== question) {
				$scope.showQuestion(question);
			}
			else if (!$scope.shouldShowAnswer) {
				$scope.showAnswer();
			}
			else {
				$scope.hideQuestion(question);
			}
		}

		//@question {object} - An element from the list of jeopardyCategories
		$scope.showQuestion = function(question) {
			$scope.selectedJeopardyQuestion = question;
		};

		$scope.showAnswer = function() {
			$scope.shouldShowAnswer = true;
		};

		//@question {object} - An element from the list of jeopardyCategories
		$scope.hideQuestion = function(question) {
			$scope.selectedJeopardyQuestion = null;
			$scope.shouldShowAnswer = false;
			$scope.removeQuestion(question);
		};

		//@question {object} - An element from the list of jeopardyCategories
		$scope.removeQuestion = function(question) {
			$scope.jeopardyCategories.forEach(function(jeopardyQuestions) {
				var index = jeopardyQuestions.indexOf(question);
  				
				//only remove entry if question exists
				if (index >= 0) {
	  				jeopardyQuestions.splice(index, 1);
	  			}
			});
		};

	}]);
