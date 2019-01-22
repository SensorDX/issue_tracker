App.controller('FaultInboxCtrl', ['$scope', 'Toast', 'FaultInboxService',
function ($scope, Toast, FaultInboxService) {

  // Note: FaultInboxService is located in 'src/assets/js/app.js'
  // Sample Controller Logic for Fault Inbox
  FaultInboxService.GetInbox().then(function(response) {
      const inbox = response.data;
      if (inbox.success) {
        $scope.inbox = inbox.data;
        Toast.Success('Success retrieving inbox');
        var stations = [
              "TA00006",
              "TA00007",
              "TA00008",
              "TA00009",
              "TA00010",
              "TA00011",
              "TA00015",
              "TA00016",
              "TA00024",
              "TA00025",
              "TA00027",
              "TA00028",
              "TA00045",
              "TA00047",
              "TA00049",
              "TA00050",
              "TA00055",
              "TA00056",
              "TA00057",
              "TA00061",
              "TA00064",
              "TA00066",
              "TA00067",
              "TA00075",
              "TA00076",
              "TA00077",
              "TA00080",
              "TA00081",
              "TA00083",
              "TA00084",
              "TA00086",
              "TA00087",
              "TA00090",
              "TA00098",
              "TA00103",
              "TA00111",
              "TA00115",
              "TA00116",
              "TA00117",
              "TA00118",
              "TA00120",
              "TA00121",
              "TA00122",
              "TA00130",
              "TA00132",
              "TA00133",
              "TA00134",
              "TA00136",
              "TA00142",
              "TA00146",
              "TA00148",
              "TA00151",
              "TA00152",
              "TA00154",
              "TA00156",
              "TA00157",
              "TA00158",
              "TA00161",
              "TA00162",
              "TA00163",
              "TA00164",
              "TA00165",
              "TA00166",
              "TA00167",
              "TA00168",
              "TA00169",
              "TA00172",
              "TA00176",
              "TA00180",
              "TA00184",
              "TA00186",
              "TA00187",
              "TA00189",
              "TA00196",
              "TA00197",
              "TA00198",
              "TA00199",
              "TA00200",
              "TA00201",
              "TA00203",
              "TA00207",
              "TA00215",
              "TA00216",
              "TA00217",
              "TA00220",
              "TA00222",
              "TA00224",
              "TA00228",
              "TA00229",
              "TA00230",
              "TA00232",
              "TA00236",
              "TA00237",
              "TA00238",
              "TA00239",
              "TA00243",
              "TA00245",
              "TA00246",
              "TA00247",
              "TA00248",
              "TA00249",
              "TA00250",
              "TA00251",
              "TA00253",
              "TA00254",
              "TA00255",
              "TA00256",
              "TA00258",
              "TA00259",
              "TA00261",
              "TA00262",
              "TA00264",
              "TA00265",
              "TA00266",
              "TA00267",
              "TA00268",
              "TA00272",
              "TA00275",
              "TA00276",
              "TA00278",
              "TA00281",
              "TA00282",
              "TA00284",
              "TA00285",
              "TA00286",
              "TA00287",
              "TA00290",
              "TA00291",
              "TA00292",
              "TA00293",
              "TA00294",
              "TA00295",
              "TA00300",
              "TA00301",
              "TA00302",
              "TA00303",
              "TA00305",
              "TA00307",
              "TA00309",
              "TA00310",
              "TA00312",
              "TA00315",
              "TA00317",
              "TA00319",
              "TA00320",
              "TA00321",
              "TA00322",
              "TA00323",
              "TA00324",
              "TA00325",
              "TA00329",
              "TA00330",
              "TA00331",
              "TA00332",
              "TA00334",
              "TA00335",
              "TA00336",
              "TA00337",
              "TA00339",
              "TA00340",
              "TA00341",
              "TA00342",
              "TA00343",
              "TA00344",
              "TA00345",
              "TA00346",
              "TA00347",
              "TA00348",
              "TA00349",
              "TA00350",
              "TA00351",
              "TA00352",
              "TA00353",
              "TA00354",
              "TA00355",
              "TA00356",
              "TA00358",
              "TA00359",
              "TA00362",
              "TA00363",
              "TA00364",
              "TA00365",
              "TA00367",
              "TA00368",
              "TA00369",
              "TA00370",
              "TA00371",
              "TA00372",
              "TA00373",
              "TA00375",
              "TA00377",
              "TA00380",
              "TA00381",
              "TA00382",
              "TA00383",
              "TA00385",
              "TA00386",
              "TA00390",
              "TA00392",
              "TA00395",
              "TA00397",
              "TA00400",
              "TA00404",
              "TA00405",
              "TA00406",
              "TA00407",
              "TA00409",
              "TA00412",
              "TA00414",
              "TA00419",
              "TA00420",
              "TA00421",
              "TA00422",
              "TA00424",
              "TA00426",
              "TA00427",
              "TA00428",
              "TA00429",
              "TA00431",
              "TA00432",
              "TA00434",
              "TA00437",
              "TA00438",
              "TA00441",
              "TA00442",
              "TA00444",
              "TA00449",
              "TA00453",
              "TA00454",
              "TA00455",
              "TA00456",
              "TA00457",
              "TA00462",
              "TA00464",
              "TA00465",
              "TA00466",
              "TA00467",
              "TA00470",
              "TA00471",
              "TA00472"];


              $( document ).ready(function() {
                sID = document.getElementById("StationID");
                dateID = document.getElementsByClassName("form-control")
                for(var i = 0; i < stations.length; i++){
                   var option = document.createElement("option");
                   option.text = stations[i];
                   sID.add(option);
                }
                sID.addEventListener("change", function(){
                  changedStation = 1;
                });


                var date_input=$('input[name="date"]');
                var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
                var options={
                  format: 'yyyy-mm-dd',
                  container: container,
                  todayHighlight: true,
                  autoclose: true,
                };
                date_input.datepicker(options);

                $('#start_date').on('change', function() {
                 changedStation = 1;
               });

               $('#end_date').on('change', function() {
                 changedStation = 1;
               });

               $(document).ready(function(){
                 $('[data-toggle="tooltip"]').tooltip();
               });


              });
      } else {
        Toast.Danger('Failure retrieving inbox');
      }
  })
}]);


