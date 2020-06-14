var module = angular.module('Subject');

module.controller('subjectCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	$rootScope.tab_id = '3';

	$scope.totalSubject = 0;
	$scope.subjects = [];
	$scope.getSubjectList = function() {
		$http({
			method: 'GET',
			url: base_url + 'subjects',
		}).then(function successCallback(data, status, headers, config) {
			$scope.subjects = data.data.data;
			if (Array.isArray(data.data.data) && data.data.data.length) {
				$scope.totalSubject = data.data.data.length;
			}
		}, function errorCallback(response) {

		});
	}

	$scope.getSubjectList();
	$scope.add_subject_field = {};
	$scope.create_subject_popup_show = function() {
		$scope.add_subject_field = {};
		angular.element("#addSubjectDlg").modal("show");
	};


	$scope.subject_update_field = {};
	$scope.update_subject_popup_show = function(data) {
		$scope.subject_update_field = Object.assign({}, data);
		angular.element("#updateSubjectDlg").modal("show");
	};


	$scope.add_subject = function() {
		$http({
			method: 'POST',
			url: base_url + 'subject',
			data: $scope.add_subject_field
		}).then(function successCallback(data, status, headers, config) {
			swal({
				title: "Good job!",
				text: "subject successfully created.",
				icon: "success",
				timer: autoclose_popup
			});
			angular.element("#addSubjectDlg").modal("hide");
			$scope.getSubjectList();
		}, function errorCallback(response) {
			if (response.status == 0 || response.status == 404) {
				$scope.errorMsglgn = "invalid request.";
			} else {
				$scope.errorMsglgn = response.data && response.data.message && response.data.message[0] || "Something went wrong, Please try again later.";
			}
			swal("Error", $scope.errorMsglgn, "error");
		});
	}

	$scope.update_subject = function() {
		$http({
			method: 'PUT',
			url: base_url + 'subject/' + $scope.subject_update_field.id,
			data: $scope.subject_update_field
		}).then(function successCallback(data, status, headers, config) {
			swal({
				title: "Good job!",
				text: "subject successfullyc updated.",
				icon: "success",
				timer: autoclose_popup
			});
			angular.element("#updateSubjectDlg").modal("hide");
			$scope.getSubjectList();
		}, function errorCallback(response) {
			if (response.status == 0 || response.status == 404) {
				$scope.errorMsglgn = "invalid request.";
			} else {
				$scope.errorMsglgn = response.data && response.data.message && response.data.message[0] || "Something went wrong, Please try again later.";
			}
			swal("Error", $scope.errorMsglgn, "error");
		});
	}

	$scope.deleteSubject = function(subjectId) {
		if (subjectId) {
			swal({
				title: "Are you sure?",
				text: "Once deleted, you will not be able to recover this data!",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			}).then(function(willDelete) {
				if (willDelete) {
					$http({
						method: 'DELETE',
						url: base_url + 'subject/' + subjectId,
					}).then(function successCallback(data, status, headers, config) {
						swal({
							title: "Good job!",
							text: "subject successfully deleted.",
							icon: "success",
							timer: autoclose_popup
						});
						$scope.getSubjectList();
					}, function errorCallback(response) {
						if (response.status == 0 || response.status == 404) {
							$scope.errorMsglgn = "invalid request.";
						} else {
							$scope.errorMsglgn = response.data && response.data.message && response.data.message[0] || "Something went wrong, Please try again later.";
						}
						swal("Error", $scope.errorMsglgn, "error");
					});
				}
			});
		}
	}



}]);