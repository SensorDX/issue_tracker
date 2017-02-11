/*
 *  Document   : controllers.js
 *  Author     : pixelcave
 *  Description: Our example controllers for demo pages
 *
 */

// Dashboard Content Controller
App.controller('DashboardCtrl', ['$scope', '$localStorage', '$http', '$window', function ($scope, $localStorage, $http, $window) {
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
						default:
								return '#d43e2a'; 
					}
				}
				/*
        $scope.centerJSON = function() {
					leafletData.getMap().then(function(map) {
						var latlngs = [];
						$scope.properties = [];
						for (var i in $scope.geojson.data.features) {
							var points = $scope.geojson.data.features[i].geometry.coordinates;
							$scope.properties.push($scope.geojson.data.features[i].properties);
							latlngs.push(L.GeoJSON.coordsToLatLng(points));
						}
						map.fitBounds(latlngs);
					});
        };
				*/

				$http.get("assets/data/geojson/africa_station.geojson").success(function(data, status) {
						angular.extend($scope, {
								geojson: {
										data: data,
										style:
											function (feature) {return {};},
											pointToLayer: function(feature, latlng) {
													return new L.marker(latlng, {icon: icons[feature.properties['Station status']]});
											},
											onEachFeature: function (feature, layer) {
													layer.bindPopup("Hello World!");
											}
								},
								defaults: {
										scrollWheelZoom: false
								}
						});
						$scope.properties = [];
						for (var i in $scope.geojson.data.features) {
							var points = $scope.geojson.data.features[i].geometry.coordinates;
							$scope.properties.push($scope.geojson.data.features[i].properties);
						}
				});
			
    }
]);

App.controller('leaflet', ['$scope', '$uibModal', '$http', function ($scope, $uibModal, $http) {
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
						default:
								return '#d43e2a'; 
					}
				}
    $scope.openModal = function (event) {
      $uibModal.open({
        'template': '<div highchart></div>',
        'controller': 'highchart',
        'resolve': {
          'data': function () {
            return { 
              series: [{
                name: "Hestavollane",
                data: [0.2, 0.8, 0.8, 0.8, 1, 1.3, 1.5, 2.9, 1.9, 2.6, 1.6, 3, 4, 3.6, 4.5, 4.2, 4.5, 4.5, 4, 3.1, 2.7, 4, 2.7, 2.3, 2.3, 4.1, 7.7, 7.1, 5.6, 6.1, 5.8, 8.6, 7.2, 9, 10.9, 11.5, 11.6, 11.1, 12, 12.3, 10.7, 9.4, 9.8, 9.6, 9.8, 9.5, 8.5, 7.4, 7.6]
              }, {
                name: "Vik",
                data: [0, 0, 0.6, 0.9, 0.8, 0.2, 0, 0, 0, 0.1, 0.6, 0.7, 0.8, 0.6, 0.2, 0, 0.1, 0.3, 0.3, 0, 0.1, 0, 0, 0, 0.2, 0.1, 0, 0.3, 0, 0.1, 0.2, 0.1, 0.3, 0.3, 0, 3.1, 3.1, 2.5, 1.5, 1.9, 2.1, 1, 2.3, 1.9, 1.2, 0.7, 1.3, 0.4, 0.3]
              }]
            }
          }
        }
      })
    }
    $scope.$on('leaflet', function (event, leaflet) {
			$http.get("assets/data/geojson/africa_station.geojson").success(function(data, status) {
					angular.extend($scope, {
							geojson: {
									data: data,
									style:
										function (feature) {return {};},
										pointToLayer: function(feature, latlng) {
												return new L.marker(latlng, {icon: icons[feature.properties['Station status']]}).addTo(leaflet);
										},
										onEachFeature: function (feature, layer) {
												layer.bindPopup("Hello World!");
												layer.on('click', $scope.openModal).addTo(leaflet);
										}
							},
							defaults: {
									scrollWheelZoom: false
							}
					});
					$scope.properties = [];
					var gg = $scope.geojson.data;
					mylayer = L.geoJSON(gg, { 
						pointToLayer: function(feature, latlng) {
								return new L.marker(latlng, {icon: icons[feature.properties['Station status']]});
						},
						onEachFeature: function (feature, layer) {
								layer.on('click', $scope.openModal).addTo(leaflet);
						}
					})
					mylayer.addTo(leaflet);
					//leaflet.setView([34.798,-96.66], 6)
					mylayer.on('click', $scope.openModal)
					for (var i in $scope.geojson.data.features) {
						var points = $scope.geojson.data.features[i].geometry.coordinates;
						$scope.properties.push($scope.geojson.data.features[i].properties);
					}
			});
    })
  }
])

App.controller('highchart', [
           '$scope', '$uibModalInstance', 'data',
  function ($scope,   $uibModalInstance,   data) {
    $scope.$uibModalInstance = $uibModalInstance
    $scope.data = data
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
        var data = angular.extend(scope.data, chart)
        $(element[0]).highcharts(data)
      }
    }
  }
])

App.value('chart', {
  chart: {
      type: "spline"
  },
  title: {
      text: "Wind speed during two days"
  },
  subtitle: {
      text: "May 31 and and June 1, 2015 at two locations in Vik i Sogn, Norway"
  },
  xAxis: {
      type: "datetime",
      labels: {
          overflow: "justify"
      }
  },
  yAxis: {
      title: {
          text: "Wind speed (m/s)"
      },
      minorGridLineWidth: 0,
      gridLineWidth: 0,
      alternateGridColor: null,
      plotBands: [{
          from: 0.3,
          to: 1.5,
          color: "rgba(68, 170, 213, 0.1)",
          label: {
              text: "Light air",
              style: {
                  color: "#606060"
              }
          }
      }, {
          from: 1.5,
          to: 3.3,
          color: "rgba(0, 0, 0, 0)",
          label: {
              text: "Light breeze",
              style: {
                  color: "#606060"
              }
          }
      }, {
          from: 3.3,
          to: 5.5,
          color: "rgba(68, 170, 213, 0.1)",
          label: {
              text: "Gentle breeze",
              style: {
                  color: "#606060"
              }
          }
      }, {
          from: 5.5,
          to: 8,
          color: "rgba(0, 0, 0, 0)",
          label: {
              text: "Moderate breeze",
              style: {
                  color: "#606060"
              }
          }
      }, {
          from: 8,
          to: 11,
          color: "rgba(68, 170, 213, 0.1)",
          label: {
              text: "Fresh breeze",
              style: {
                  color: "#606060"
              }
          }
      }, {
          from: 11,
          to: 14,
          color: "rgba(0, 0, 0, 0)",
          label: {
              text: "Strong breeze",
              style: {
                  color: "#606060"
              }
          }
      }, {
          from: 14,
          to: 15,
          color: "rgba(68, 170, 213, 0.1)",
          label: {
              text: "High wind",
              style: {
                  color: "#606060"
              }
          }
      }]
  },
  tooltip: {
      valueSuffix: " m/s"
  },
  plotOptions: {
      spline: {
          lineWidth: 4,
          states: {
              hover: {
                  lineWidth: 5
              }
          },
          marker: {
              enabled: false
          },
          pointInterval: 3600000, 
          pointStart: Date.UTC(2015, 4, 31, 0, 0, 0)
      }
  },
  navigation: {
      menuItemStyle: {
          fontSize: "10px"
      }
  }
})


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