// Controller for rest of app below.
// No need to modify
App.controller('HeaderCtrl', ['$scope', '$state', 'AuthService',
function ($scope, $state, AuthService) {
		$scope.onLogout = function() {
			AuthService.ClearCredentials();
			$state.go('login');
		}
}]);

App.controller('LoginCtrl', ['$scope', '$state', '$cookies', 'AuthService', 'Toast',
function ($scope, $state, $cookies, AuthService, Toast) {
		$scope.login = {
			email: "",
			password: "",
			remember_me: false
		};
		if ($cookies.getObject('globals')) {
			$state.go('issues');
		}
		$scope.onLoginSubmit = function() {
			AuthService.Login($scope.login).then(function(response) {
					const user = response.data;
					if (user.success) {
							AuthService.SetCredentials({user: user.data, ...$scope.login});
							$state.go('issues');
					} else {
						Toast.Danger(user.message);
					}
			})
		}
}]);

App.controller('IssueCtrl', ['$rootScope', '$scope', '$window', '$http', 'UserService', 'IssueService', 'SiteService', 'Toast',
function ($rootScope, $scope, $window, $http, UserService, IssueService, SiteService, Toast) {
		$scope.issue = {
			assignee: null,
			labels: [],
			ids: [],
			priority: null,
			station: "",
			status: null
		};
		$scope.filter_assignee = {
			_id: $rootScope.globals.currentUser.user._id,
			full_name: $rootScope.globals.currentUser.user.full_name
		}
		$scope.selectAssignee = function() {
			console.log('choosing assignee', $scope.filter_assignee);
			const assignee_id = $scope.filter_assignee ? $scope.filter_assignee._id : "";
			IssueService.GetIssues("open", assignee_id).then(function(response) {
				const issues = response.data;
				if (issues.success) {
					$scope.openIssues = issues.data;
					$scope.tabs.openCount = issues.count;
				} else {
					Toast.Danger(issues.message);
				}
			});
			IssueService.GetIssues("close", assignee_id).then(function(response) {
				const issues = response.data;
				if (issues.success) {
					$scope.closeIssues = issues.data;
					$scope.tabs.closeCount = issues.count;
				} else {
					Toast.Danger(issues.message);
				}
			});
			IssueService.GetIssues("", assignee_id).then(function(response) {
				const issues = response.data;
				if (issues.success) {
					$scope.allIssues = issues.data;
					$scope.tabs.allCount = issues.count;
				} else {
					Toast.Danger(issues.message);
				}
			});
		}
		$scope.updateLabels = function(label) {
			console.log(label);
			$scope.issue.labels = label;
		};
		$scope.tabs = {
			openCount: '0',
			closeCount: '0',
			allCount: '0'
		}
		$scope.selected = [];
		$scope.isCheckbox = function() {
			return $scope.selected.length > 0;
		}
		$scope.toggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) {
				list.splice(idx, 1);
			}
			else {
				list.push(item);
			}
			$scope.issue.ids = $scope.selected;
			console.log($scope.issue.ids);
		};
		$scope.exists = function (item, list) {
			return list.indexOf(item) > -1;
		};

		$scope.toggleAll = function() {
			if ($scope.selected.length === $scope.items.length) {
				$scope.selected = [];
			} else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
				$scope.selected = $scope.items.slice(0);
			}
		};

		$scope.clearSelected = function() {
			$scope.selected = [];
		};

		IssueService.GetLabels().then(function(response) {
			console.log('labels', response);
			const labels = response.data;
			if (labels.success) {
				$scope.labels = labels.data;
			}
		});
		UserService.GetUsers(['full_name']).then(function(response) {
			const assignees = response.data;
			console.log('assignees', assignees);
			if (assignees.success) {
				$scope.assignees = assignees.data;
			}
		})
		IssueService.GetPriorities().then(function(response) {
			const priorities = response.data;
			if (priorities.success) {
				$scope.priorities =  priorities.data;
			}
		})
		IssueService.GetStatus().then(function(response) {
			const statuses = response.data;
			console.log('status', statuses);
			if (statuses.success) {
				$scope.statuses = statuses.data;
			}
		});
		SiteService.GetSites().then(function(response) {
			const sites = response.data;
			console.log('sites', sites);
			if (sites.success) {
				$scope.sites = sites.data;
				console.log('scope.sites', $scope.sites);
			} else {
				Toast.Danger(sites.message);
			}
		});
		$scope.updateIssue = function(issue) {
			IssueService.UpdateIssues(issue).then(function(response) {
				const issue = response.data;
				if(issue.success) {
					Toast.Success(issue.message);
				} else {
					Toast.Danger(issue.message);
				}
				console.log('updating ...');
				console.log(response);
				$window.location.reload();
			});
		};
		$scope.selectAssignee();
}]);

