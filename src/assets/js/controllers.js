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

App.controller('IssueCtrl', ['$scope', '$window', '$http', 'UserService', 'IssueService', 'SiteService', 'Toast',
function ($scope, $window, $http, UserService, IssueService, SiteService, Toast) {
		$scope.issue = {
			assignee: null,
			labels: [],
			ids: [],
			priority: null,
			station: null,
			status: null
		};
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

		$scope.isIndeterminate = function() {
			return ($scope.selected.length !== 0 &&
					$scope.selected.length !== $scope.items.length);
		};

		$scope.isChecked = function() {
			return $scope.selected.length === $scope.items.length;
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
			} else {
				Toast.Danger(sites.message);
			}
		});
		IssueService.GetIssues("open").then(function(response) {
			const issues = response.data;
			if (issues.success) {
				$scope.openIssues = issues.data;
				$scope.tabs.openCount = issues.count;
			} else {
				Toast.Danger(issues.message);
			}
		});
		IssueService.GetIssues("close").then(function(response) {
			const issues = response.data;
			if (issues.success) {
				$scope.closeIssues = issues.data;
				$scope.tabs.closeCount = issues.count;
			} else {
				Toast.Danger(issues.message);
			}
		});
		IssueService.GetIssues("").then(function(response) {
			const issues = response.data;
			if (issues.success) {
				$scope.allIssues = issues.data;
				$scope.tabs.allCount = issues.count;
			} else {
				Toast.Danger(issues.message);
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
}]);

App.controller('ViewIssueCtrl', ['$rootScope', '$scope', '$window', '$http', '$location', '$state', '$stateParams', '$sce', 'IssueService', 'CommentService', 'Toast',
function ($rootScope, $scope, $window, $http, $location, $state, $stateParams, $sce, IssueService, CommentService, Toast) {
		const _id = $stateParams.id;
		//const {_id, full_name} = $rootScope.globals.currentUser.user;
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

App.controller('NewIssueCtrl', ['$rootScope', '$scope', '$http', '$window', '$location', '$state', '$stateParams', '$log', '$q', 'ModalService', 'UserService', 'IssueService', 'SiteService', 'Toast',
	function ($rootScope, $scope, $http, $window, $location, $state, $stateParams, $log, $q, ModalService, UserService, IssueService, SiteService, Toast) {
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
      const results = query ? $scope.sites.filter( createFilterFor(query) ) : $scope.sites;
			console.log("query search results for new issues", results);
      return results;
    }

    function createFilterFor(query) {
      const lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };
    }

    function selectedItemChange(item) {
			console.log('Item changed to', item);
			if (item !== undefined) {
				$scope.issue.station = item.SiteCode;
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
						site.value = site.SiteCode.toLowerCase();
					});
				}
			} else {
				Toast.Danger(sites.message);
			}
		});

		$scope.cancel = function() {
			if (from == "modal") $state.go('dashboard', {from: "issues"});
			else $state.go('issues');
		}

		$scope.submitIssue = function(issue) {
			IssueService.CreateIssue(issue).then(function(response) {
				const issue = response.data;
				if(issue.success) {
					Toast.Success(issue.message);
					if (from == "modal") {
						$state.go('dashboard', {from: "issues"});
					} else {
						$state.go('issues');
					}
				} else {
					Toast.Danger(issue.message);
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
      const results = query ? $scope.sites.filter( createFilterFor(query) ) : $scope.sites;
			console.log("query search results for edited issues", results);
			return results;
    }
    function createFilterFor(query) {
      const lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };
    }

    function selectedItemChange(item) {
			console.log('Item changed to', item);
			if (item !== undefined) {
				$scope.issue.station = item.SiteCode;
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
						site.value = site.SiteCode.toLowerCase();
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

App.controller('DashboardCtrl', ['$scope', '$localStorage', '$http', '$window', '$uibModal', '$state', '$stateParams', 'ModalService',
	function ($scope, $localStorage, $http, $window, $uibModal, $state, $stateParams, ModalService) {
				var from = $stateParams.from;
				var feature = ModalService.getModalInstance();
				if (from == "issues" && feature) {
					console.log('reopen modal');
					$uibModal.open({
						'templateUrl': 'assets/views/map_popup.html',
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

				$http.get("/api/sites?type=geojson").success(function(data, status) {
						angular.extend($scope, {
								geojson: {
										data: data,
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

App.controller('leaflet', ['$scope', '$uibModal', '$http', 'ModalService', function ($scope, $uibModal, $http, ModalService) {
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
        'templateUrl': 'assets/views/map_popup.html',
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
			$http.get("/api/sites?type=geojson").success(function(data, status) {
					angular.extend($scope, {
							geojson: {
									data: data,
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
					//mylayer.addTo(leaflet);
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
						//mylayer.addTo(leaflet);
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

// Manage Stations Controller
App.controller('ManageStationsCtrl', ['$scope', '$localStorage', '$timeout', '$http', '$window', '$mdDialog',
    function ($scope, $localStorage, $timeout, $http, $window, $mdDialog) {
			/**
			 * ADD a station modal
			 */
				$scope.showTabDialog = function(ev) {
					$mdDialog.show({
						controller: DialogController,
						templateUrl: 'assets/views/add_station.tmpl.html',
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
				function DialogController($scope, $http, $mdDialog) {
					$scope.station = {
						id: '',
						name: '',
						lat: '',
						long: '',
						manager: '',
						sensors: []
					}
					$http.get('/api/users').then(function(response) {
						$scope.managers = response.data;
					}, function(error) {
						console.log(error);
					});
					$http.get('/api/sensors/types').then(function(response) {
						$scope.sensors = response.data;
					}, function(error) {
						console.log(error);
					});
					$scope.hide = function() {
						$mdDialog.hide();
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.answer = function(answer) {
						console.log('answer', answer);
						$mdDialog.hide(answer);
					};
				}
				//==========================================

        var initDataTableFull = function() {
            var station_table = jQuery('.js-dataTable-full').DataTable({
								ajax: '/api/sites?type=manage',
								"columnDefs": [ {
										"targets": -1,
										"data": null,
										"defaultContent": "<div class=\"text-center btn-group\">"+
																			"		<button class=\"btn btn-xs btn-default\" type=\"button\"><i class=\"fa fa-pencil\"></i></button>"+
																			"		<button class=\"btn btn-xs btn-default\" type=\"button\"><i class=\"fa fa-times\"></i></button>"+
																			"</div>"
								},
								{ className: "text-center",  "targets": [ 5 ] },
								{ className: "station-location",  "targets": [ 1 ] },
								{ className: "station-manager",  "targets": [ 2 ] },
								{ className: "station-issues",  "targets": [ 4 ] }
								],
								"columns": [
										{ "data": "SiteName" },
										{ "data": "Location" },
										{ "data": "Manager" },
										{ "data": "NumSensors" },
										{ "data": "NumSensors" },
										null
								],
                pageLength: 10,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]]
            });
						console.log(station_table);
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

        // Init Datatables
        bsDataTables();
        initDataTableFull();
    }
]);

// User Settings Controller
App.controller('SettingsCtrl', ['$scope', '$location', '$localStorage', '$timeout', '$http', '$window', '$mdDialog', '$stateParams', '$anchorScroll',
    function ($scope, $location, $localStorage, $timeout, $http, $window, $mdDialog, $stateParams, $anchorScroll) {
		$scope.loading = false;
		$scope.error = false;
		$scope.is_odm = false;
		$scope.db = {
			host: '',
			database: '',
			username: '',
			password: '',
			version: '',
			name: '',
		};
		$scope.databases = ['MySQL', 'Microsoft SQL Server'];
		$scope.versions = ['1.1', '1.1.1'];

		$scope.showODM = function() {
			$scope.is_odm = true;
			console.log('is_odm', $scope.is_odm);
		}
		$scope.cancel = function() {
			$scope.is_odm = false;
			console.log('is_odm', $scope.is_odm);
		}
		$scope.configure = function(db) {
			console.log('db info', db);
			$http.post('/api/db/connect', db)
				.then(function(response) {
					$window.console.log('success');
				},
				function(response) {
					$scope.error = true;
					setTimeout(function () {
							$scope.error = false;
							console.log('error', $scope.error);
					}, 2000);
					$window.console.log('error');
				})
		};
	}
]);

// User Profile Controller
App.controller('ProfileCtrl', ['$rootScope', '$scope', '$http', '$stateParams', '$mdDialog', 'UserService', 'ProfileService',
    function ($rootScope, $scope, $http, $stateParams, $mdDialog, UserService, ProfileService) {
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
					//jQuery('.user-edit').on('click', function(e) {
						//e.preventDefault();
					//});
				})
			});
			/**
			 * ADD a station modal
			 */
				$scope.showTabDialog = function(ev) {
					$mdDialog.show({
						controller: DialogController,
						templateUrl: 'assets/views/add_user.tmpl.html',
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
				function DialogController($scope, $http, $window, $mdDialog, UserService, AuthService, Toast, ProfileService) {
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
										console.log('new user created', new_user);
										Toast.Success(new_user.message);
										AuthService.CreateAccount({email: user.email})
										.then(function(response) {
											const new_account = response.data;
											if (new_account.success) {
												console.log('new account created', new_account);
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

        // Init Datatables
        //bsDataTables();
        //initDataTableFull();
    }
]);

// Components Charts Controller
App.controller('MapperCtrl', ['$scope', '$localStorage', '$window', '$mdDialog',
    function ($scope, $localStorage, $window, $mdDialog) {
			var data = [
				['Array', 'Object', 'Elevation_m'],
				['Array', 'Object', 'Latitude'],
				['Array', 'Object', 'Longitude', 'Object', 'Lat'],
				['Array', 'Object', 'Longitude', 'Object', 'Long'],
				['Array', 'Object', 'Sensors', 'Array', 'TAIR'],
				['Array', 'Object', 'Sensors', 'Array', 'PRES'],
				['Array', 'Object', 'Sensors', 'Array', 'SRAD'],
				['Array', 'Object', 'Sensors', 'Array', 'RELH'],
				['Array', 'Object', 'SiteCode'],
				['Array', 'Object', 'Manager'],
				['Array', 'Object', 'Sensors', 'Array', 'WSPD'],
				['Array', 'Object', 'Sensors', 'Array', 'RAIN']
			]
			var arr = new Array();
			var func = function (pos, data, result) {
				var arr = new Array();
				var obj = new Object();
				if (pos >= 8) {
					return; 
				}
				if (data[pos] == 'Array') {
					console.log('current pos value: ', pos);
					if (!(arr.includes(func(pos+1, data, result)))) {
						arr.push(func(pos+1, data, result))
					} else {
						console.log('element exist already in array');
					}
					console.log('value of arr after recursion', arr);
					return arr;
				}
				if (data[pos] == 'Object') {
					console.log('now object', data[pos+1]);
					obj[data[pos+1]] = func(pos+2, data, result)
					Object.assign(obj);
					console.log('value of obj after recursion', obj);
					return obj;
				}
				if (data[pos] != 'Array' && data['pos'] != 'Object') {
					console.log('no array/ no object value', data[pos]);
					return data[pos]
				}
			}

			var recurse = function (pos, data, array, obj) {
				if (pos >= data.length) {
					return;
				}
				if (data[pos] == "Array") {
					if (array == null || array.length <= 0) {
						console.log('first null');
						array = new Array();
						array.push(recurse(pos+1, data, array, obj));
						return array;
					} else {
						if (data[pos+1] == "Object") {
							console.log('handling object');
							recurse(pos+1, data, array, array[0]);
							return array;
						}
						if (data[pos+1] == "Array") {
							console.log('handling array');
							recurse(pos+1, data, array[0], obj);
							return array;
						}
						if (data[pos+1] != "Object" && data[pos+1] != "Array") {
							console.log('handling weird stuff');
							recurse(pos+1, data, array, obj);
							return array;
						}
					}
				}
				if (data[pos] == "Object") {
					if (obj == null) { obj = new Object()}
					if (obj.hasOwnProperty(data[pos+1])) {
						if (data[pos+2] == "Array") {
							console.log('more array');
							obj[data[pos+1]].push(recurse(pos+3, data, obj[data[pos+1]], obj));
						}
						return obj;
					} else {
						console.log('seetings'+data[pos+1]);
						obj[data[pos+1]] = recurse(pos+2, data, obj[data[pos+1]], obj)
						return obj;
					}
				}
				if (data[pos] != "Object" && data[pos] != "Array") {
						return data[pos]
				}
			}
			var arr = null;
			for (var i = 0; i < data.length; ++i) {
				arr = recurse(0, data[i], arr, null);
			}
			console.log('final', arr);
		
      hljs.initHighlighting();
			/**
			 * Show JSON
			 */
				$scope.showJSON = function(ev) {
					$mdDialog.show({
						locals: {type: ev},
						controller: DialogController,
						templateUrl: 'assets/views/json_mapper.tmpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
							.then(function(answer) {
								$scope.status = 'You said the information was "' + answer + '".';
								console.log($scope.status);
							}, function() {
								$scope.status = 'You cancelled the dialog.';
								console.log($scope.status);
							});
				};
				$scope.showSettings = function(ev) {
					$mdDialog.show({
						locals: {type: ev},
						controller: SettingsController,
						templateUrl: 'assets/views/mapper_settings.tmpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true
					})
							.then(function(answer) {
								$scope.status = 'You said the information was "' + answer + '".';
								console.log($scope.status);
							}, function() {
								$scope.status = 'You cancelled the dialog.';
								console.log($scope.status);
							});
				};
				function DialogController($scope, $mdDialog, $http, type) {
      		hljs.initHighlighting();
					var json = "";
					switch(type) {
						case 'issue': 
							json = "issues";
							break;
						case 'stations':
							json = "stations";
							break;
						case 'labels':
							json = "labels";
							break;
						case 'users':
							json = "users";
							break;
						case 'emails':
							json = "emails";
							break;
						default:
							json = "issues";
							break;
					}
					$http.get('/assets/json/mapper/'+json+'.json').then(function(response) {
						$scope.jsonObj = JSON.stringify(response.data, null, "  ");
					}, function(error) {
						console.log(error);
					});

					$scope.hide = function() {
						$mdDialog.hide();
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.answer = function(answer) {
						console.log('answer', answer);
						$mdDialog.hide(answer);
					};
				}
				function SettingsController($scope, $mdDialog, $http, type) {
					$scope.content = {
						filename: "",
						data: ""
					}
      		hljs.initHighlighting();
					$scope.url = "";
					var json = "";
					$scope.type = type;
					$scope.title = "";
					$scope.hidden = true;
					$scope.user_api = [];
					$scope.mapper = {};
					$scope.mapper[type] = {};
					switch(type) {
						case 'issue': 
							json = "issues";
							$scope.title = "Issues";
							break;
						case 'stations':
							json = "stations";
							$scope.title = "Stations";
							break;
						case 'labels':
							json = "labels";
							$scope.title = "Labels";
							break;
						case 'users':
							json = "users";
							$scope.title = "Users";
							break;
						case 'emails':
							json = "emails";
							$scope.title = "Emails";
							break;
						default:
							json = "issues";
							$scope.title = "Issues";
							break;
					}
					$scope.fetch = function(url) {
						if (!url || url == undefined) {
							$scope.hidden = true;
							return;
						}
						$scope.mapper['url'] = url;
						console.log('url -> ', url);
						$http.get(url).then(function(response) {
								console.log('my response', response);
								var my_array = new Array();
								$scope.$parent.helpers.apiProcessing(response.data, "", my_array);
								$scope.user_api = my_array;
								console.log($scope.user_api);
								$scope.hidden = false;
						}, function(error) {
								$scope.hidden = true;
								console.log('error ->', response.data);
						});
					};
					$http.get('/assets/json/mapper/'+json+'.json').then(function(response) {
						var my_array = new Array();
						$scope.$parent.helpers.apiProcessing(response.data, "", my_array);
						$scope.jsonObj = my_array;
						for (var i = 0; i < my_array.length; ++i) {
							if (my_array[i] != "None") $scope.mapper[$scope.type][my_array[i]] = "None";
						}
						console.log($scope.jsonObj);
					}, function(error) {
						console.log(error);
					});

					$scope.hide = function() {
						$mdDialog.hide();
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
						console.log('selected value', $scope.mapper);
					};

					$scope.setup = function() {
						$scope.$parent.helpers.saveMapper($scope.jsonObj, "stations");
						$scope.content['filename'] = "config/mapper/"+$scope.type+".json";
						$scope.content['data'] = JSON.stringify($scope.mapper);
						$http.post('/api/fs/write', $scope.content)
							.then(function(response) {
								console.log('success writing to file');
							},
							function(response) {
								console.log('error writing to file');
							})
							var my_array = new Array();
						for (key in $scope.mapper[$scope.type]) {
							console.log('my key: ', key);
							var data = key.split('.');
							console.log('data split', data);
							console.log('my array', my_array);
							$scope.$parent.helpers.stringToObj(0, 0, data, my_array);
							console.log('my array', my_array);
							//break;	
						}
						$mdDialog.hide();
					};
				}
				//==========================================

        // Randomize Easy Pie Chart values
        var initRandomEasyPieChart = function(){
            jQuery('.js-pie-randomize').on('click', function(){
                jQuery(this)
                    .parents('.block')
                    .find('.pie-chart')
                    .each(function() {
                        var random = Math.floor((Math.random() * 100) + 1);

                        jQuery(this)
                            .data('easyPieChart')
                            .update(random);
                    });
            });
        };

        // Randomize Easy Pie values functionality
        initRandomEasyPieChart();
    }
]);

// UI Elements Activity Controller
App.controller('UiActivityCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Preview page loader
        $scope.previewPageLoader = function () {
            $scope.helpers.uiLoader('show');

            setTimeout(function () {
                $scope.helpers.uiLoader('hide');
            }, 3000);
        };

        // Randomize progress bars values
        var barsRandomize = function(){
            jQuery('.js-bar-randomize').on('click', function(){
                jQuery(this)
                    .parents('.block')
                    .find('.progress-bar')
                    .each(function() {
                        var el   = jQuery(this);
                        var random = Math.floor((Math.random() * 91) + 10)  + '%';

                        el.css('width', random);

                        if ( ! el.parent().hasClass('progress-mini')) {
                            el.html(random);
                        }
                    });
                });
        };

        // SweetAlert, for more examples you can check out https://github.com/t4t5/sweetalert
        var sweetAlert = function(){
            // Init a simple alert on button click
            jQuery('.js-swal-alert').on('click', function(){
                swal('Hi, this is a simple alert!');
            });

            // Init an success alert on button click
            jQuery('.js-swal-success').on('click', function(){
                swal('Success', 'Everything updated perfectly!', 'success');
            });

            // Init an error alert on button click
            jQuery('.js-swal-error').on('click', function(){
                swal('Oops...', 'Something went wrong!', 'error');
            });

            // Init an example confirm alert on button click
            jQuery('.js-swal-confirm').on('click', function(){
                swal({
                    title: 'Are you sure?',
                    text: 'You will not be able to recover this imaginary file!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d26a5c',
                    confirmButtonText: 'Yes, delete it!',
                    closeOnConfirm: false,
                    html: false
                }, function () {
                    swal('Deleted!', 'Your imaginary file has been deleted.', 'success');
                });
            });
        };

        // Init randomize bar values
        barsRandomize();

        // Init SweetAlert
        sweetAlert();
    }
]);

// UI Elements Chat Controller
App.controller('UiChatCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Helper variables - set in initChat()
        var lWindow, lHeader, lFooter, cContainer, cHead, cTalk, cPeople, cform, cTimeout;

        // Init chat
        var initChat = function() {
            // Set variables
            lWindow    = jQuery(window);
            lHeader    = jQuery('#header-navbar');
            lFooter    = jQuery('#page-footer');
            cContainer = jQuery('.js-chat-container');
            cHead      = jQuery('.js-chat-head');
            cTalk      = jQuery('.js-chat-talk');
            cPeople    = jQuery('.js-chat-people');
            cform      = jQuery('.js-chat-form');

            // Add word wraping to chat content
            cTalk.css('word-wrap', 'break-word');

            // Chat layout mode
            switch (cContainer.data('chat-mode')) {
                case 'full':
                    // Init chat windows' height
                    initChatWindows();

                    // ..also on browser resize or orientation change
                    jQuery(window).on('resize orientationchange', function(){
                        clearTimeout(cTimeout);

                        cTimeout = setTimeout(function(){
                            initChatWindows();
                        }, 150);
                    });
                    break;
                case 'fixed':
                    // Init chat windows' height with a specific height
                    initChatWindows(cContainer.data('chat-height'));
                    break;
                case 'popup':
                    // Init chat windows' height with a specific height
                    initChatWindows(cContainer.data('chat-height'));

                    // Adjust chat container
                    cContainer.css({
                       'position': 'fixed',
                       'right': '10px',
                       'bottom': 0,
                       'display': 'inline-block',
                       'padding': 0,
                       'width': '70%',
                       'max-width': '420px',
                       'min-width': '300px',
                       'z-index': '1031'
                    });
                    break;
                default:
                    return false;
            }

            // Enable scroll lock to chat talk window
            cTalk.scrollLock('enable');

            // Init form submission
            cform.on('submit', function(e){
                // Stop form submission
                e.preventDefault();

                // Get chat input
                var chatInput  = jQuery('.js-chat-input', jQuery(this));

                // Add message
                chatAddMessage(chatInput.data('target-chat-id'), chatInput.val(), 'self', chatInput);
            });
        };

        // Init chat windows' height
        var initChatWindows = function(customHeight) {
            if (customHeight) {
                cHeight = customHeight;
            } else {
                // Calculate height
                var cHeight = lWindow.height() -
                        lHeader.outerHeight() -
                        lFooter.outerHeight() -
                        cHead.outerHeight() -
                        (parseInt(cContainer.css('padding-top')) + parseInt(cContainer.css('padding-bottom')));

                // Add a minimum height
                if (cHeight < 200) {
                    cHeight = 200;
                }
            }

            // Set height to chat windows (+ people window if exists)
            if (cPeople) {
                cPeople.css('height', cHeight);
            }

            cTalk.css('height', cHeight - cform.outerHeight());
        };

        // Add a message to a chat window
        var chatAddMessage = function(chatId, chatMsg, chatMsgLevel, chatInput) {
            // Get chat window
            var chatWindow = jQuery('.js-chat-talk[data-chat-id="' + chatId + '"]');

            // If message and chat window exists
            if (chatMsg && chatWindow.length) {
                var chatBlockClasses = 'animated fadeIn push-50-l';
                var chatMsgClasses   = 'bg-gray-lighter';

                // Post it to its related window (if message level is 'self', make it stand out)
                if (chatMsgLevel === 'self') {
                    chatBlockClasses   = 'animated fadeInUp push-50-r';
                    chatMsgClasses     = 'bg-gray-light';
                }

                chatWindow.append('<div class="block block-rounded block-transparent push-15 ' + chatBlockClasses + '">'
                        + '<div class="block-content block-content-full block-content-mini ' + chatMsgClasses + '">'
                        + jQuery('<div />').text(chatMsg).html()
                        + '</div>'
                        + '</div>');

                // Scroll the message list to the bottom
                chatWindow.animate({ scrollTop: chatWindow[0].scrollHeight }, 150);

                // If input is set, reset it
                if (chatInput) {
                    chatInput.val('');
                }
            }
        };

        // Init chat
        initChat();

        // Add Message
        $scope.addMessage = function(chatId, chatMsg, chatMsgLevel) {
            chatAddMessage(chatId, chatMsg, chatMsgLevel, false);
        };
    }
]);

// Tables DataTables Controller
App.controller('TablesDatatablesCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Init full DataTable, for more examples you can check out https://www.datatables.net/
        var initDataTableFull = function() {
            jQuery('.js-dataTable-full').dataTable({
                columnDefs: [ { orderable: false, targets: [ 4 ] } ],
                pageLength: 10,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]]
            });
        };

        // Init simple DataTable, for more examples you can check out https://www.datatables.net/
        var initDataTableSimple = function() {
            jQuery('.js-dataTable-simple').dataTable({
                columnDefs: [ { orderable: false, targets: [ 4 ] } ],
                pageLength: 10,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
                searching: false,
                oLanguage: {
                    sLengthMenu: ""
                },
                dom:
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-6'i><'col-sm-6'p>>"
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

        // Init Datatables
        bsDataTables();
        initDataTableSimple();
        initDataTableFull();
    }
]);

// Forms Pickers and More Controller
App.controller('FormsPickersMoreCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Init jQuery AutoComplete example, for more examples you can check out https://github.com/Pixabay/jQuery-autoComplete
        var initAutoComplete = function(){
            // Init autocomplete functionality
            jQuery('.js-autocomplete').autoComplete({
                minChars: 1,
                source: function(term, suggest){
                    term = term.toLowerCase();

                    var countriesList  = ['Afghanistan','Albania','Algeria','Andorra','Angola','Anguilla','Antigua &amp; Barbuda','Argentina','Armenia','Aruba','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bermuda','Bhutan','Bolivia','Bosnia &amp; Herzegovina','Botswana','Brazil','British Virgin Islands','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Cape Verde','Cayman Islands','Chad','Chile','China','Colombia','Congo','Cook Islands','Costa Rica','Cote D Ivoire','Croatia','Cruise Ship','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Estonia','Ethiopia','Falkland Islands','Faroe Islands','Fiji','Finland','France','French Polynesia','French West Indies','Gabon','Gambia','Georgia','Germany','Ghana','Gibraltar','Greece','Greenland','Grenada','Guam','Guatemala','Guernsey','Guinea','Guinea Bissau','Guyana','Haiti','Honduras','Hong Kong','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Jamaica','Japan','Jersey','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyz Republic','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macau','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Montserrat','Morocco','Mozambique','Namibia','Nepal','Netherlands','Netherlands Antilles','New Caledonia','New Zealand','Nicaragua','Niger','Nigeria','Norway','Oman','Pakistan','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Puerto Rico','Qatar','Reunion','Romania','Russia','Rwanda','Saint Pierre &amp; Miquelon','Samoa','San Marino','Satellite','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','South Africa','South Korea','Spain','Sri Lanka','St Kitts &amp; Nevis','St Lucia','St Vincent','St. Lucia','Sudan','Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor L\'Este','Togo','Tonga','Trinidad &amp; Tobago','Tunisia','Turkey','Turkmenistan','Turks &amp; Caicos','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Virgin Islands (US)','Yemen','Zambia','Zimbabwe'];
                    var suggestions    = [];

                    for (i = 0; i < countriesList.length; i++) {
                        if (~ countriesList[i].toLowerCase().indexOf(term)) suggestions.push(countriesList[i]);
                    }

                    suggest(suggestions);
                }
            });
        };

        // Init jQuery AutoComplete example
        initAutoComplete();
    }
]);

// Form Editors Controller
App.controller('FormsEditorsCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Disable auto init when contenteditable property is set to true
        CKEDITOR.disableAutoInline = true;

        // Init inline text editor
        if (jQuery('#js-ckeditor-inline').length) {
            CKEDITOR.inline('js-ckeditor-inline');
        }

        // Init full text editor
        if (jQuery('#js-ckeditor').length) {
            CKEDITOR.replace('js-ckeditor');
        }
    }
]);

// Forms Validation Controller
App.controller('FormsValidationCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Init Bootstrap Forms Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
        var initValidationBootstrap = function(){
            jQuery('.js-validation-bootstrap').validate({
                ignore: [],
                errorClass: 'help-block animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    var elem = jQuery(e);

                    elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                    elem.closest('.help-block').remove();
                },
                success: function(e) {
                    var elem = jQuery(e);

                    elem.closest('.form-group').removeClass('has-error');
                    elem.closest('.help-block').remove();
                },
                rules: {
                    'val-username': {
                        required: true,
                        minlength: 3
                    },
                    'val-email': {
                        required: true,
                        email: true
                    },
                    'val-password': {
                        required: true,
                        minlength: 5
                    },
                    'val-confirm-password': {
                        required: true,
                        equalTo: '#val-password'
                    },
                    'val-select2': {
                        required: true
                    },
                    'val-select2-multiple': {
                        required: true,
                        minlength: 2
                    },
                    'val-suggestions': {
                        required: true,
                        minlength: 5
                    },
                    'val-skill': {
                        required: true
                    },
                    'val-currency': {
                        required: true,
                        currency: ['$', true]
                    },
                    'val-website': {
                        required: true,
                        url: true
                    },
                    'val-phoneus': {
                        required: true,
                        phoneUS: true
                    },
                    'val-digits': {
                        required: true,
                        digits: true
                    },
                    'val-number': {
                        required: true,
                        number: true
                    },
                    'val-range': {
                        required: true,
                        range: [1, 5]
                    },
                    'val-terms': {
                        required: true
                    }
                },
                messages: {
                    'val-username': {
                        required: 'Please enter a username',
                        minlength: 'Your username must consist of at least 3 characters'
                    },
                    'val-email': 'Please enter a valid email address',
                    'val-password': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long'
                    },
                    'val-confirm-password': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long',
                        equalTo: 'Please enter the same password as above'
                    },
                    'val-select2': 'Please select a value!',
                    'val-select2-multiple': 'Please select at least 2 values!',
                    'val-suggestions': 'What can we do to become better?',
                    'val-skill': 'Please select a skill!',
                    'val-currency': 'Please enter a price!',
                    'val-website': 'Please enter your website!',
                    'val-phoneus': 'Please enter a US phone!',
                    'val-digits': 'Please enter only digits!',
                    'val-number': 'Please enter a number!',
                    'val-range': 'Please enter a number between 1 and 5!',
                    'val-terms': 'You must agree to the service terms!'
                }
            });
        };

        // Init Material Forms Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
        var initValidationMaterial = function(){
            jQuery('.js-validation-material').validate({
                ignore: [],
                errorClass: 'help-block text-right animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    var elem = jQuery(e);

                    elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                    elem.closest('.help-block').remove();
                },
                success: function(e) {
                    var elem = jQuery(e);

                    elem.closest('.form-group').removeClass('has-error');
                    elem.closest('.help-block').remove();
                },
                rules: {
                    'val-username2': {
                        required: true,
                        minlength: 3
                    },
                    'val-email2': {
                        required: true,
                        email: true
                    },
                    'val-password2': {
                        required: true,
                        minlength: 5
                    },
                    'val-confirm-password2': {
                        required: true,
                        equalTo: '#val-password2'
                    },
                    'val-select22': {
                        required: true
                    },
                    'val-select2-multiple2': {
                        required: true,
                        minlength: 2
                    },
                    'val-suggestions2': {
                        required: true,
                        minlength: 5
                    },
                    'val-skill2': {
                        required: true
                    },
                    'val-currency2': {
                        required: true,
                        currency: ['$', true]
                    },
                    'val-website2': {
                        required: true,
                        url: true
                    },
                    'val-phoneus2': {
                        required: true,
                        phoneUS: true
                    },
                    'val-digits2': {
                        required: true,
                        digits: true
                    },
                    'val-number2': {
                        required: true,
                        number: true
                    },
                    'val-range2': {
                        required: true,
                        range: [1, 5]
                    },
                    'val-terms2': {
                        required: true
                    }
                },
                messages: {
                    'val-username2': {
                        required: 'Please enter a username',
                        minlength: 'Your username must consist of at least 3 characters'
                    },
                    'val-email2': 'Please enter a valid email address',
                    'val-password2': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long'
                    },
                    'val-confirm-password2': {
                        required: 'Please provide a password',
                        minlength: 'Your password must be at least 5 characters long',
                        equalTo: 'Please enter the same password as above'
                    },
                    'val-select22': 'Please select a value!',
                    'val-select2-multiple2': 'Please select at least 2 values!',
                    'val-suggestions2': 'What can we do to become better?',
                    'val-skill2': 'Please select a skill!',
                    'val-currency2': 'Please enter a price!',
                    'val-website2': 'Please enter your website!',
                    'val-phoneus2': 'Please enter a US phone!',
                    'val-digits2': 'Please enter only digits!',
                    'val-number2': 'Please enter a number!',
                    'val-range2': 'Please enter a number between 1 and 5!',
                    'val-terms2': 'You must agree to the service terms!'
                }
            });
        };

        // Init Bootstrap Forms Validation
        initValidationBootstrap();

        // Init Material Forms Validation
        initValidationMaterial();

        // Init Validation on Select2 change
        jQuery('[data-js-select2]').on('change', function(){
            jQuery(this).valid();
        });
    }
]);

// Forms Wizard Controller
App.controller('FormsWizardCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Init simple wizard, for more examples you can check out http://vadimg.com/twitter-bootstrap-wizard-example/
        var initWizardSimple = function(){
            jQuery('.js-wizard-simple').bootstrapWizard({
                'tabClass': '',
                'firstSelector': '.wizard-first',
                'previousSelector': '.wizard-prev',
                'nextSelector': '.wizard-next',
                'lastSelector': '.wizard-last',
                'onTabShow': function(tab, navigation, index) {
                    var total      = navigation.find('li').length;
                    var current    = index + 1;
                    var percent    = (current/total) * 100;

                    // Get vital wizard elements
                    var wizard     = navigation.parents('.block');
                    var progress   = wizard.find('.wizard-progress > .progress-bar');
                    var btnPrev    = wizard.find('.wizard-prev');
                    var btnNext    = wizard.find('.wizard-next');
                    var btnFinish  = wizard.find('.wizard-finish');

                    // Update progress bar if there is one
                    if (progress) {
                        progress.css({ width: percent + '%' });
                    }

                    // If it's the last tab then hide the last button and show the finish instead
                    if(current >= total) {
                        btnNext.hide();
                        btnFinish.show();
                    } else {
                        btnNext.show();
                        btnFinish.hide();
                    }
                }
            });
        };

        // Init wizards with validation, for more examples you can check out http://vadimg.com/twitter-bootstrap-wizard-example/
        var initWizardValidation = function(){
            // Get forms
            var form1 = jQuery('.js-form1');
            var form2 = jQuery('.js-form2');

            // Prevent forms from submitting on enter key press
            form1.add(form2).on('keyup keypress', function (e) {
                var code = e.keyCode || e.which;

                if (code === 13) {
                    e.preventDefault();
                    return false;
                }
            });

            // Init form validation on classic wizard form
            var validator1 = form1.validate({
                errorClass: 'help-block animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                    jQuery(e).closest('.help-block').remove();
                },
                success: function(e) {
                    jQuery(e).closest('.form-group').removeClass('has-error');
                    jQuery(e).closest('.help-block').remove();
                },
                rules: {
                    'validation-classic-firstname': {
                        required: true,
                        minlength: 2
                    },
                    'validation-classic-lastname': {
                        required: true,
                        minlength: 2
                    },
                    'validation-classic-email': {
                        required: true,
                        email: true
                    },
                    'validation-classic-details': {
                        required: true,
                        minlength: 5
                    },
                    'validation-classic-city': {
                        required: true
                    },
                    'validation-classic-skills': {
                        required: true
                    },
                    'validation-classic-terms': {
                        required: true
                    }
                },
                messages: {
                    'validation-classic-firstname': {
                        required: 'Please enter a firstname',
                        minlength: 'Your firtname must consist of at least 2 characters'
                    },
                    'validation-classic-lastname': {
                        required: 'Please enter a lastname',
                        minlength: 'Your lastname must consist of at least 2 characters'
                    },
                    'validation-classic-email': 'Please enter a valid email address',
                    'validation-classic-details': 'Let us know a few thing about yourself',
                    'validation-classic-skills': 'Please select a skill!',
                    'validation-classic-terms': 'You must agree to the service terms!'
                }
            });

            // Init form validation on the other wizard form
            var validator2 = form2.validate({
                errorClass: 'help-block text-right animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                    jQuery(e).closest('.help-block').remove();
                },
                success: function(e) {
                    jQuery(e).closest('.form-group').removeClass('has-error');
                    jQuery(e).closest('.help-block').remove();
                },
                rules: {
                    'validation-firstname': {
                        required: true,
                        minlength: 2
                    },
                    'validation-lastname': {
                        required: true,
                        minlength: 2
                    },
                    'validation-email': {
                        required: true,
                        email: true
                    },
                    'validation-details': {
                        required: true,
                        minlength: 5
                    },
                    'validation-city': {
                        required: true
                    },
                    'validation-skills': {
                        required: true
                    },
                    'validation-terms': {
                        required: true
                    }
                },
                messages: {
                    'validation-firstname': {
                        required: 'Please enter a firstname',
                        minlength: 'Your firtname must consist of at least 2 characters'
                    },
                    'validation-lastname': {
                        required: 'Please enter a lastname',
                        minlength: 'Your lastname must consist of at least 2 characters'
                    },
                    'validation-email': 'Please enter a valid email address',
                    'validation-details': 'Let us know a few thing about yourself',
                    'validation-skills': 'Please select a skill!',
                    'validation-terms': 'You must agree to the service terms!'
                }
            });

            // Init classic wizard with validation
            jQuery('.js-wizard-classic-validation').bootstrapWizard({
                'tabClass': '',
                'previousSelector': '.wizard-prev',
                'nextSelector': '.wizard-next',
                'onTabShow': function(tab, nav, index) {
                    var total      = nav.find('li').length;
                    var current    = index + 1;

                    // Get vital wizard elements
                    var wizard     = nav.parents('.block');
                    var btnNext    = wizard.find('.wizard-next');
                    var btnFinish  = wizard.find('.wizard-finish');

                    // If it's the last tab then hide the last button and show the finish instead
                    if(current >= total) {
                        btnNext.hide();
                        btnFinish.show();
                    } else {
                        btnNext.show();
                        btnFinish.hide();
                    }
                },
                'onNext': function(tab, navigation, index) {
                    var valid = form1.valid();

                    if(!valid) {
                        validator1.focusInvalid();

                        return false;
                    }
                },
                onTabClick: function(tab, navigation, index) {
                    return false;
                }
            });

            // Init wizard with validation
            jQuery('.js-wizard-validation').bootstrapWizard({
                'tabClass': '',
                'previousSelector': '.wizard-prev',
                'nextSelector': '.wizard-next',
                'onTabShow': function(tab, nav, index) {
                    var total      = nav.find('li').length;
                    var current    = index + 1;

                    // Get vital wizard elements
                    var wizard     = nav.parents('.block');
                    var btnNext    = wizard.find('.wizard-next');
                    var btnFinish  = wizard.find('.wizard-finish');

                    // If it's the last tab then hide the last button and show the finish instead
                    if(current >= total) {
                        btnNext.hide();
                        btnFinish.show();
                    } else {
                        btnNext.show();
                        btnFinish.hide();
                    }
                },
                'onNext': function(tab, navigation, index) {
                    var valid = form2.valid();

                    if(!valid) {
                        validator2.focusInvalid();

                        return false;
                    }
                },
                onTabClick: function(tab, navigation, index) {
                    return false;
                }
            });
        };

        // Init simple wizard
        initWizardSimple();

        // Init wizards with validation
        initWizardValidation();
    }
]);

// Components Charts Controller
App.controller('CompChartsCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Chart.js Charts, for more examples you can check out http://www.chartjs.org/docs
        var initChartsChartJS = function () {
            // Get Chart Containers
            var chartLinesCon  = jQuery('.js-chartjs-lines')[0].getContext('2d');
            var chartBarsCon   = jQuery('.js-chartjs-bars')[0].getContext('2d');
            var chartRadarCon  = jQuery('.js-chartjs-radar')[0].getContext('2d');

            // Set Chart and Chart Data variables
            var chartLines, chartBars, chartRadar;
            var chartLinesBarsRadarData;

            // Set global chart options
            var globalOptions = {
                scaleFontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                scaleFontColor: '#999',
                scaleFontStyle: '600',
                tooltipTitleFontFamily: "'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                tooltipCornerRadius: 3,
                maintainAspectRatio: false,
                responsive: true
            };

            // Lines/Bar/Radar Chart Data
            var chartLinesBarsRadarData = {
                labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                datasets: [
                    {
                        label: 'Last Week',
                        fillColor: 'rgba(220,220,220,.3)',
                        strokeColor: 'rgba(220,220,220,1)',
                        pointColor: 'rgba(220,220,220,1)',
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(220,220,220,1)',
                        data: [30, 32, 40, 45, 43, 38, 55]
                    },
                    {
                        label: 'This Week',
                        fillColor: 'rgba(171, 227, 125, .3)',
                        strokeColor: 'rgba(171, 227, 125, 1)',
                        pointColor: 'rgba(171, 227, 125, 1)',
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(171, 227, 125, 1)',
                        data: [15, 16, 20, 25, 23, 25, 32]
                    }
                ]
            };

            // Init Charts
            chartLines = new Chart(chartLinesCon).Line(chartLinesBarsRadarData, globalOptions);
            chartBars  = new Chart(chartBarsCon).Bar(chartLinesBarsRadarData, globalOptions);
            chartRadar = new Chart(chartRadarCon).Radar(chartLinesBarsRadarData, globalOptions);
        };

        // jQuery Sparkline Charts, for more examples you can check out http://omnipotent.net/jquery.sparkline/#s-docs
        var initChartsSparkline = function(){
            // Bar Charts
            var barOptions = {
                type: 'bar',
                barWidth: 8,
                barSpacing: 6,
                height: '70px',
                barColor: '#fadb7d',
                tooltipPrefix: '',
                tooltipSuffix: ' Tickets',
                tooltipFormat: '{{prefix}}{{value}}{{suffix}}'
            };
            jQuery('.js-slc-bar1').sparkline('html', barOptions);

            barOptions['barColor']         = '#abe37d';
            barOptions['tooltipPrefix']    = '$ ';
            barOptions['tooltipSuffix']    = '';
            jQuery('.js-slc-bar2').sparkline('html', barOptions);

            barOptions['barColor']         = '#faad7d';
            barOptions['tooltipPrefix']    = '';
            barOptions['tooltipSuffix']    = ' Sales';
            jQuery('.js-slc-bar3').sparkline('html', barOptions);

            // Line Charts
            var lineOptions = {
                type: 'line',
                width: '120px',
                height: '70px',
                tooltipOffsetX: -25,
                tooltipOffsetY: 20,
                lineColor: '#fadb7d',
                fillColor: '#fadb7d',
                spotColor: '#777777',
                minSpotColor: '#777777',
                maxSpotColor: '#777777',
                highlightSpotColor: '#777777',
                highlightLineColor: '#777777',
                spotRadius: 2,
                tooltipPrefix: '',
                tooltipSuffix: ' Tickets',
                tooltipFormat: '{{prefix}}{{y}}{{suffix}}'
            };
            jQuery('.js-slc-line1').sparkline('html', lineOptions);

            lineOptions['lineColor']       = '#abe37d';
            lineOptions['fillColor']       = '#abe37d';
            lineOptions['tooltipPrefix']   = '$ ';
            lineOptions['tooltipSuffix']   = '';
            jQuery('.js-slc-line2').sparkline('html', lineOptions);

            lineOptions['lineColor']       = '#faad7d';
            lineOptions['fillColor']       = '#faad7d';
            lineOptions['tooltipPrefix']   = '';
            lineOptions['tooltipSuffix']   = ' Sales';
            jQuery('.js-slc-line3').sparkline('html', lineOptions);

            // Pie Charts
            var pieCharts = {
                type: 'pie',
                width: '50px',
                height: '50px',
                sliceColors: ['#fadb7d','#faad7d', '#75b0eb','#abe37d'],
                tooltipPrefix: '',
                tooltipSuffix: ' Tickets',
                tooltipFormat: '{{prefix}}{{value}}{{suffix}}'
            };
            jQuery('.js-slc-pie1').sparkline('html', pieCharts);

            pieCharts['tooltipPrefix'] = '$ ';
            pieCharts['tooltipSuffix'] = '';
            jQuery('.js-slc-pie2').sparkline('html', pieCharts);

            pieCharts['tooltipPrefix'] = '';
            pieCharts['tooltipSuffix'] = ' Sales';
            jQuery('.js-slc-pie3').sparkline('html', pieCharts);

            // Tristate Charts
            var tristateOptions = {
                type: 'tristate',
                barWidth: 8,
                barSpacing: 6,
                height: '80px',
                posBarColor: '#abe37d',
                negBarColor: '#faad7d'
            };
            jQuery('.js-slc-tristate1').sparkline('html', tristateOptions);
            jQuery('.js-slc-tristate2').sparkline('html', tristateOptions);
            jQuery('.js-slc-tristate3').sparkline('html', tristateOptions);
        };

        // Randomize Easy Pie Chart values
        var initRandomEasyPieChart = function(){
            jQuery('.js-pie-randomize').on('click', function(){
                jQuery(this)
                    .parents('.block')
                    .find('.pie-chart')
                    .each(function() {
                        var random = Math.floor((Math.random() * 100) + 1);

                        jQuery(this)
                            .data('easyPieChart')
                            .update(random);
                    });
            });
        };

        // Flot charts, for more examples you can check out http://www.flotcharts.org/flot/examples/
        var initChartsFlot = function(){
            // Get the elements where we will attach the charts
            var flotLines      = jQuery('.js-flot-lines');
            var flotStacked    = jQuery('.js-flot-stacked');
            var flotLive       = jQuery('.js-flot-live');
            var flotPie        = jQuery('.js-flot-pie');
            var flotBars       = jQuery('.js-flot-bars');

            // Demo Data
            var dataEarnings    = [[1, 2500], [2, 2300], [3, 3200], [4, 2500], [5, 4500], [6, 2800], [7, 3900], [8, 3100], [9, 4600], [10, 3200], [11, 4200], [12, 5700]];
            var dataSales       = [[1, 1100], [2, 700], [3, 1300], [4, 900], [5, 1900], [6, 950], [7, 1700], [8, 1250], [9, 1800], [10, 1300], [11, 1750], [12, 2900]];

            var dataSalesBefore = [[1, 500], [4, 390], [7, 1000], [10, 600], [13, 800], [16, 1050], [19, 1200], [22, 750], [25, 980], [28, 900], [31, 1350], [34, 1200]];
            var dataSalesAfter  = [[2, 650], [5, 600], [8, 1400], [11, 900], [14, 1300], [17, 1200], [20, 1420], [23, 1650], [26, 1300], [29, 1120], [32, 1550], [35, 1650]];

            var dataMonths      = [[1, 'Jan'], [2, 'Feb'], [3, 'Mar'], [4, 'Apr'], [5, 'May'], [6, 'Jun'], [7, 'Jul'], [8, 'Aug'], [9, 'Sep'], [10, 'Oct'], [11, 'Nov'], [12, 'Dec']];
            var dataMonthsBars  = [[2, 'Jan'], [5, 'Feb'], [8, 'Mar'], [11, 'Apr'], [14, 'May'], [17, 'Jun'], [20, 'Jul'], [23, 'Aug'], [26, 'Sep'], [29, 'Oct'], [32, 'Nov'], [35, 'Dec']];

            // Init lines chart
            jQuery.plot(flotLines,
                [
                    {
                        label: 'Earnings',
                        data: dataEarnings,
                        lines: {
                            show: true,
                            fill: true,
                            fillColor: {
                                colors: [{opacity: .7}, {opacity: .7}]
                            }
                        },
                        points: {
                            show: true,
                            radius: 6
                        }
                    },
                    {
                        label: 'Sales',
                        data: dataSales,
                        lines: {
                            show: true,
                            fill: true,
                            fillColor: {
                                colors: [{opacity: .5}, {opacity: .5}]
                            }
                        },
                        points: {
                            show: true,
                            radius: 6
                        }
                    }
                ],
                {
                    colors: ['#abe37d', '#333333'],
                    legend: {
                        show: true,
                        position: 'nw',
                        backgroundOpacity: 0
                    },
                    grid: {
                        borderWidth: 0,
                        hoverable: true,
                        clickable: true
                    },
                    yaxis: {
                        tickColor: '#ffffff',
                        ticks: 3
                    },
                    xaxis: {
                        ticks: dataMonths,
                        tickColor: '#f5f5f5'
                    }
                }
            );

            // Creating and attaching a tooltip to the classic chart
            var previousPoint = null, ttlabel = null;
            flotLines.bind('plothover', function(event, pos, item) {
                if (item) {
                    if (previousPoint !== item.dataIndex) {
                        previousPoint = item.dataIndex;

                        jQuery('.js-flot-tooltip').remove();
                        var x = item.datapoint[0], y = item.datapoint[1];

                        if (item.seriesIndex === 0) {
                            ttlabel = '$ <strong>' + y + '</strong>';
                        } else if (item.seriesIndex === 1) {
                            ttlabel = '<strong>' + y + '</strong> sales';
                        } else {
                            ttlabel = '<strong>' + y + '</strong> tickets';
                        }

                        jQuery('<div class="js-flot-tooltip flot-tooltip">' + ttlabel + '</div>')
                            .css({top: item.pageY - 45, left: item.pageX + 5}).appendTo("body").show();
                    }
                }
                else {
                    jQuery('.js-flot-tooltip').remove();
                    previousPoint = null;
                }
            });

            // Stacked Chart
            jQuery.plot(flotStacked,
                [
                    {
                        label: 'Sales',
                        data: dataSales
                    },
                    {
                        label: 'Earnings',
                        data: dataEarnings
                    }
                ],
                {
                    colors: ['#faad7d', '#fadb7d'],
                    series: {
                        stack: true,
                        lines: {
                            show: true,
                            fill: true
                        }
                    },
                    lines: {show: true,
                        lineWidth: 0,
                        fill: true,
                        fillColor: {
                            colors: [{opacity: 1}, {opacity: 1}]
                        }
                    },
                    legend: {
                        show: true,
                        position: 'nw',
                        sorted: true,
                        backgroundOpacity: 0
                    },
                    grid: {
                        borderWidth: 0
                    },
                    yaxis: {
                        tickColor: '#ffffff',
                        ticks: 3
                    },
                    xaxis: {
                        ticks: dataMonths,
                        tickColor: '#f5f5f5'
                    }
                }
            );

            // Live Chart
            var dataLive = [];

            function getRandomData() { // Random data generator

                if (dataLive.length > 0)
                    dataLive = dataLive.slice(1);

                while (dataLive.length < 300) {
                    var prev = dataLive.length > 0 ? dataLive[dataLive.length - 1] : 50;
                    var y = prev + Math.random() * 10 - 5;
                    if (y < 0)
                        y = 0;
                    if (y > 100)
                        y = 100;
                    dataLive.push(y);
                }

                var res = [];
                for (var i = 0; i < dataLive.length; ++i)
                    res.push([i, dataLive[i]]);

                // Show live chart info
                jQuery('.js-flot-live-info').html(y.toFixed(0) + '%');

                return res;
            }

            function updateChartLive() { // Update live chart
                chartLive.setData([getRandomData()]);
                chartLive.draw();
                setTimeout(updateChartLive, 70);
            }

            var chartLive = jQuery.plot(flotLive, // Init live chart
                [{ data: getRandomData() }],
                {
                    series: {
                        shadowSize: 0
                    },
                    lines: {
                        show: true,
                        lineWidth: 2,
                        fill: true,
                        fillColor: {
                            colors: [{opacity: .2}, {opacity: .2}]
                        }
                    },
                    colors: ['#75b0eb'],
                    grid: {
                        borderWidth: 0,
                        color: '#aaaaaa'
                    },
                    yaxis: {
                        show: true,
                        min: 0,
                        max: 110
                    },
                    xaxis: {
                        show: false
                    }
                }
            );

            updateChartLive(); // Start getting new data

            // Bars Chart
            jQuery.plot(flotBars,
                [
                    {
                        label: 'Sales Before',
                        data: dataSalesBefore,
                        bars: {
                            show: true,
                            lineWidth: 0,
                            fillColor: {
                                colors: [{opacity: 1}, {opacity: 1}]
                            }
                        }
                    },
                    {
                        label: 'Sales After',
                        data: dataSalesAfter,
                        bars: {
                            show: true,
                            lineWidth: 0,
                            fillColor: {
                                colors: [{opacity: 1}, {opacity: 1}]
                            }
                        }
                    }
                ],
                {
                    colors: ['#faad7d', '#fadb7d'],
                    legend: {
                        show: true,
                        position: 'nw',
                        backgroundOpacity: 0
                    },
                    grid: {
                        borderWidth: 0
                    },
                    yaxis: {
                        ticks: 3,
                        tickColor: '#f5f5f5'
                    },
                    xaxis: {
                        ticks: dataMonthsBars,
                        tickColor: '#f5f5f5'
                    }
                }
            );

            // Pie Chart
            jQuery.plot(flotPie,
                [
                    {
                        label: 'Sales',
                        data: 22
                    },
                    {
                        label: 'Tickets',
                        data: 22
                    },
                    {
                        label: 'Earnings',
                        data: 56
                    }
                ],
                {
                    colors: ['#fadb7d', '#75b0eb', '#abe37d'],
                    legend: {show: false},
                    series: {
                        pie: {
                            show: true,
                            radius: 1,
                            label: {
                                show: true,
                                radius: 2/3,
                                formatter: function(label, pieSeries) {
                                    return '<div class="flot-pie-label">' + label + '<br>' + Math.round(pieSeries.percent) + '%</div>';
                                },
                                background: {
                                    opacity: .75,
                                    color: '#000000'
                                }
                            }
                        }
                    }
                }
            );
        };

        // Init all charts
        initChartsChartJS();
        initChartsSparkline();
        initChartsFlot();

        // Randomize Easy Pie values functionality
        initRandomEasyPieChart();
    }
]);

// Components Calendar Controller
App.controller('CompCalendarCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Add new event in the event list
        var addEvent = function() {
            var eventInput      = jQuery('.js-add-event');
            var eventInputVal   = '';

            // When the add event form is submitted
            jQuery('.js-form-add-event').on('submit', function(){
                eventInputVal = eventInput.prop('value'); // Get input value

                // Check if the user entered something
                if ( eventInputVal ) {
                    // Add it to the events list
                    jQuery('.js-events')
                        .prepend('<li class="animated fadeInDown">' +
                                jQuery('<div />').text(eventInputVal).html() +
                                '</li>');

                    // Clear input field
                    eventInput.prop('value', '');

                    // Re-Init Events
                    initEvents();
                }

                return false;
            });
        };

        // Init drag and drop event functionality
        var initEvents = function() {
            jQuery('.js-events')
                .find('li')
                .each(function() {
                    var event = jQuery(this);

                    // create an Event Object
                    var eventObject = {
                        title: jQuery.trim(event.text()),
                        color: event.css('background-color') };

                    // store the Event Object in the DOM element so we can get to it later
                    jQuery(this).data('eventObject', eventObject);

                    // make the event draggable using jQuery UI
                    jQuery(this).draggable({
                        zIndex: 999,
                        revert: true,
                        revertDuration: 0
                    });
                });
        };

        // Init FullCalendar
        var initCalendar = function(){
            var date    = new Date();
            var d       = date.getDate();
            var m       = date.getMonth();
            var y       = date.getFullYear();

            jQuery('.js-calendar').fullCalendar({
                firstDay: 1,
                editable: true,
                droppable: true,
                header: {
                    left: 'title',
                    right: 'prev,next month,agendaWeek,agendaDay'
                },
                drop: function(date, allDay) { // this function is called when something is dropped
                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = jQuery(this).data('eventObject');

                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = jQuery.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    jQuery('.js-calendar').fullCalendar('renderEvent', copiedEventObject, true);

                    // remove the element from the "Draggable Events" list
                    jQuery(this).remove();
                },
                events: [
                    {
                        title: 'Free day',
                        start: new Date(y, m, 1),
                        allDay: true,
                        color: '#faeab9'
                    },
                    {
                        title: 'Skype Meeting',
                        start: new Date(y, m, 2)
                    },
                    {
                        title: 'Secret Project',
                        start: new Date(y, m, 5),
                        end: new Date(y, m, 8),
                        allDay: true,
                        color: '#fac5a5'
                    },
                    {
                        title: 'Work',
                        start: new Date(y, m, 9),
                        end: new Date(y, m, 11),
                        allDay: true,
                        color: '#fac5a5'
                    },
                    {
                        id: 999,
                        title: 'Biking (repeated)',
                        start: new Date(y, m, d - 3, 15, 0)
                    },
                    {
                        id: 999,
                        title: 'Biking (repeated)',
                        start: new Date(y, m, d + 2, 15, 0)
                    },
                    {
                        title: 'Landing Template',
                        start: new Date(y, m, d - 1),
                        end: new Date(y, m, d - 1),
                        allDay: true,
                        color: '#faeab9'
                    },
                    {
                        title: 'Lunch Meeting',
                        start: new Date(y, m, d + 5, 14, 00),
                        color: '#fac5a5'
                    },
                    {
                        title: 'Admin Template',
                        start: new Date(y, m, d, 9, 0),
                        end: new Date(y, m, d, 12, 0),
                        allDay: true,
                        color: '#faeab9'
                    },
                    {
                        title: 'Party',
                        start: new Date(y, m, 15),
                        end: new Date(y, m, 16),
                        allDay: true,
                        color: '#faeab9'
                    },
                    {
                        title: 'Reading',
                        start: new Date(y, m, d + 8, 21, 0),
                        end: new Date(y, m, d + 8, 23, 30),
                        allDay: true
                    },
                    {
                        title: 'Follow me on Twitter',
                        start: new Date(y, m, 23),
                        end: new Date(y, m, 25),
                        allDay: true,
                        url: 'http://twitter.com/pixelcave',
                        color: '#32ccfe'
                    }
                ]
            });
        };

        // Add Event functionality
        addEvent();

        // FullCalendar, for more examples you can check out http://fullcalendar.io/
        initEvents();
        initCalendar();
    }
]);

// Components Syntax Highlighting Controller
App.controller('CompSyntaxHighlightingCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Init HighlightJS
        hljs.initHighlighting();
    }
]);

// Components Rating Controller
App.controller('CompRatingCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // jQuery Raty, for more examples you can check out https://github.com/wbotelhos/raty

        // Init Rating
        var initRating = function(){
            // Set Default options
            jQuery.fn.raty.defaults.starType = 'i';
            jQuery.fn.raty.defaults.hints    = ['Bad', 'Poor', 'Regular', 'Good', 'Gorgeous'];

            // Init Raty on .js-rating class
            jQuery('.js-rating').each(function(){
                var ratingEl = jQuery(this);

                ratingEl.raty({
                    score: ratingEl.data('score') ? ratingEl.data('score') : 0,
                    number: ratingEl.data('number') ? ratingEl.data('number') : 5,
                    cancel: ratingEl.data('cancel') ? ratingEl.data('cancel') : false,
                    target: ratingEl.data('target') ? ratingEl.data('target') : false,
                    targetScore: ratingEl.data('target-score') ? ratingEl.data('target-score') : false,
                    precision: ratingEl.data('precision') ? ratingEl.data('precision') : false,
                    cancelOff: ratingEl.data('cancel-off') ? ratingEl.data('cancel-off') : 'fa fa-fw fa-times text-danger',
                    cancelOn: ratingEl.data('cancel-on') ? ratingEl.data('cancel-on') : 'fa fa-fw fa-times',
                    starHalf: ratingEl.data('star-half') ? ratingEl.data('star-half') : 'fa fa-fw fa-star-half-o text-warning',
                    starOff: ratingEl.data('star-off') ? ratingEl.data('star-off') : 'fa fa-fw fa-star text-gray',
                    starOn: ratingEl.data('star-on') ? ratingEl.data('star-on') : 'fa fa-fw fa-star text-warning',
                    click: function(score, evt) {
                        // Here you could add your logic on rating click
                        // console.log('ID: ' + this.id + "\nscore: " + score + "\nevent: " + evt);
                    }
                });
            });
        };

        // Init all Ratings
        initRating();
    }
]);

// Components Treeview Controller
App.controller('CompTreeviewCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Bootstrap Tree View, for more examples you can check out https://github.com/jonmiles/bootstrap-treeview

        // Init Tree Views
        var initTreeViews = function(){
            // Set default example tree data for all Tree Views
            var treeData = [
                {
                    text: 'Bootstrap',
                    href: '#parent1',
                    tags: ['4'],
                    nodes: [
                        {
                            text: 'eLearning',
                            href: '#child1',
                            tags: ['2'],
                            nodes: [
                                {
                                    text: 'Code',
                                    href: '#grandchild1'
                                },
                                {
                                    text: 'Tutorials',
                                    href: '#grandchild2'
                                }
                            ]
                        },
                        {
                            text: 'Templates',
                            href: '#child2'
                        },
                        {
                            text: 'CSS',
                            href: '#child3',
                            tags: ['2'],
                            nodes: [
                                {
                                    text: 'Less',
                                    href: '#grandchild3'
                                },
                                {
                                    text: 'SaSS',
                                    href: '#grandchild4'
                                }
                            ]
                        }
                    ]
                },
                {
                    text: 'Design',
                    href: '#parent3'
                },
                {
                    text: 'Coding',
                    href: '#parent4'
                },
                {
                    text: 'Marketing',
                    href: '#parent5'
                }
            ];

            // Init Simple Tree
            jQuery('.js-tree-simple').treeview({
                data: treeData,
                color: '#555',
                expandIcon: 'fa fa-plus',
                collapseIcon: 'fa fa-minus',
                onhoverColor: '#f9f9f9',
                selectedColor: '#555',
                selectedBackColor: '#f1f1f1',
                showBorder: false,
                levels: 3
            });

            // Init Icons Tree
            jQuery('.js-tree-icons').treeview({
                data: treeData,
                color: '#555',
                expandIcon: 'fa fa-plus',
                collapseIcon: 'fa fa-minus',
                nodeIcon: 'fa fa-folder text-primary',
                onhoverColor: '#f9f9f9',
                selectedColor: '#555',
                selectedBackColor: '#f1f1f1',
                showBorder: false,
                levels: 3
            });

            // Init Alternative Icons Tree
            jQuery('.js-tree-icons-alt').treeview({
                data: treeData,
                color: '#555',
                expandIcon: 'fa fa-angle-down',
                collapseIcon: 'fa fa-angle-up',
                nodeIcon: 'fa fa-file-o text-city',
                onhoverColor: '#f9f9f9',
                selectedColor: '#555',
                selectedBackColor: '#f1f1f1',
                showBorder: false,
                levels: 3
            });

            // Init Badges Tree
            jQuery('.js-tree-badges').treeview({
                data: treeData,
                color: '#555',
                expandIcon: 'fa fa-plus',
                collapseIcon: 'fa fa-minus',
                nodeIcon: 'fa fa-folder text-primary',
                onhoverColor: '#f9f9f9',
                selectedColor: '#555',
                selectedBackColor: '#f1f1f1',
                showTags: true,
                levels: 3
            });

            // Init Collapsed Tree
            jQuery('.js-tree-collapsed').treeview({
                data: treeData,
                color: '#555',
                expandIcon: 'fa fa-plus',
                collapseIcon: 'fa fa-minus',
                nodeIcon: 'fa fa-folder text-primary-light',
                onhoverColor: '#f9f9f9',
                selectedColor: '#555',
                selectedBackColor: '#f1f1f1',
                showTags: true,
                levels: 1
            });

            // Set example JSON data for JSON Tree View
            var treeDataJson = '[' +
              '{' +
                '"text": "Bootstrap",' +
                '"nodes": [' +
                  '{' +
                    '"text": "eLearning",' +
                    '"nodes": [' +
                      '{' +
                        '"text": "Code"' +
                      '},' +
                      '{' +
                        '"text": "Tutorials"' +
                      '}' +
                    ']' +
                  '},' +
                  '{' +
                    '"text": "Templates"' +
                  '},' +
                  '{' +
                    '"text": "CSS",' +
                    '"nodes": [' +
                      '{' +
                        '"text": "Less"' +
                      '},' +
                      '{' +
                        '"text": "SaSS"' +
                      '}' +
                    ']' +
                  '}' +
                ']' +
              '},' +
              '{' +
                '"text": "Design"' +
              '},' +
              '{' +
                '"text": "Coding"' +
              '},' +
              '{' +
                '"text": "Marketing"' +
              '}' +
            ']';

            // Init Json Tree
            jQuery('.js-tree-json').treeview({
                data: treeDataJson,
                color: '#555',
                expandIcon: 'fa fa-arrow-down',
                collapseIcon: 'fa fa-arrow-up',
                nodeIcon: 'fa fa-file-code-o text-flat',
                onhoverColor: '#f9f9f9',
                selectedColor: '#555',
                selectedBackColor: '#f1f1f1',
                showTags: true,
                levels: 3
            });
        };

        // Init all Tree Views
        initTreeViews();
    }
]);

// Components Maps Google Controller
App.controller('CompMapsGoogleCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Gmaps.js, for more examples you can check out https://hpneo.github.io/gmaps/

        // Init Search Map
        var initMapSearch = function(){
            // Init Map
            var mapSearch = new GMaps({
                div: '#js-map-search',
                lat: 20,
                lng: 0,
                zoom: 2,
                scrollwheel: false
            });

            // When the search form is submitted
            jQuery('.js-form-search').on('submit', function(){
                GMaps.geocode({
                    address: jQuery('.js-search-address').val().trim(),
                    callback: function (results, status) {
                        if ((status === 'OK') && results) {
                            var latlng = results[0].geometry.location;

                            mapSearch.removeMarkers();
                            mapSearch.addMarker({ lat: latlng.lat(), lng: latlng.lng() });
                            mapSearch.fitBounds(results[0].geometry.viewport);
                        } else {
                            alert('Address not found!');
                        }
                    }
                });

                return false;
            });
        };

        // Init Satellite Map
        var initMapSat = function(){
            new GMaps({
                div: '#js-map-sat',
                lat: 0,
                lng: 0,
                zoom: 1,
                scrollwheel: false
            }).setMapTypeId(google.maps.MapTypeId.SATELLITE);
        };

        // Init Terrain Map
        var initMapTer = function(){
            new GMaps({
                div: '#js-map-ter',
                lat: 0,
                lng: 0,
                zoom: 1,
                scrollwheel: false
            }).setMapTypeId(google.maps.MapTypeId.TERRAIN);
        };

        // Init Overlay Map
        var initMapOverlay = function(){
            new GMaps({
                div: '#js-map-overlay',
                lat: 37.7577,
                lng: -122.4376,
                zoom: 11,
                scrollwheel: false
            }).drawOverlay({
                lat: 37.7577,
                lng: -122.4376,
                content: '<div class="alert alert-danger alert-dismissable"><h4 class="push-15">Overlay Message</h4><p class="push-10">You can overlay messages on your maps!</p></div>'
            });
        };

        // Init Markers Map
        var initMapMarkers = function(){
            new GMaps({
                div: '#js-map-markers',
                lat: 37.7577,
                lng: -122.4376,
                zoom: 11,
                scrollwheel: false
            }).addMarkers([
                {lat: 37.70, lng: -122.49, title: 'Marker #1', animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>Marker #1</strong>'}},
                {lat: 37.76, lng: -122.46, title: 'Marker #2', animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>Marker #2</strong>'}},
                {lat: 37.72, lng: -122.41, title: 'Marker #3', animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>Marker #3</strong>'}},
                {lat: 37.78, lng: -122.39, title: 'Marker #4', animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>Marker #4</strong>'}},
                {lat: 37.74, lng: -122.46, title: 'Marker #5', animation: google.maps.Animation.DROP, infoWindow: {content: '<strong>Marker #5</strong>'}}
            ]);
        };

        // Init Street Map
        var initMapStreet = function(){
            new GMaps.createPanorama({
                el: '#js-map-street',
                lat: 37.809345,
                lng: -122.475825,
                pov: {heading: 340.91, pitch: 4},
                scrollwheel: false
            });
        };

        // Init Geolocation Map
        var initMapGeo = function(){
            var gmapGeolocation = new GMaps({
                div: '#js-map-geo',
                lat: 0,
                lng: 0,
                scrollwheel: false
            });

            GMaps.geolocate({
                success: function(position) {
                    gmapGeolocation.setCenter(position.coords.latitude, position.coords.longitude);
                    gmapGeolocation.addMarker({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        animation: google.maps.Animation.DROP,
                        title: 'GeoLocation',
                        infoWindow: {
                            content: '<div class="text-success"><i class="fa fa-map-marker"></i> <strong>Your location!</strong></div>'
                        }
                    });
                },
                error: function(error) {
                    alert('Geolocation failed: ' + error.message);
                },
                not_supported: function() {
                    alert("Your browser does not support geolocation");
                },
                always: function() {
                    // Message when geolocation succeed
                }
            });
        };

        // Init Map with Search functionality
        initMapSearch();

        // Init Example Maps
        initMapSat();
        initMapTer();
        initMapOverlay();
        initMapMarkers();
        initMapStreet();
        initMapGeo();
    }
]);

// Components Maps Google Full Controller
App.controller('CompMapsGoogleFullCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // Gmaps.js, for more examples you can check out https://hpneo.github.io/gmaps/

        // Init Full Map
        var initMapFull = function(){
            var mainCon    = jQuery('#main-container');
            var mlat       = 37.7577;
            var mlong      = -122.4376;
            var rTimeout;

            // Set #main-container position to be relative
            mainCon.css('position', 'relative');

            // Adjust map container position
            jQuery('#js-map-full').css({
                'position': 'absolute',
                'top': mainCon.css('padding-top'),
                'right': '0',
                'bottom': '0',
                'left': '0',
                'height': '100%'
            });

            // Init map itself
            var mapFull = new GMaps({
                div: '#js-map-full',
                lat: mlat,
                lng: mlong,
                zoom: 11
            });

            // Set map type
            mapFull.setMapTypeId(google.maps.MapTypeId.TERRAIN);

            // Resize and center the map on browser window resize
            jQuery(window).on('resize orientationchange', function(){
                clearTimeout(rTimeout);

                rTimeout = setTimeout(function(){
                    mapFull.refresh();
                    mapFull.setCenter(mlat, mlong);
                }, 150);
            });

            // Trigger a resize to refresh the map (helps for proper rendering because we dynamically change the height of map's container)
            jQuery(window).resize();
        };

        // Init Full Map
        initMapFull();
    }
]);

// Components Maps Vector Controller
App.controller('CompMapsVectorCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // jVectorMap, for more examples you can check out http://jvectormap.com/documentation/

        // Set default options for all maps
        var mapOptions = {
            container: '',
            map: '',
            backgroundColor: '#ffffff',
            regionStyle: {
                initial: {
                    fill: '#5490d2',
                    'fill-opacity': 1,
                    stroke: 'none',
                    'stroke-width': 0,
                    'stroke-opacity': 1
                },
                hover: {
                    'fill-opacity': .8,
                    cursor: 'pointer'
                }
            }
        };

        // Maps variables
        var mapWorld, mapEurope, mapUsa, mapIndia, mapChina, mapAustralia, mapSouthAfrica, mapFrance, mapGermany;

        // Init World Map
        var initMapWorld = function(){
            // Set Active Map and Container
            mapOptions['map']       = 'world_mill_en';
            mapOptions['container'] = jQuery('.js-vector-map-world');

            // Init Map
            mapWorld = new jvm.Map(mapOptions);
        };

        // Init Europe Map
        var initMapEurope = function(){
            // Set Active Map and Container
            mapOptions['map']       = 'europe_mill_en';
            mapOptions['container'] = jQuery('.js-vector-map-europe');


            // Init Map
            mapEurope = new jvm.Map(mapOptions);
        };

        // Init USA Map
        var initMapUsa = function(){
            // Set Active Map and Container
            mapOptions['map']       = 'us_aea_en';
            mapOptions['container'] = jQuery('.js-vector-map-usa');

            // Init Map
            mapUsa = new jvm.Map(mapOptions);
        };

        // Init India Map
        var initMapIndia = function(){
            // Set Active Map and Container
            mapOptions['map']       = 'in_mill_en';
            mapOptions['container'] = jQuery('.js-vector-map-india');

            // Init Map
            mapIndia = new jvm.Map(mapOptions);
        };

        // Init China Map
        var initMapChina = function(){
            // Set Active Map and Container
            mapOptions['map']       = 'cn_mill_en';
            mapOptions['container'] = jQuery('.js-vector-map-china');

            // Init Map
            mapChina = new jvm.Map(mapOptions);
        };

        // Init Australia Map
        var initMapAustralia = function(){
            // Set Active Map and Container
            mapOptions['map']       = 'au_mill_en';
            mapOptions['container'] = jQuery('.js-vector-map-australia');

            // Init Map
            mapAustralia = new jvm.Map(mapOptions);
        };

        // Init South Africa Map
        var initMapSouthAfrica = function(){
            // Set Active Map and Container
            mapOptions['map']       = 'za_mill_en';
            mapOptions['container'] = jQuery('.js-vector-map-south-africa');

            // Init Map
            mapSouthAfrica = new jvm.Map(mapOptions);
        };

        // Init France Map
        var initMapFrance = function(){
            // Set Active Map and Container
            mapOptions['map']       = 'fr_mill_en';
            mapOptions['container'] = jQuery('.js-vector-map-france');

            // Init Map
            mapFrance = new jvm.Map(mapOptions);
        };

        // Init Germany Map
        var initMapGermany = function(){
            // Set Active Map and Container
            mapOptions['map']       = 'de_mill_en';
            mapOptions['container'] = jQuery('.js-vector-map-germany');

            // Init Map
            mapGermany = new jvm.Map(mapOptions);
        };

        // Init Example Maps
        initMapWorld();
        initMapEurope();
        initMapUsa();
        initMapIndia();
        initMapChina();
        initMapAustralia();
        initMapSouthAfrica();
        initMapFrance();
        initMapGermany();

        // When leaving the page remove maps resize event (causes JS errors in other pages)
        $scope.$on('$stateChangeStart', function(event) {
            jQuery(window).unbind('resize', mapWorld.onResize);
            jQuery(window).unbind('resize', mapEurope.onResize);
            jQuery(window).unbind('resize', mapUsa.onResize);
            jQuery(window).unbind('resize', mapIndia.onResize);
            jQuery(window).unbind('resize', mapChina.onResize);
            jQuery(window).unbind('resize', mapAustralia.onResize);
            jQuery(window).unbind('resize', mapSouthAfrica.onResize);
            jQuery(window).unbind('resize', mapFrance.onResize);
            jQuery(window).unbind('resize', mapGermany.onResize);
        });

        // When returning to the page re-enable maps resize functionality
        $scope.$on('$stateChangeSuccess', function(event) {
            jQuery(window).resize(mapWorld.onResize);
            jQuery(window).resize(mapEurope.onResize);
            jQuery(window).resize(mapUsa.onResize);
            jQuery(window).resize(mapIndia.onResize);
            jQuery(window).resize(mapChina.onResize);
            jQuery(window).resize(mapAustralia.onResize);
            jQuery(window).resize(mapSouthAfrica.onResize);
            jQuery(window).resize(mapFrance.onResize);
            jQuery(window).resize(mapGermany.onResize);
        });
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
