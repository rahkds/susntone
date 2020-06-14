var module = angular.module('Student');

module.controller('studentCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	$rootScope.tab_id = '1';

	$scope.totalStudents = 0;
	$scope.getStudentList = function() {
		$http({
			method: 'GET',
			url: base_url + 'students',
		}).then(function successCallback(data, status, headers, config) {
			$scope.students = data.data.data;
			if (Array.isArray(data.data.data)) {
				$scope.totalStudents = data.data.data.length;
			}
		}, function errorCallback(response) {

		});
	}
	$scope.subjects = [];
	$scope.getSubjectList = function() {
		$http({
			method: 'GET',
			url: base_url + 'subjects',
		}).then(function successCallback(data, status, headers, config) {
			$scope.subjects = data.data.data;
		}, function errorCallback(response) {

		});
	}

	$scope.getStudentList();
	$scope.getSubjectList();
	$scope.student_field = {};
	$scope.create_student_popup_show = function() {
		$scope.profile_file = "";
		$scope.student_field = {};
		angular.element("#addStudentDlg").modal("show");
	};


	$scope.student_update_field = {};
	$scope.update_student_popup_show = function(data) {
		$scope.profile_file = "";
		$scope.student_update_field = Object.assign({}, data);
		angular.element("#updateStudentDlg").modal("show");
	};



	$scope.getTheFile = function(element) {
		$scope.$apply(function($scope) {
			$scope.theFile = element.files[0];
			$scope.FileMessage = '';
			var filename = $scope.theFile.name;
			//$scope.resume_file = $base64.encode(filename);
			var index = filename.lastIndexOf(".");
			var strsubstring = filename.substring(index, filename.length).toLowerCase();
			var success_msg = 'FileMessageSuccess_' + element.attributes[3].nodeValue;
			var error_msg = 'FileMessageError_' + element.attributes[3].nodeValue;
			if (strsubstring == '.png' || strsubstring == '.jpg' || strsubstring == '.jpeg') {
				var reader = new FileReader();
				reader.readAsDataURL(element.files[0]);
				reader.onload = function() {
					$scope.documentIsLoaded(event, element.attributes[3].nodeValue);
				};

				$scope[error_msg] = '';
				$scope[success_msg] = 'File Validated';
			} else {
				$scope.profile_pic = '';
				angular.element(document.querySelector('.upload-file')).empty();
				$scope[success_msg] = '';
				$scope[error_msg] = 'Please upload correct File. Extension should be .png, .jpg, .jpeg';
			}

		});
	}

	$scope.profile_file = "";
	$scope.documentIsLoaded = function(e) {
		$scope.$apply(function() {
			$scope.profile_file = e.target.result;
		})
	}



	$scope.add_student = function() {
		if ($scope.profile_file) {
			$scope.student_field['profile_file'] = $scope.profile_file;
		}

		$http({
			method: 'POST',
			url: base_url + 'student',
			data: $scope.student_field
		}).then(function successCallback(data, status, headers, config) {
			swal({
				title: "Good job!",
				text: "Successfully student created.",
				icon: "success",
				timer: autoclose_popup
			});
			angular.element("#addStudentDlg").modal("hide");
			$scope.getStudentList();
		}, function errorCallback(response) {
			if (response.status == 0 || response.status == 404) {
				$scope.errorMsglgn = "invalid request.";
			} else {
				$scope.errorMsglgn = response.data && response.data.message && response.data.message[0] || "Something went wrong, Please try again later.";
			}
			swal("Error", $scope.errorMsglgn, "error");
		});
	}

	$scope.update_student = function() {
		console.log($scope.profile_file);
		if ($scope.profile_file) {
			$scope.student_update_field['profile_file'] = $scope.profile_file;
		}
		$http({
			method: 'PUT',
			url: base_url + 'student/' + $scope.student_update_field.id,
			data: $scope.student_update_field
		}).then(function successCallback(data, status, headers, config) {
			swal({
				title: "Good job!",
				text: "Successfully student updated.",
				icon: "success",
				timer: autoclose_popup
			});
			angular.element("#updateStudentDlg").modal("hide");
			$scope.getStudentList();
		}, function errorCallback(response) {
			if (response.status == 0 || response.status == 404) {
				$scope.errorMsglgn = "invalid request.";
			} else {
				$scope.errorMsglgn = response.data && response.data.message && response.data.message[0] || "Something went wrong, Please try again later.";
			}
			swal("Error", $scope.errorMsglgn, "error");
		});
	}

	$scope.deleteStudent = function(studentId) {
		if (studentId) {
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
						url: base_url + 'student/' + studentId,
						//data: $scope.student_field
					}).then(function successCallback(data, status, headers, config) {
						swal({
							title: "Good job!",
							text: "Successfully student deleted.",
							icon: "success",
							timer: autoclose_popup
						});
						$scope.getStudentList();
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