App.controller('ViewIssueCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$state', '$stateParams', '$sce', 'IssueService', 'CommentService', 'Toast',
function ($rootScope, $scope, $window, $http, $location, $state, $stateParams, $sce, IssueService, CommentService, Toast) {
		const _id = $stateParams.id;
		$scope.editing = {};
		$scope.old_message = {};
		$scope.comment_to_post = {
			message: '',
			created_by: {
				_id: $rootScope.globals.currentUser.user._id,
				full_name: $rootScope.globals.currentUser.user.full_name
			}
		}
		IssueService.GetIssueById(_id).then(function(response) {
			const issue = response.data;
			if (issue.success) {
				$scope.issue = issue.data;
				$scope.issue.ids = [_id];
			} else {
				Toast.Danger(issue.message);
			}
		});
		$scope.edit = function(comment) {
			console.log('comment was clicked', comment);
			$scope.editing[comment._id] = true;
			$scope.old_message[comment._id] = comment.message;
			jQuery('#click2edit_'+comment._id).summernote({focus: true});
			console.log('edit', $scope.editing);
		};
		$scope.cancel = function(comment) {
			$scope.editing[comment._id] = false;
			console.log('cancel', $scope.editing);
			$('#click2edit_'+comment._id).summernote('code', $scope.old_message[comment._id]);
			$('#click2edit_'+comment._id).summernote('destroy');
		}
		$scope.save = function(comment) {
			$scope.editing[comment._id] = false;
			var markup = $('#click2edit_'+comment._id).summernote('code');
			comment.message = markup;
			console.log('save', $scope.editing);
			CommentService.UpdateComment(comment).then(function(response) {
				const updated_comment = response.data;
				if (updated_comment.success) {
					console.log('updated comment', updated_comment);
					$('#click2edit_'+comment._id).summernote('code', markup);
					Toast.Success(updated_comment.message);
					$('#click2edit_'+comment._id).summernote('destroy');
				} else {
					Toast.Danger(updated_comment.message);
					$('#click2edit_'+comment._id).summernote('destroy');
				}
			}, function (error) {
				console.log("couldn't load comments", error);
				Toast.Danger(error.statusText);
				$('#click2edit_'+comment._id).summernote('destroy');
			});
		}
		$scope.comment = function() {
			console.log('commenting ...');
			var mark = jQuery('#my_summernote').summernote('code');
			$scope.comment_to_post.message = mark;
			CommentService.CreateComment($scope.comment_to_post).then(function(response) {
				const comment = response.data;
				if (comment.success) {
					console.log('posted comment', comment);
					$scope.comments.push(comment.data);
					IssueService.PostIssueComment(_id, {comments: comment.data._id}).then(function(response) {
						const issue = response.data;
						console.log('posted comment in issues', issue);
						jQuery('#my_summernote').summernote('reset');
					});
				} else {
					Toast.Danger(issue.message);
				}
			}, function (error) {
				console.log("couldn't load comments", error);
				Toast.Danger(error.statusText);
			});
			console.log('markup html -- ', mark);
			//var station_table = jQuery('.js-dataTable-full').DataTable({
		};
		IssueService.GetIssueComment(_id).then(function(response) {
			const issue = response.data;
			console.log('issue comments', issue);
			if (issue.success) {
				$scope.comments = issue.data;
			} else {
				Toast.Danger(issue.message);
			}
		});
		$scope.closeIssue = function(issue) {
			issue.status = issue.status == 'open' ? 'close' : 'open';
			IssueService.UpdateIssues(issue).then(function(response) {
				const issue = response.data;
				if(issue.success) {
					console.log('issue updated', issue);
				} else {
					Toast.Danger(issue.message);
				}
			});
		};
}]);

App.controller('NewIssueCtrl', ['$rootScope', '$scope', '$http', '$window', '$location', '$state', '$stateParams', '$log', '$q', 'ModalService', 'UserService', 'IssueService', 'SiteService', 'EmailService', 'Toast',
	function ($rootScope, $scope, $http, $window, $location, $state, $stateParams, $log, $q, ModalService, UserService, IssueService, SiteService, EmailService, Toast) {
		const {_id, full_name} = $rootScope.globals.currentUser.user;
		$scope.issue = {
			title: '',
			description: '',
			opened_by: {
				full_name,
				_id,
			},
			assignee: {
				full_name: '',
				_id: '',
			},
			labels: [],
			priority: '',
			station: '',
			due_date: ''
		};
		const {from} = $stateParams;
		if (from == "modal") {
			$scope.issue = ModalService.getIssue();
			ModalService.reset();
		}
		$scope.updateLabels = function(label) {
			console.log(label);
			$scope.issue.labels = label;
		};
		UserService.GetUsers(['full_name, email']).then(function(response) {
			const assignees = response.data;
			console.log('assignees', assignees);
			if (assignees.success) {
				$scope.assignees = assignees.data;
			}
		})
		IssueService.GetLabels().then(function(response) {
			console.log('labels', response);
			const labels = response.data;
			if (labels.success) {
				$scope.labels = labels.data;
			}
		});
		IssueService.GetPriorities().then(function(response) {
			const priorities = response.data;
			if (priorities.success) {
				$scope.priorities =  priorities.data;
			}
		})

		SiteService.GetSites().then(function(response) {
				const sites = response.data;
				$scope.sites = [];
				if (sites.success) {
					$scope.sites = sites.data;
					if ($scope.sites && $scope.sites.length > 0) {
						$scope.sites.map( function (site) {
							site.sitecode = site.SiteCode ? site.SiteCode.toLowerCase() : null;
							site.deviceid = site.DeviceId ? site.DeviceId.toLowerCase() : null;
							site.sitename = site.SiteName ? site.SiteName.toLowerCase() : null;
						});
					}
				} else {
					Toast.Danger(sites.message);
				}
			})

    $scope.querySearch   = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange   = searchTextChange;

    function querySearch (query) {
			let results = [];
			if ($scope.sites && $scope.sites.length > 0) {
      	results = query ? $scope.sites.filter( createFilterFor(query) ) : $scope.sites;
			}
			console.log("query search results for new issues", results);
      return results;
    }

    function createFilterFor(query) {
      const lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        return (item.sitecode && item.sitecode.indexOf(lowercaseQuery) === 0 ||
								item.deviceid && item.deviceid.indexOf(lowercaseQuery) === 0 ||
								item.sitename && item.sitename.indexOf(lowercaseQuery) === 0
				);
      };
    }

    function selectedItemChange(item) {
			console.log('Item changed to', item);
			if (item !== undefined) {
				$scope.issue.station = item.SiteCode;
				$scope.issue.deviceId = item.DeviceId;
			}
    }

    function searchTextChange(text) {
			$scope.issue.station = text;
    }

		$scope.cancel = function() {
			if (from == "modal") $state.go('dashboard', {from: "issues"});
			else $state.go('issues');
		}

		$scope.submitIssue = function(issue) {
			const {email} = issue.assignee;
			delete issue.assignee.email;
			IssueService.CreateIssue(issue).then(function(response) {
				const new_issue = response.data;
				if(new_issue.success) {
					Toast.Success(new_issue.message);
					const mail = {
						to: email,
						subject: 'You have been assigned a new ticket.',
						text: issue.opened_by.full_name+' has assigned you a new ticket. <br/> <strong>Due date:</strong> '+issue.due_date
					}
					EmailService.SendMail(mail).then(function(response) {
						const email = response.data;
						console.log('email response', email);
						if (email.success) {
							Toast.Success(email.message);
						} else {
							Toast.Danger(email.message);
						}
					});
					if (from == "modal") {
						$state.go('dashboard', {from: "issues"});
					} else {
						$state.go('issues');
					}
				} else {
					Toast.Danger(new_issue.message);
				}
			});
		};
}]);

