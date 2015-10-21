"use strict";
angular.module('jeopardyApp', [])
	.controller('HomeController', ['$scope', '$http', function($scope, $http) {
		$scope.driveRepo = new DriveRepository($http, _);
		$scope.jeopardyQuestions = [];

		//The current question to display, show null to hide the question
		$scope.selectedJeopardyQuestion = null;

		//If the answer should be shown
		$scope.shouldShowAnswer = false;

		$scope.setLink = function() {
			$scope.driveRepo.getData($scope.googleDriveLink)
				//Success
				.then(function(data) {
					console.log("Google Link Data: ", data);
					$scope.jeopardyQuestions = data;
				},
				//Fail
				function(error) {
					alert(error);
				})
		};

		//@question {object} - An element from the list of jeopardyQuestions
		$scope.showQuestion = function(question) {
			$scope.selectedJeopardyQuestion = question;
		};

		$scope.showAnswer = function() {
			$scope.shouldShowAnswer = true;
		};

		$scope.hideQuestion = function() {
			$scope.selectedJeopardyQuestion = null;
			$scope.shouldShowAnswer = false;
		};
	}]);