App.controller('EditIssueCtrl', ['$scope', '$http', '$window', '$location', '$state', '$stateParams', '$log', '$q', 'IssueService', 'UserService', 'SiteService', 'Toast',
function ($scope, $http, $window, $location, $state, $stateParams, $log, $q, IssueService, UserService, SiteService, Toast) {
		const _id = $stateParams.id;
		$scope.id = _id;
		$scope.item = {
			"Country": null,
			"SiteID": null,
			"DeviceId": null,
			"SiteCode": null,
			"SiteName": null,
			"Latitude": null,
			"Longitude": null,
			"Elevation_m": null,
			"value": "altu"
		};
		IssueService.GetIssueById(_id).then(function(response) {
			const issue = response.data;
			console.log('edit issue', issue);
			if (issue.success) {
				$scope.issue = issue.data;
				$scope.issue.due_date = new Date($scope.issue.due_date);
				$scope.issue.ids = [_id];
				$scope.item.SiteCode = $scope.issue.station;
				$scope.item.DeviceId = $scope.issue.deviceId;
				selectedItemChange($scope.item);
			} else {
				Toast.Danger(issue.message);
			}
		});
		$scope.updateLabels = function(label) {
			$scope.issue.labels = label;
		};
		UserService.GetUsers(['full_name']).then(function(response) {
			const assignees = response.data;
			console.log('assignees', assignees);
			if (assignees.success) {
				$scope.assignees = assignees.data;
			}
		})
		IssueService.GetLabels().then(function(response) {
			console.log('labels', response);
			const labels = response.data;
			if (labels.success) {
				$scope.labels = labels.data;
			}
		});
		IssueService.GetPriorities().then(function(response) {
			const priorities = response.data;
			if (priorities.success) {
				$scope.priorities =  priorities.data;
			}
		})
    $scope.querySearch   = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange   = searchTextChange;

    function querySearch (query) {
			let results = [];
			if ($scope.sites && $scope.sites.length > 0) {
      	results = query ? $scope.sites.filter( createFilterFor(query) ) : $scope.sites;
			}
			console.log("query search results for edited issues", results);
      return results;
    }
    function createFilterFor(query) {
      const lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        return (item.sitecode && item.sitecode.indexOf(lowercaseQuery) === 0 ||
								item.deviceid && item.deviceid.indexOf(lowercaseQuery) === 0 ||
								item.sitename && item.sitename.indexOf(lowercaseQuery) === 0
				);
      };
    }

    function selectedItemChange(item) {
			console.log('Item changed to', item);
			if (item !== undefined) {
				$scope.issue.station = item.SiteCode;
				$scope.issue.deviceId = item.DeviceId;
			}
    }

    function searchTextChange(text) {
			$scope.issue.station = text;
    }

		SiteService.GetSites().then(function(response) {
			const sites = response.data;
			$scope.sites = [];
			if (sites.success) {
				$scope.sites = sites.data;
				if ($scope.sites && $scope.sites.length > 0) {
					$scope.sites.map( function (site) {
						site.sitecode = site.SiteCode ? site.SiteCode.toLowerCase() : null;
						site.deviceid = site.DeviceId ? site.DeviceId.toLowerCase() : null;
						site.sitename = site.SiteName ? site.SiteName.toLowerCase() : null;
					});
				}
			} else {
				Toast.Danger(sites.message);
			}
		});

		$scope.updateIssue = function(issue) {
			IssueService.UpdateIssues(issue).then(function(response) {
				const issue = response.data;
				if(issue.success) {
					Toast.Success(issue.message);
					$state.go('viewissues',{id: _id});
				} else {
					Toast.Danger(issue.message);
				}
			});
		};
		$scope.deleteIssue = function(issue) {
			IssueService.DeleteIssueById(issue._id).then(function(response) {
					const deleting = response.data;
					if(deleting.success) {
						Toast.Success(deleting.message);
						$window.console.log(response);
						$state.go('issues');
					} else {
						Toast.Danger(deleting.message);
					}
			});
		};
}]);

App.controller('DashboardCtrl', ['$scope', '$rootScope', '$localStorage', '$http', '$window', '$uibModal', '$state', '$stateParams', 'ModalService', 'SiteService',
	function ($scope, $rootScope, $localStorage, $http, $window, $uibModal, $state, $stateParams, ModalService, SiteService) {
				$scope.user = $rootScope.globals.currentUser.user;
				var from = $stateParams.from;
				var feature = ModalService.getModalInstance();
				if (from == "issues" && feature) {
					console.log('reopen modal');
					$uibModal.open({
						'templateUrl': 'assets/views/dashboard/map_popup.html',
						'controller': 'PopupCtrl',
						'size': 'lg',
						'resolve': {
							'feature': function () {
								return feature;
							}
						}
					})
				}
				/*
				 * Init Lealeft.js
				 */
				/*
				var working = L.AwesomeMarkers.icon({
						icon: 'circle',
						markerColor: 'green',
						prefix: 'fa'
				});
				var delay = L.AwesomeMarkers.icon({
						icon: 'circle',
						markerColor: 'orange',
						prefix: 'fa'
				});
				var broken = L.AwesomeMarkers.icon({
						icon: 'circle',
						markerColor: 'red',
						prefix: 'fa'
				});
				var icons = {
					'Active': working,
					'Delay': delay,
					'Closed': broken
				};

				*/
				$scope.sensorstate = function(state) {
					switch(state) {
						case 'Active':
								return '#71ae26';
						case 'Delay':
								return '#f0932f';
						case 'Closed':
								return '#d43e2a';
						default:
								return '#d43e2a';
					}
				}
				SiteService.GetSites("tahmo", "geojson").then(function(response) {
					const sites = response.data;
					if (sites.success) {
						angular.extend($scope, {
								geojson: {
										data: sites.data,
										pointToLayer: function(feature, latlng) {
												return new L.marker(latlng, {icon: icons[feature.properties['Station status']]});
										}
								},
								defaults: {
										scrollWheelZoom: false
								}
						});
						$scope.features = [];
						$scope.sensorcount = {
							active: 0,
							delay: 0,
							closed: 0,
						}
						for (var i in $scope.geojson.data.features) {
							if ($scope.geojson.data.features[i].properties['Station status'] == 'Active')
								$scope.sensorcount.active++;
							if ($scope.geojson.data.features[i].properties['Station status'] == 'Delay')
								$scope.sensorcount.delay++;
							if ($scope.geojson.data.features[i].properties['Station status'] == 'Closed')
								$scope.sensorcount.closed++;

							$scope.features.push($scope.geojson.data.features[i]);
						}
					} else {
						Toast.Danger(sites.message);
					}
				});
				/*
				$http.get("/api/sites?format=geojson").success(function(data, status) {
						angular.extend($scope, {
								geojson: {
										data: data.data,
										pointToLayer: function(feature, latlng) {
												return new L.marker(latlng, {icon: icons[feature.properties['Station status']]});
										}
								},
								defaults: {
										scrollWheelZoom: false
								}
						});
						$scope.features = [];
						$scope.sensorcount = {
							active: 0,
							delay: 0,
							closed: 0,
						}
						for (var i in $scope.geojson.data.features) {
							if ($scope.geojson.data.features[i].properties['Station status'] == 'Active')
								$scope.sensorcount.active++;
							if ($scope.geojson.data.features[i].properties['Station status'] == 'Delay')
								$scope.sensorcount.delay++;
							if ($scope.geojson.data.features[i].properties['Station status'] == 'Closed')
								$scope.sensorcount.closed++;

							$scope.features.push($scope.geojson.data.features[i]);
						}
				});
				*/
				$scope.details = function(type) {
					$scope.features = [];
					$scope.geometry = [];
						for (var i in $scope.geojson.data.features) {
							if ($scope.geojson.data.features[i].properties['Station status'] == type) {
								$scope.features.push($scope.geojson.data.features[i]);
							}
						}
						console.log('details');
						console.log($scope.features);
						$scope.$broadcast('center', type);
				};
				$scope.focus = function(geometry) {
						$scope.$broadcast('center-single', geometry);
				};
    }
]);

App.controller('PopupCtrl', ['$scope', '$uibModalInstance', '$location', '$state', 'feature', '$http', '$window', '$timeout', 'chart', 'ModalService',
	function ($scope,   $uibModalInstance, $location, $state, feature, $http, $window, $timeout, chart, ModalService) {
		//Default Value in Settings Tab
    $scope.feature = feature;
		$scope.site_name = feature.properties['Station ID'];
		var sitecode = feature.properties['Station ID'];
		var query = "/api/stationdata/"+sitecode+"?limit=1&type=sensorify";
		var initial = 0;
		$scope.data_point_limit = "10000";

    $scope.$uibModalInstance = $uibModalInstance;
		$scope.resize = function() {
			setTimeout(function(){ChartObj.reflow();}, 0);
			setTimeout(function(){$(window).resize();}, 0);
		}
    $scope.items = ["Display Graph", "Create Issue", "Issues Created"];
		$scope.checkbox_selected = [0, 1, 2];

		$scope.toggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) {
				list.splice(idx, 1);
			}
			else {
				list.push(item);
			}
		};
		$scope.exists = function (item, list) {
			return list.indexOf(item) > -1;
		};
		$scope.createIssue = function(index) {
			var issue = {
				title: $scope.sensor_name[index]+' Sensor - Failure Detected',
				description: 'QFlag: '+$scope.sensor_data[index].QFlag+' ('+$scope.sensor_data[index].QFlagText+')',
				assignee: '',
				labels: ["bug"],
				priority: "LOW",
				station: $scope.site_name,
				due_date: ''
			};
			ModalService.addIssue(issue);
			console.log(issue);
			$scope.$uibModalInstance.close();
			$state.go('newissues', {from: "modal"});
		}
		$scope.selected = function(index) {
			$scope.isSelected.map(function(item, key) {
				$scope.isSelected[key] = false;
			});
			$scope.isSelected[index] = true;
			console.log($scope.isSelected);
			console.log(index);
			while( ChartObj.series.length > 0 ) {
    		ChartObj.series[0].remove( false );
			}
			$http.get('api/stationdata/'+sitecode+'?type=graph&sensor='+$scope.sensor_id[index]+'&limit=10000').success(function (data) {
					console.log(data);
					var myChart = ChartObj;
					var mydata = {
							name: $scope.sensor_name[index],
							data: data,
							zones: [{
								value: 0,
								color: '#d43e2a'
							}],
							tooltip: {
									valueDecimals: 2,
									valueSuffix: $scope.sensor_unit[index]
							}
					};
					console.log('chart object after rendering');
					myChart.setTitle({text: $scope.sensor_name[index]});
					console.log(chart);
					console.log('chart object after changing');
					console.log("here's my chart again");
					console.log(ChartObj);
					myChart.addSeries(mydata);
					console.log(chart);
					myChart.reflow();
			});
		}
		$scope.sensors = ["temperature", "relative_humidity", "pressure", "precipitation", "radiation", "wind"];
		$scope.isSelected = [true, false, false, false, false, false];
		$scope.sensor_name = ["Temperature", "Relative Humidity", "Pressure", "Precipitation", "Radiation", "Wind"];
		$scope.sensor_id = ["TAIR", "RELH", "PRES", "RAIN", "SRAD", "WSPD"];
		$scope.sensor_unit = ["°C", "%", "mbar", "mm", "W/m^2", "mph"];
		$scope.hasData = false;
		console.log(query);
		$http.get(query).success(function(result, status) {
			$scope.sensor_data = result.data;
			$scope.hasData = result.data.length > 0;
			console.log(result);
		});
		$http.get('api/stationdata/'+sitecode+'?type=graph&sensor='+$scope.sensor_id[initial]+'&limit=10000').success(function (data) {
				console.log("fake data");
				console.log(data);
				var myChart = ChartObj;
				var mydata = {
						name: $scope.sensor_name[initial],
						data: data,
						zones: [{
							value: 0,
							color: '#d43e2a'
						}],
						tooltip: {
                valueDecimals: 2,
								valueSuffix: $scope.sensor_unit[initial]
            }
				};
				console.log('chart object after rendering');
				myChart.setTitle({text: $scope.sensor_name[initial]});
				console.log(chart);
				console.log('chart object after changing');
				console.log("here's my chart again");
				console.log(ChartObj);
				myChart.addSeries(mydata);
				console.log(chart);
				myChart.reflow();
		});
		$http.get('/api/issues/station/'+sitecode+'?&type=modified').then(function(response) {
			$scope.issues = response.data['data'];
			//$scope.tabs.openCount = response.data['count'];
		}, function(response) {
			console.log('my issues for', sitecode);
			console.log(response);
		});
  }
])

App.controller('leaflet', ['$scope', '$uibModal', '$http', 'ModalService', 'SiteService', function ($scope, $uibModal, $http, ModalService, SiteService) {
		var working = L.AwesomeMarkers.icon({
				icon: 'circle',
				markerColor: 'green',
				prefix: 'fa'
		});
		var delay = L.AwesomeMarkers.icon({
				icon: 'circle',
				markerColor: 'orange',
				prefix: 'fa'
		});
		var broken = L.AwesomeMarkers.icon({
				icon: 'circle',
				markerColor: 'red',
				prefix: 'fa'
		});
		var icons = {
			'Active': working,
			'Delay': delay,
			'Closed': broken
		};

		$scope.sensorstate = function(state) {
			switch(state) {
				case 'Active':
						return '#71ae26';
				case 'Delay':
						return '#f0932f';
				case 'Closed':
						return '#d43e2a';
				default:
						return '#d43e2a';
			}
		}
    $scope.openModal = function (event) {
			console.log('this is the event');
			console.log(event);
			var feature = event.layer.feature;
			$uibModal.open({
        'templateUrl': 'assets/views/dashboard/map_popup.html',
        'controller': 'PopupCtrl',
				'size': 'lg',
        'resolve': {
          'feature': function () {
            return feature;
          }
        }
      })
			ModalService.setModalInstance(feature);
    }
    $scope.$on('leaflet', function (event, leaflet) {
			SiteService.GetSites("tahmo", "geojson").then(function(response) {
				const sites = response.data;
				if (sites.success) {
					angular.extend($scope, {
							geojson: {
									data: sites.data,
							},
							defaults: {
									scrollWheelZoom: false
							}
					});
					$scope.features = [];
					var markers = L.markerClusterGroup({ chunkedLoading: true });
					var gg = $scope.geojson.data;
					mylayer = L.geoJSON(gg, {
						pointToLayer: function(feature, latlng) {
								return new L.marker(latlng, {icon: icons[feature.properties['Station status']]});
						}
					})
					mylayer.addTo(markers);
					markers.addTo(leaflet);
					mylayer.on('click', $scope.openModal);
					$scope.centerJSON = function (type="all") {
						mylayer.removeFrom(leaflet);
						mylayer = L.geoJSON(gg, {
							pointToLayer: function(feature, latlng) {
								var mymarker = null;
								if (feature.properties['Station status'] == type) {
									mymarker = new L.marker(latlng, {icon: icons[feature.properties['Station status']]});
								} else if (type == "all") {
									mymarker = new L.marker(latlng, {icon: icons[feature.properties['Station status']]});
								} else {
									mymarker = null;
								}
								return mymarker;
							}
						})
						mylayer.addTo(markers);
						markers.addTo(leaflet);
						mylayer.on('click', $scope.openModal);
						var latlngs = [];
						for (var i in $scope.geojson.data.features) {
								if ($scope.geojson.data.features[i].properties['Station status'] == type) {
									var points = $scope.geojson.data.features[i].geometry.coordinates;
									$scope.features.push($scope.geojson.data.features[i]);
									latlngs.push(L.GeoJSON.coordsToLatLng(points));
								}
								if (type=="all") {
									var points = $scope.geojson.data.features[i].geometry.coordinates;
									$scope.features.push($scope.geojson.data.features[i]);
									latlngs.push(L.GeoJSON.coordsToLatLng(points));
								}
						}
						if (latlngs.length > 0) {
							leaflet.fitBounds(latlngs);
						}
					}
					$scope.centerSingleJSON = function (coordinates) {
						var latlngs = [];
						latlngs.push(L.GeoJSON.coordsToLatLng(coordinates));
						if (latlngs.length > 0) {
							console.log("latlngs is:");
							console.log(latlngs);
							leaflet.fitBounds(latlngs);
						}
					}
					$scope.centerJSON();
				} else {
					Toast.Danger(sites.message);
				}
			});
    })
		$scope.$on('center', function(event, type) {
			console.log('this is the type');
			console.log(type);
			$scope.centerJSON(type);
		});
		$scope.$on('center-single', function(event, geometry) {
			$scope.centerSingleJSON(geometry.coordinates);
		});

  }
])

App.controller('highchart', ['$scope', '$http', function ($scope, $http) {
	console.log('my data');
	console.log($scope.data);
  }
])

App.directive('leaflet', [
  function () {
    return {
      link: function (scope, element, attributes) {
        scope.$broadcast('leaflet', new L.Map(element[0], {
          'center': [0, 0],
          'zoom': 0,
          'layers': [
            new L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            })
          ]
        }))
      }
    }
  }
])

App.directive('highchart', [
           'chart',
  function (chart) {
    return {
      'link': function (scope, element, attributes) {
        //var data = angular.extend(scope.data, chart)
				console.log("my element");
				var data = chart;
				setTimeout(function() {
					//ChartObj = $(element[0]).stockChart(data);
					ChartObj = new Highcharts.stockChart("chart-container", data);
					console.log(ChartObj);
				}, 0);
      }
    }
  }
])

App.value('chart', {
  chart: {
      type: "spline",
			events: {
				load: function() {
					console.log("my chart was loaded");
				},
				redraw: function() {
					console.log("my chart was redrawn");
				},
				render: function() {
					console.log("my chart was rendered");
				}
			}
  },
	rangeSelector: {

			buttons: [{
					type: 'day',
					count: 3,
					text: '3d'
			}, {
					type: 'week',
					count: 1,
					text: '1w'
			}, {
					type: 'month',
					count: 1,
					text: '1m'
			}, {
					type: 'month',
					count: 6,
					text: '6m'
			}, {
					type: 'year',
					count: 1,
					text: '1y'
			}, {
					type: 'all',
					text: 'All'
			}],
			selected: 3
	},
  xAxis: {
			crosshair: true,
      type: "datetime",
  },
})

// User Profile Controller
App.controller('ProfileCtrl', ['$rootScope', '$scope', '$http', '$stateParams', '$mdDialog', 'UserService', 'ProfileService',
    function ($rootScope, $scope, $http, $stateParams, $mdDialog, UserService, ProfileService) {
			console.log('user', $rootScope);
			if (!$stateParams.id) {
				$scope.id = $rootScope.globals.currentUser.id;
			} else {
				$scope.id = $stateParams.id;
			}
			$scope.user = {
				full_name: '_____',
				role: '_____'
			};
			$scope.my_users = {
				count: 0,
				data: [],
			}
			UserService.GetUserById($scope.id).then(function(response) {
				const result = response.data;
				$scope.user = result.data;
				$scope.isAuthorized = UserService.isAuthorized($scope.user.role);
				UserService.GetManagerUsers($scope.id, $scope.user.role).then(function(response) {
					const result = response.data;
					$scope.my_users.count = result.data.length;
					$scope.my_users.data = result.data;
				});
				bsDataTables();
				initDataTableFull($scope.id, $scope.user.role);
				jQuery('.js-dataTable-full-user').off().on('click','td', function() {
					var table = $('.js-dataTable-full-user').DataTable();
					var row_data = table.row(this).data();
					const column = table.cell(this).index().columnVisible;
					if (column == 3) {
						$scope.showTabDialog(this);
						ProfileService.addUser(row_data);
					}
					console.log('table cell', table.cell( this ).index().columnVisible);
					console.log('row data', table.row(this ).data());
				})
			});

      // ADD a station modal
				$scope.showTabDialog = function(ev) {
					$mdDialog.show({
						controller: DialogController,
						templateUrl: 'assets/views/settings/profile/add_user.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
					.then(function(answer) {
						$scope.status = 'You said the information was "' + answer + '".';
					}, function() {
						$scope.status = 'You cancelled the dialog.';
					});
				};
				function DialogController($scope, $http, $window, $mdDialog, UserService, AuthService, Toast, ProfileService, EmailService) {
					console.log('add_user_tmpl');
					$scope.user = {
						first_name: '',
						last_name: '',
						email: '',
						phone: '',
						manager: '',
						role: '',
					}
					$scope.temp_user = ProfileService.retrieveUser();
					if ($scope.temp_user && $scope.temp_user.edit) {
						$scope.user = $scope.temp_user;
					}
					UserService.GetManagers().then(function(response) {
						const result = response.data;
						$scope.managers = result.data;
						console.log('managers', $scope.managers);
					});
					UserService.GetRoles().then(function(response) {
						$scope.roles = response;
					});
					$scope.cancel = function() {
						$mdDialog.cancel();
						ProfileService.reset();
					};
					$scope.submit = function(user) {
						console.log('submitting user', user);
						if ((user.role == '' || user.role == 'agent') && user.manager == '') {
							Toast.Danger("If you leave the user field empty, the user role will be 'agent'. User with role 'agent' needs to be assigned to a manager");
						} else {
							if (user.edit) {
								console.log('editing');
								UserService.UpdateUser(user).then(function(response) {
									const updated_user = response.data;
									if (updated_user.success) {
										console.log('user updated', updated_user);
										Toast.Success(updated_user.message);
										$window.location.reload();
									} else {
										Toast.Danger(updated_user.message);
									}
								})
							} else {
								UserService.CreateUser(user).then(function(response) {
									const new_user = response.data;
									if (new_user.success) {
										Toast.Success(new_user.message);
										AuthService.CreateAccount({email: user.email})
										.then(function(response) {
											const new_account = response.data;
											if (new_account.success) {
												const mail = {
													to: new_user.data.email,
													subject: 'Your SensorDX Issue Tracker account has been created!',
													text: 'Your login info: <br/><br/><strong>Issue Tracker Website:</strong> https://tahmoissuetracker.mybluemix.net <br /> <strong>Email:</strong> '+new_user.data.email+'<br /><strong>Password:</strong> '+new_account.data,
												}
												EmailService.SendMail(mail).then(function(response) {
													const email = response.data;
													console.log('email response', email);
													if (email.success) {
														Toast.Success(email.message);
													} else {
														Toast.Danger(email.message);
													}
												});
												Toast.Success(new_account.message);
												$mdDialog.hide();
												ProfileService.reset();
												$window.location.reload();
											} else {
												Toast.Danger(new_account.message);
											}
										});
									} else {
										Toast.Danger(new_user.message);
									}
								});
							}
						}
					};
				}
				//==========================================
        var initDataTableFull = function(user_id, user_role) {
            var user_table = jQuery('.js-dataTable-full-user').DataTable({
								ajax: UserService.HttpUrlGetManagerUsers(user_id, user_role),
								destroy: true,
								"columnDefs": [ {
										"targets": -1,
										"render": function ( data, type, row, meta ) {
													return			"<a class=\"user-edit cursor-pointer\">"+
																					"<md-tooltip md-direction=\"left\">Add User</md-tooltip>"+
																					"<i class=\"fa fa-pencil\"></i> "+
																			"</a>";
										},
								},
								{
										"targets": 0,
										"render": function ( data, type, row, meta ) {
													return			"<div><a style=\"background-color: transparent; border-bottom: 0\" href=\"#/profile/"+row._id+"\">"+
																					"<img class=\"img-avatar\" src=\"assets/img/avatars/avatar3.jpg\" alt=\"\">"+
																					"<i class=\"fa fa-circle text-success\"></i> "+row.full_name+
																					"<div class=\"font-w400 text-muted\"><small>"+row.role+"</small></div>"+
																			"</a></div>";
										}
								},
								{ className: "nav-users push",  "targets": [ 0 ] },
								{ className: "users-edit text-center",  "targets": [ -1, 2, 0, 1 ] },
								],
								"order": [[3, 'desc']],
								"columns": [
									null,
									{ "data": "email" },
									{ "data": "temp_password" },
									{ "data": "updated_at", "visible": false},
									null,
								],
                pageLength: 10,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]]
            });
        };

        // DataTables Bootstrap integration
        var bsDataTables = function() {
            var DataTable = jQuery.fn.dataTable;

            // Set the defaults for DataTables init
            jQuery.extend( true, DataTable.defaults, {
                dom:
                    "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                renderer: 'bootstrap',
                oLanguage: {
                    sLengthMenu: "_MENU_",
                    sInfo: "Showing <strong>_START_</strong>-<strong>_END_</strong> of <strong>_TOTAL_</strong>",
                    oPaginate: {
                        sPrevious: '<i class="fa fa-angle-left"></i>',
                        sNext: '<i class="fa fa-angle-right"></i>'
                    }
                }
            });

            // Default class modification
            jQuery.extend(DataTable.ext.classes, {
                sWrapper: "dataTables_wrapper form-inline dt-bootstrap",
                sFilterInput: "form-control",
                sLengthSelect: "form-control"
            });

            // Bootstrap paging button renderer
            DataTable.ext.renderer.pageButton.bootstrap = function (settings, host, idx, buttons, page, pages) {
                var api     = new DataTable.Api(settings);
                var classes = settings.oClasses;
                var lang    = settings.oLanguage.oPaginate;
                var btnDisplay, btnClass;

                var attach = function (container, buttons) {
                    var i, ien, node, button;
                    var clickHandler = function (e) {
                        e.preventDefault();
                        if (!jQuery(e.currentTarget).hasClass('disabled')) {
                            api.page(e.data.action).draw(false);
                        }
                    };

                    for (i = 0, ien = buttons.length; i < ien; i++) {
                        button = buttons[i];

                        if (jQuery.isArray(button)) {
                            attach(container, button);
                        }
                        else {
                            btnDisplay = '';
                            btnClass = '';

                            switch (button) {
                                case 'ellipsis':
                                    btnDisplay = '&hellip;';
                                    btnClass = 'disabled';
                                    break;

                                case 'first':
                                    btnDisplay = lang.sFirst;
                                    btnClass = button + (page > 0 ? '' : ' disabled');
                                    break;

                                case 'previous':
                                    btnDisplay = lang.sPrevious;
                                    btnClass = button + (page > 0 ? '' : ' disabled');
                                    break;

                                case 'next':
                                    btnDisplay = lang.sNext;
                                    btnClass = button + (page < pages - 1 ? '' : ' disabled');
                                    break;

                                case 'last':
                                    btnDisplay = lang.sLast;
                                    btnClass = button + (page < pages - 1 ? '' : ' disabled');
                                    break;

                                default:
                                    btnDisplay = button + 1;
                                    btnClass = page === button ?
                                            'active' : '';
                                    break;
                            }

                            if (btnDisplay) {
                                node = jQuery('<li>', {
                                    'class': classes.sPageButton + ' ' + btnClass,
                                    'aria-controls': settings.sTableId,
                                    'tabindex': settings.iTabIndex,
                                    'id': idx === 0 && typeof button === 'string' ?
                                            settings.sTableId + '_' + button :
                                            null
                                })
                                .append(jQuery('<a>', {
                                        'href': '#'
                                    })
                                    .html(btnDisplay)
                                )
                                .appendTo(container);

                                settings.oApi._fnBindAction(
                                    node, {action: button}, clickHandler
                                );
                            }
                        }
                    }
                };

                attach(
                    jQuery(host).empty().html('<ul class="pagination"/>').children('ul'),
                    buttons
                );
            };

            // TableTools Bootstrap compatibility - Required TableTools 2.1+
            if (DataTable.TableTools) {
                // Set the classes that TableTools uses to something suitable for Bootstrap
                jQuery.extend(true, DataTable.TableTools.classes, {
                    "container": "DTTT btn-group",
                    "buttons": {
                        "normal": "btn btn-default",
                        "disabled": "disabled"
                    },
                    "collection": {
                        "container": "DTTT_dropdown dropdown-menu",
                        "buttons": {
                            "normal": "",
                            "disabled": "disabled"
                        }
                    },
                    "print": {
                        "info": "DTTT_print_info"
                    },
                    "select": {
                        "row": "active"
                    }
                });

                // Have the collection use a bootstrap compatible drop down
                jQuery.extend(true, DataTable.TableTools.DEFAULTS.oTags, {
                    "collection": {
                        "container": "ul",
                        "button": "li",
                        "liner": "a"
                    }
                });
            }
        };
    }
]);

// ALL MY SERVICES
App.service('ModalService', function() {
	var issue = {
		title: '',
		description: '',
		assignee: '',
		labels: [],
		priority: '',
		station: '',
		due_date: ''
	};

	var modalInstance = null;

	var setModalInstance = function(newModal) {
		modalInstance = newModal;
	}

	var getModalInstance = function(newModal) {
		return modalInstance;
	}

  var addIssue = function(newObj) {
      issue.title = newObj.title;
      issue.description = newObj.description;
			issue.assignee = newObj.assignee;
			issue.labels = newObj.labels;
			issue.station = newObj.station;
			issue.due_date = newObj.due_date;
  };

  var getIssue = function(){
      return issue;
  };

	var reset = function() {
		issue = {
			title: '',
			description: '',
			assignee: '',
			labels: [],
			priority: '',
			station: '',
			due_date: ''
		};
	}

  return {
    addIssue: addIssue,
    getIssue: getIssue,
		reset: reset,
		setModalInstance: setModalInstance,
		getModalInstance: getModalInstance
  };

});

App.service('ProfileService', function() {
	let profile_user = null;
	let service = {};
	var addUser = function(user) {
		profile_user = user;
		profile_user['edit'] = true;
	}

	var retrieveUser = function() {
		return profile_user;
	}

	var reset = function() {
		profile_user = null;
	}
	service.addUser = addUser;
	service.retrieveUser = retrieveUser;
	service.reset = reset;
	return service;
});
