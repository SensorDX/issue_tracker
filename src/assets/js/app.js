/*
 *  Document   : app.js
 *  Description: Setting up and vital functionality for our App
 *
 */

// Create our angular module
var App = angular.module('app', [
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
		'ui.select',
    'oc.lazyLoad',
		'nemLogging',
		'ngMaterial',
		'ngCookies',
		'ngSanitize',
]);

// Router configuration
App.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'assets/views/base_pages_login.html',
								controller: 'LoginCtrl'
            })
						/*
            .state('angularjs', {
                url: '/angularjs',
                templateUrl: 'assets/views/ready_angularjs.html'
            })
						*/
            .state('issues', {
                url: '/issues',
                templateUrl: 'assets/views/issues.html',
                controller: 'IssueCtrl'
            })
            .state('viewissues', {
                url: '/issues/view/:id',
                templateUrl: 'assets/views/view_issues.html',
                controller: 'ViewIssueCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/summernote/summernote.min.css',
                                'assets/js/plugins/summernote/summernote.min.js',
                                'assets/js/plugins/ckeditor/ckeditor.js'
                            ]
                        });
                    }]
                }
            })
            .state('newissues', {
                url: '/issues/new?from',
                templateUrl: 'assets/views/new_issue.html',
                controller: 'NewIssueCtrl',
            })
            .state('editissues', {
                url: '/issues/edit/:id',
                templateUrl: 'assets/views/edit_issue.html',
                controller: 'EditIssueCtrl',
            })
            .state('dashboard', {
                url: '/dashboard/?from',
                templateUrl: 'assets/views/ready_dashboard.html',
                controller: 'DashboardCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/slick/slick.min.css',
																'assets/js/plugins/bootstrap-select/bootstrap-select.min.css',
                                'assets/js/plugins/slick/slick-theme.min.css',
                                'assets/js/plugins/font-awesome/font-awesome.min.css',
                                'assets/js/plugins/leaflet/leaflet.css',
                                'assets/js/plugins/leaflet-awesome-markers/leaflet.awesome-markers.css',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker3.min.css',
                                'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
																'assets/js/plugins/leaflet-markercluster/dist/MarkerCluster.css',
																'assets/js/plugins/leaflet-markercluster/dist/MarkerCluster.Default.css',
                                'assets/js/plugins/slick/slick.min.js',
                                'assets/js/plugins/chartjs/Chart.min.js',
																'assets/js/plugins/bootstrap-select/dist/js/bootstrap-select.min.js',
                                'assets/js/plugins/leaflet/leaflet.js',
                                'assets/js/plugins/leaflet-awesome-markers/leaflet.awesome-markers.min.js',
																'assets/js/plugins/leaflet-markercluster/dist/leaflet.markercluster.js',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js',
                                'assets/js/plugins/bootstrap-datetimepicker/moment.min.js',
                                'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js',
                            ]
                        });
                    }]
                }
            })
						/*
            .state('manageStations', {
                url: '/stations/manage',
                templateUrl: 'assets/views/manage_stations.html',
                controller: 'ManageStationsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                'assets/js/plugins/datatables/jquery.dataTables.min.js'
                            ]
                        });
                    }]
                }
            })
						*/
						/*
            .state('metadata', {
                url: '/stations/metadata',
                templateUrl: 'assets/views/metadata.html'
            })
						*/
						/*
            .state('qualityControl', {
                url: '/stations/QC',
                templateUrl: 'assets/views/quality_control.html'
            })
						*/
						/*
            .state('mapper', {
                url: '/api/mapper',
                controller: 'MapperCtrl',
                templateUrl: 'assets/views/mapper.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/highlightjs/github-gist.min.css',
                                'assets/js/plugins/highlightjs/highlight.pack.js',
                                'assets/js/plugins/easy-pie-chart/jquery.easypiechart.min.js',
                            ]
                        });
                    }]
                }
            })
						*/
						/*
            .state('documentation', {
                url: '/api/documentation',
                templateUrl: 'assets/views/documentation.html'
            })
						*/
						/*
            .state('apiDocumentation', {
                url: '/api/documentation/get-started',
                templateUrl: 'doc/index.html'
            })
						*/
            .state('profile', {
                url: '/profile/:id',
                controller: 'ProfileCtrl',
                templateUrl: 'assets/views/profile.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                'assets/js/plugins/datatables/jquery.dataTables.min.js'
                            ]
                        });
                    }]
                }
            })
						/*
            .state('settings', {
                url: '/settings',
                controller: 'SettingsCtrl',
                templateUrl: 'assets/views/settings.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                'assets/js/plugins/datatables/jquery.dataTables.min.js'
                            ]
                        });
                    }]
                }
            })
						*/
						/*
            .state('uiActivity', {
                url: '/ui/activity',
                templateUrl: 'assets/views/ui_activity.html',
                controller: 'UiActivityCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sweetalert/sweetalert.min.css',
                                'assets/js/plugins/bootstrap-notify/bootstrap-notify.min.js',
                                'assets/js/plugins/sweetalert/sweetalert.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('uiTabs', {
                url: '/ui/tabs',
                templateUrl: 'assets/views/ui_tabs.html'
            })
            .state('mapPopUp', {
                url: '/ui/popup',
                templateUrl: 'assets/views/map_popup.html'
            })
            .state('uiModalsTooltips', {
                url: '/ui/modals-tooltips',
                templateUrl: 'assets/views/ui_modals_tooltips.html'
            })
            .state('uiColorThemes', {
                url: '/ui/color-themes',
                templateUrl: 'assets/views/ui_color_themes.html'
            })
            .state('uiBlocksDraggable', {
                url: '/ui/blocks-draggable',
                templateUrl: 'assets/views/ui_blocks_draggable.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/jquery-ui/jquery-ui.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('uiChatFull', {
                url: '/ui/chat/full',
                templateUrl: 'assets/views/ui_chat_full.html',
                controller: 'UiChatCtrl'
            })
            .state('uiChatFixed', {
                url: '/ui/chat/fixed',
                templateUrl: 'assets/views/ui_chat_fixed.html',
                controller: 'UiChatCtrl'
            })
            .state('uiChatPopup', {
                url: '/ui/chat/popup',
                templateUrl: 'assets/views/ui_chat_popup.html',
                controller: 'UiChatCtrl'
            })
            .state('tablesTools', {
                url: '/tables/tools',
                templateUrl: 'assets/views/tables_tools.html'
            })
            .state('tablesDatatables', {
                url: '/tables/datatables',
                templateUrl: 'assets/views/tables_datatables.html',
                controller: 'TablesDatatablesCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/datatables/jquery.dataTables.min.css',
                                'assets/js/plugins/datatables/jquery.dataTables.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('formsPickersMore', {
                url: '/forms/pickers-more',
                templateUrl: 'assets/views/forms_pickers_more.html',
                controller: 'FormsPickersMoreCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker3.min.css',
                                'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css',
                                'assets/js/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
                                'assets/js/plugins/select2/select2.min.css',
                                'assets/js/plugins/select2/select2-bootstrap.min.css',
                                'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.css',
                                'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.min.css',
                                'assets/js/plugins/ion-rangeslider/css/ion.rangeSlider.skinHTML5.min.css',
                                'assets/js/plugins/dropzonejs/dropzone.min.css',
                                'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.css',
                                'assets/js/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js',
                                'assets/js/plugins/bootstrap-datetimepicker/moment.min.js',
                                'assets/js/plugins/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js',
                                'assets/js/plugins/bootstrap-colorpicker/bootstrap-colorpicker.min.js',
                                'assets/js/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                'assets/js/plugins/select2/select2.full.min.js',
                                'assets/js/plugins/masked-inputs/jquery.maskedinput.min.js',
                                'assets/js/plugins/jquery-auto-complete/jquery.auto-complete.min.js',
                                'assets/js/plugins/ion-rangeslider/js/ion.rangeSlider.min.js',
                                'assets/js/plugins/dropzonejs/dropzone.min.js',
                                'assets/js/plugins/jquery-tags-input/jquery.tagsinput.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('formsEditors', {
                url: '/forms/editors',
                templateUrl: 'assets/views/forms_editors.html',
                controller: 'FormsEditorsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/summernote/summernote.min.css',
                                'assets/js/plugins/summernote/summernote.min.js',
                                'assets/js/plugins/ckeditor/ckeditor.js'
                            ]
                        });
                    }]
                }
            })
            .state('formsValidation', {
                url: '/forms/validation',
                templateUrl: 'assets/views/forms_validation.html',
                controller: 'FormsValidationCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/select2/select2.min.css',
                                'assets/js/plugins/select2/select2-bootstrap.min.css',
                                'assets/js/plugins/select2/select2.full.min.js',
                                'assets/js/plugins/jquery-validation/jquery.validate.min.js',
                                'assets/js/plugins/jquery-validation/additional-methods.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('formsWizard', {
                url: '/forms/wizard',
                templateUrl: 'assets/views/forms_wizard.html',
                controller: 'FormsWizardCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                'assets/js/plugins/jquery-validation/jquery.validate.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compCharts', {
                url: '/components/charts',
                templateUrl: 'assets/views/comp_charts.html',
                controller: 'CompChartsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/sparkline/jquery.sparkline.min.js',
                                'assets/js/plugins/easy-pie-chart/jquery.easypiechart.min.js',
                                'assets/js/plugins/chartjs/Chart.min.js',
                                'assets/js/plugins/flot/jquery.flot.min.js',
                                'assets/js/plugins/flot/jquery.flot.pie.min.js',
                                'assets/js/plugins/flot/jquery.flot.stack.min.js',
                                'assets/js/plugins/flot/jquery.flot.resize.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compCalendar', {
                url: '/components/calendar',
                templateUrl: 'assets/views/comp_calendar.html',
                controller: 'CompCalendarCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/fullcalendar/fullcalendar.min.css',
                                'assets/js/plugins/jquery-ui/jquery-ui.min.js',
                                'assets/js/plugins/fullcalendar/moment.min.js',
                                'assets/js/plugins/fullcalendar/fullcalendar.min.js',
                                'assets/js/plugins/fullcalendar/gcal.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compSliders', {
                url: '/components/sliders',
                templateUrl: 'assets/views/comp_sliders.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/slick/slick.min.css',
                                'assets/js/plugins/slick/slick-theme.min.css',
                                'assets/js/plugins/slick/slick.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compScrolling', {
                url: '/components/scrolling',
                templateUrl: 'assets/views/comp_scrolling.html'
            })
            .state('compSyntaxHighlighting', {
                url: '/components/syntax-highlighting',
                templateUrl: 'assets/views/comp_syntax_highlighting.html',
                controller: 'CompSyntaxHighlightingCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/highlightjs/github-gist.min.css',
                                'assets/js/plugins/highlightjs/highlight.pack.js'
                            ]
                        });
                    }]
                }
            })
            .state('compRating', {
                url: '/components/rating',
                templateUrl: 'assets/views/comp_rating.html',
                controller: 'CompRatingCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/jquery-raty/jquery.raty.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compTreeview', {
                url: '/components/treeview',
                templateUrl: 'assets/views/comp_treeview.html',
                controller: 'CompTreeviewCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/bootstrap-treeview/bootstrap-treeview.min.css',
                                'assets/js/plugins/bootstrap-treeview/bootstrap-treeview.min.js'
                            ]
                        });
                    }]
                }
            })
						*/
            //.state('compMapsGoogle', {
            //    url: '/components/maps/google',
            //    templateUrl: 'assets/views/comp_maps.html',
            //    controller: 'CompMapsGoogleCtrl',
            //    resolve: {
            //        deps: ['$ocLazyLoad', function($ocLazyLoad) {
            //            return $ocLazyLoad.load({
            //                insertBefore: '#css-bootstrap',
            //                serie: true,
            //                files: [
            //                    /*
            //                     * Google Maps API Key (you will have to obtain a Google Maps API key to use Google Maps)
            //                     * For more info please have a look at https://developers.google.com/maps/documentation/javascript/get-api-key#key
            //                     */
            //                    { type: 'js', path: '//maps.googleapis.com/maps/api/js?key=' },
            //                    'assets/js/plugins/gmapsjs/gmaps.min.js'
            //                ]
            //            });
            //        }]
            //    }
            //})
            //.state('compMapsGoogleFull', {
            //    url: '/components/maps/google-full',
            //    templateUrl: 'assets/views/comp_maps_full.html',
            //    controller: 'CompMapsGoogleFullCtrl',
            //    resolve: {
            //        deps: ['$ocLazyLoad', function($ocLazyLoad) {
            //            return $ocLazyLoad.load({
            //                insertBefore: '#css-bootstrap',
            //                serie: true,
            //                files: [
            //                    /*
            //                     * Google Maps API Key (you will have to obtain a Google Maps API key to use Google Maps)
            //                     * For more info please have a look at https://developers.google.com/maps/documentation/javascript/get-api-key#key
            //                     */
            //                    { type: 'js', path: '//maps.googleapis.com/maps/api/js?key=' },
            //                    'assets/js/plugins/gmapsjs/gmaps.min.js'
            //                ]
            //            });
            //        }]
            //    }
            //})
						/*
            .state('compMapsVector', {
                url: '/components/maps/vector',
                templateUrl: 'assets/views/comp_maps_vector.html',
                controller: 'CompMapsVectorCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/jquery-jvectormap/jquery-jvectormap.min.css',
                                'assets/js/plugins/jquery-jvectormap/jquery-jvectormap.min.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-au-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-cn-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-de-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-europe-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-fr-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-in-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-us-aea-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-world-mill-en.js',
                                'assets/js/plugins/jquery-jvectormap/maps/jquery-jvectormap-za-mill-en.js'
                            ]
                        });
                    }]
                }
            })
            .state('compGallerySimple', {
                url: '/components/gallery/simple',
                templateUrl: 'assets/views/comp_gallery_simple.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'assets/js/plugins/magnific-popup/magnific-popup.min.css',
                                'assets/js/plugins/magnific-popup/magnific-popup.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('compGalleryAdvanced', {
                url: '/components/gallery/advanced',
                templateUrl: 'assets/views/comp_gallery_advanced.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                               'assets/js/plugins/magnific-popup/magnific-popup.min.css',
                                'assets/js/plugins/magnific-popup/magnific-popup.min.js'
                            ]
                        });
                    }]
                }
            })
            .state('blocks', {
                url: '/blocks',
                templateUrl: 'assets/views/api_blocks.html'
            })
            .state('layout', {
                url: '/layout',
                templateUrl: 'assets/views/api_layout.html'
            })
            .state('create', {
                url: '/create',
                templateUrl: 'assets/views/ready_create.html'
            });
						*/
    }
]);

// Tooltips and Popovers configuration
App.config(['$uibTooltipProvider',
    function ($uibTooltipProvider) {
        $uibTooltipProvider.options({
            appendToBody: true
        });
    }
]);

// Custom UI helper functions
App.factory('uiHelpers', function () {
    return {
        // Handles active color theme
        uiHelperAppearCountTo: function () {
        	// Init counter functionality
					jQuery('[data-toggle="countTo"]').each(function(){
							var $this       = jQuery(this);
							var $after      = $this.data('after');
							var $before     = $this.data('before');
							var $speed      = $this.data('speed') ? $this.data('speed') : 1500;
							var $interval   = $this.data('interval') ? $this.data('interval') : 15;

							$this.appear(function() {
									$this.countTo({
											speed: $speed,
											refreshInterval: $interval,
											onComplete: function() {
													if($after) {
															$this.html($this.html() + $after);
													} else if ($before) {
															$this.html($before + $this.html());
													}
											}
									});
							});
					});
        },
        uiValidateLogin: function () {
					console.log('function was initialized');
					jQuery('.js-validation-login').validate({
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
								 'login-email': {
											 required: true,
											 email: true
									 },
									'login-username': {
											required: true,
											minlength: 3
									},
									'login-password': {
											required: true,
											minlength: 4
									}
							},
							messages: {
									'login-email': {
											required: 'Please enter a valid email address',
									},
									'login-username': {
											required: 'Please enter a username',
											minlength: 'Your username must consist of at least 3 characters'
									},
									'login-password': {
											required: 'Please provide a password',
											minlength: 'Your password must be at least 5 characters long'
									}
							}
					});
        },
        uiHandleColorTheme: function (themeName) {
            var colorTheme = jQuery('#css-theme');

            if (themeName) {
                if (colorTheme.length && (colorTheme.prop('href') !== 'assets/css/themes/' + themeName + '.min.css')) {
                    jQuery('#css-theme').prop('href', 'assets/css/themes/' + themeName + '.min.css');
                } else if (!colorTheme.length) {
                    jQuery('#css-main').after('<link rel="stylesheet" id="css-theme" href="assets/css/themes/' + themeName + '.min.css">');
                }
            } else {
                if (colorTheme.length) {
                    colorTheme.remove();
                }
            }
        },
        // Handles #main-container height resize to push footer to the bottom of the page
        uiHandleMain: function () {
            var lMain       = jQuery('#main-container');
            var hWindow     = jQuery(window).height();
            var hHeader     = jQuery('#header-navbar').outerHeight();
            var hFooter     = jQuery('#page-footer').outerHeight();

            if (jQuery('#page-container').hasClass('header-navbar-fixed')) {
                lMain.css('min-height', hWindow - hFooter);
            } else {
                lMain.css('min-height', hWindow - (hHeader + hFooter));
            }
        },
        // Handles transparent header functionality (solid on scroll - used in frontend pages)
        uiHandleHeader: function () {
            var lPage = jQuery('#page-container');

            if (lPage.hasClass('header-navbar-fixed') && lPage.hasClass('header-navbar-transparent')) {
                jQuery(window).on('scroll', function(){
                    if (jQuery(this).scrollTop() > 20) {
                        lPage.addClass('header-navbar-scroll');
                    } else {
                        lPage.removeClass('header-navbar-scroll');
                    }
                });
            }
        },
        // Handles sidebar and side overlay custom scrolling functionality
        uiHandleScroll: function(mode) {
            var windowW            = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var lPage              = jQuery('#page-container');
            var lSidebar           = jQuery('#sidebar');
            var lSidebarScroll     = jQuery('#sidebar-scroll');
            var lSideOverlay       = jQuery('#side-overlay');
            var lSideOverlayScroll = jQuery('#side-overlay-scroll');

            // Init scrolling
            if (mode === 'init') {
                // Init scrolling only if required the first time
                uiHandleScroll();
            } else {
                // If screen width is greater than 991 pixels and .side-scroll is added to #page-container
                if (windowW > 991 && lPage.hasClass('side-scroll') && (lSidebar.length || lSideOverlay.length)) {
                    // If sidebar exists
                    if (lSidebar.length) {
                        // Turn sidebar's scroll lock off (slimScroll will take care of it)
                        jQuery(lSidebar).scrollLock('disable');

                        // If sidebar scrolling does not exist init it..
                        if (lSidebarScroll.length && (!lSidebarScroll.parent('.slimScrollDiv').length)) {
                            lSidebarScroll.slimScroll({
                                height: lSidebar.outerHeight(),
                                color: '#fff',
                                size: '5px',
                                opacity : .35,
                                wheelStep : 15,
                                distance : '2px',
                                railVisible: false,
                                railOpacity: 1
                            });
                        }
                        else { // ..else resize scrolling height
                            lSidebarScroll
                                .add(lSidebarScroll.parent())
                                .css('height', lSidebar.outerHeight());
                        }
                    }

                    // If side overlay exists
                    if (lSideOverlay.length) {
                        // Turn side overlay's scroll lock off (slimScroll will take care of it)
                        jQuery(lSideOverlay).scrollLock('disable');

                        // If side overlay scrolling does not exist init it..
                        if (lSideOverlayScroll.length && (!lSideOverlayScroll.parent('.slimScrollDiv').length)) {
                            lSideOverlayScroll.slimScroll({
                                height: lSideOverlay.outerHeight(),
                                color: '#000',
                                size: '5px',
                                opacity : .35,
                                wheelStep : 15,
                                distance : '2px',
                                railVisible: false,
                                railOpacity: 1
                            });
                        }
                        else { // ..else resize scrolling height
                            lSideOverlayScroll
                                .add(lSideOverlayScroll.parent())
                                .css('height', lSideOverlay.outerHeight());
                        }
                    }
                } else {
                    // If sidebar exists
                    if (lSidebar.length) {
                        // If sidebar scrolling exists destroy it..
                        if (lSidebarScroll.length && lSidebarScroll.parent('.slimScrollDiv').length) {
                            lSidebarScroll
                                .slimScroll({destroy: true});
                            lSidebarScroll
                                .attr('style', '');
                        }

                        // Turn sidebars's scroll lock on
                        jQuery(lSidebar).scrollLock('enable');
                    }

                    // If side overlay exists
                    if (lSideOverlay.length) {
                        // If side overlay scrolling exists destroy it..
                        if (lSideOverlayScroll.length && lSideOverlayScroll.parent('.slimScrollDiv').length) {
                            lSideOverlayScroll
                                .slimScroll({destroy: true});
                            lSideOverlayScroll
                                .attr('style', '');
                        }

                        // Turn side overlay's scroll lock on
                        jQuery(lSideOverlay).scrollLock('enable');
                    }
                }
            }
        },
        // Handles page loader functionality
        uiLoader: function (mode) {
            var lBody       = jQuery('body');
            var lpageLoader = jQuery('#page-loader');

            if (mode === 'show') {
                if (lpageLoader.length) {
                    lpageLoader.fadeIn(250);
                } else {
                    lBody.prepend('<div id="page-loader"></div>');
                }
            } else if (mode === 'hide') {
                if (lpageLoader.length) {
                    lpageLoader.fadeOut(250);
                }
            }
        },
        // Handles blocks API functionality
        uiBlocks: function (block, mode, button) {
            // Set default icons for fullscreen and content toggle buttons
            var iconFullscreen         = 'si si-size-fullscreen';
            var iconFullscreenActive   = 'si si-size-actual';
            var iconContent            = 'si si-arrow-up';
            var iconContentActive      = 'si si-arrow-down';

            if (mode === 'init') {
                // Auto add the default toggle icons
                switch(button.data('action')) {
                    case 'fullscreen_toggle':
                        button.html('<i class="' + (button.closest('.block').hasClass('block-opt-fullscreen') ? iconFullscreenActive : iconFullscreen) + '"></i>');
                        break;
                    case 'content_toggle':
                        button.html('<i class="' + (button.closest('.block').hasClass('block-opt-hidden') ? iconContentActive : iconContent) + '"></i>');
                        break;
                    default:
                        return false;
                }
            } else {
                // Get block element
                var elBlock = (block instanceof jQuery) ? block : jQuery(block);

                // If element exists, procceed with blocks functionality
                if (elBlock.length) {
                    // Get block option buttons if exist (need them to update their icons)
                    var btnFullscreen  = jQuery('[data-js-block-option][data-action="fullscreen_toggle"]', elBlock);
                    var btnToggle      = jQuery('[data-js-block-option][data-action="content_toggle"]', elBlock);

                    // Mode selection
                    switch(mode) {
                        case 'fullscreen_toggle':
                            elBlock.toggleClass('block-opt-fullscreen');

                            // Enable/disable scroll lock to block
                            if (elBlock.hasClass('block-opt-fullscreen')) {
                                jQuery(elBlock).scrollLock('enable');
                            } else {
                                jQuery(elBlock).scrollLock('disable');
                            }

                            // Update block option icon
                            if (btnFullscreen.length) {
                                if (elBlock.hasClass('block-opt-fullscreen')) {
                                    jQuery('i', btnFullscreen)
                                        .removeClass(iconFullscreen)
                                        .addClass(iconFullscreenActive);
                                } else {
                                    jQuery('i', btnFullscreen)
                                        .removeClass(iconFullscreenActive)
                                        .addClass(iconFullscreen);
                                }
                            }
                            break;
                        case 'fullscreen_on':
                            elBlock.addClass('block-opt-fullscreen');

                            // Enable scroll lock to block
                            jQuery(elBlock).scrollLock('enable');

                            // Update block option icon
                            if (btnFullscreen.length) {
                                jQuery('i', btnFullscreen)
                                    .removeClass(iconFullscreen)
                                    .addClass(iconFullscreenActive);
                            }
                            break;
                        case 'fullscreen_off':
                            elBlock.removeClass('block-opt-fullscreen');

                            // Disable scroll lock to block
                            jQuery(elBlock).scrollLock('disable');

                            // Update block option icon
                            if (btnFullscreen.length) {
                                jQuery('i', btnFullscreen)
                                    .removeClass(iconFullscreenActive)
                                    .addClass(iconFullscreen);
                            }
                            break;
                        case 'content_toggle':
                            elBlock.toggleClass('block-opt-hidden');

                            // Update block option icon
                            if (btnToggle.length) {
                                if (elBlock.hasClass('block-opt-hidden')) {
                                    jQuery('i', btnToggle)
                                        .removeClass(iconContent)
                                        .addClass(iconContentActive);
                                } else {
                                    jQuery('i', btnToggle)
                                        .removeClass(iconContentActive)
                                        .addClass(iconContent);
                                }
                            }
                            break;
                        case 'content_hide':
                            elBlock.addClass('block-opt-hidden');

                            // Update block option icon
                            if (btnToggle.length) {
                                jQuery('i', btnToggle)
                                    .removeClass(iconContent)
                                    .addClass(iconContentActive);
                            }
                            break;
                        case 'content_show':
                            elBlock.removeClass('block-opt-hidden');

                            // Update block option icon
                            if (btnToggle.length) {
                                jQuery('i', btnToggle)
                                    .removeClass(iconContentActive)
                                    .addClass(iconContent);
                            }
                            break;
                        case 'refresh_toggle':
                            elBlock.toggleClass('block-opt-refresh');

                            // Return block to normal state if the demostration mode is on in the refresh option button - data-action-mode="demo"
                            if (jQuery('[data-js-block-option][data-action="refresh_toggle"][data-action-mode="demo"]', elBlock).length) {
                                setTimeout(function(){
                                    elBlock.removeClass('block-opt-refresh');
                                }, 2000);
                            }
                            break;
                        case 'state_loading':
                            elBlock.addClass('block-opt-refresh');
                            break;
                        case 'state_normal':
                            elBlock.removeClass('block-opt-refresh');
                            break;
                        case 'close':
                            elBlock.hide();
                            break;
                        case 'open':
                            elBlock.show();
                            break;
                        default:
                            return false;
                    }
                }
            }
        },
        stringToObj: function (array_pos, pos, data, result) {
					console.log("pos = "+pos);
					console.log("result = ", result);
					var obj = {};
					if ( pos >= data.length) return result;

					if (data[pos] != "Array" && data[pos] != "Object") {
						console.log ('data pos is now: ', data[pos]);
						if (data[pos-1] == "Array") {
							result.push(data[pos]);
							this.stringToObj(array_pos, pos+1, data, result);
						}
						if (data[pos-1] == "Object") {
							obj[data[pos]] = null;
							result.push(obj);
							this.stringToObj(array_pos, pos+1, data, result);
						}
					} 
					if (data[pos] == "Array") {
						if (result == null || !(result.length > 0)) {
							console.log('array is null');
							result = [];
							this.stringToObj(array_pos, pos+1, data, result);
						} else {
							console.log('other array');
						}
					}
					if (data[pos] == "Object") {
						if (result[0] == null || Object.keys(result[0]).length == 0) {
							console.log('array state ', result[0]);
							result[0] = {};
							this.stringToObj(array_pos, pos+1, data, result);
						}
					}
        },
        apiProcessing: function (data, xml, result) {
					if (!(result.includes("None"))) result.push("None");
					if (typeof data == "boolean" || typeof data == "number" || typeof data == "string") {
						if (!(result.includes(xml.slice(1)))) result.push(xml.slice(1));
						return result;
					} 
					if (Array.isArray(data) && data.length > 0) {
						for (var i = 0; i < data.length; ++i) {
							if (typeof(data[i]) != "object") {
								this.apiProcessing(data[i], xml+".Array."+data[i], result);
							} else {
								this.apiProcessing(data[i], xml+".Array", result);
							}
						}
					}
					else if (typeof(data) == "object") { 
						for (var key in data) {
							this.apiProcessing(data[key], xml+".Object."+key, result);
						}
					}
        },
    };
});

// Run our App
App.run(function($rootScope, $location, $cookies, $http, uiHelpers) {
    // Access uiHelpers easily from all controllers
    $rootScope.helpers = uiHelpers;
		$rootScope.globals = $cookies.getObject('globals') || {};
		if ($rootScope.globals.currentUser) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
		}
		$rootScope.$on('$locationChangeStart', function (event, next, current) {
			// redirect to login page if not logged in and trying to access a restricted page
			console.log('location changed', $location.path());
			//var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
			const loggedIn = $rootScope.globals.currentUser;
			if (!loggedIn) {
					$location.path('/login');
			}
		});

    // On window resize or orientation change resize #main-container & Handle scrolling
    var resizeTimeout;

    jQuery(window).on('resize orientationchange', function () {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function(){
            $rootScope.helpers.uiHandleScroll();
            $rootScope.helpers.uiHandleMain();
        }, 150);
    });
});

// Application Main Controller
App.controller('AppCtrl', ['$scope', '$localStorage', '$window', '$location', '$log', 
    function ($scope, $localStorage, $window, $location, $log) {
				//console.log($location.path());
        $scope.oneui = {
            version: '1.0', // Template version
            localStorage: false, // Enable/Disable local storage
            settings: {
								isLogin: ($location.path() == '/login' || $location.path() == '/' || $location.path() == ''),
                activeColorTheme: false, // Set a color theme of your choice, available: 'amethyst', 'city, 'flat', 'modern' and 'smooth'
                sidebarLeft: true, // true: Left Sidebar and right Side Overlay, false: Right Sidebar and left Side Overlay
                sidebarOpen: true, // Visible Sidebar by default (> 991px)
                sidebarOpenXs: false, // Visible Sidebar by default (< 992px)
                sidebarMini: true, // Mini hoverable Sidebar (> 991px)
                sideOverlayOpen: false, // Visible Side Overlay by default (> 991px)
                sideOverlayHover: false, // Hoverable Side Overlay (> 991px)
                sideScroll: true, // Enables custom scrolling on Sidebar and Side Overlay instead of native scrolling (> 991px)
                headerFixed: true // Enables fixed header
            }
        };
				console.log($scope.oneui.settings.isLogin);

        // If local storage setting is enabled
        if ($scope.oneui.localStorage) {
            // Save/Restore local storage settings
            if ($scope.oneui.localStorage) {
                if (angular.isDefined($localStorage.oneuiSettings)) {
                    $scope.oneui.settings = $localStorage.oneuiSettings;
                } else {
                    $localStorage.oneuiSettings = $scope.oneui.settings;
                }
            }

            // Watch for settings changes
            $scope.$watch('oneui.settings', function () {
                // If settings are changed then save them to localstorage
                $localStorage.oneuiSettings = $scope.oneui.settings;
            }, true);
        }

        // Watch for activeColorTheme variable update
        $scope.$watch('oneui.settings.activeColorTheme', function () {
            // Handle Color Theme
            $scope.helpers.uiHandleColorTheme($scope.oneui.settings.activeColorTheme);
        }, true);

        // Watch for sideScroll variable update
        $scope.$watch('oneui.settings.sideScroll', function () {
            // Handle Scrolling
            setTimeout(function () {
                $scope.helpers.uiHandleScroll();
            }, 150);
        }, true);

        // When view content is loaded
        $scope.$on('$viewContentLoaded', function () {
            // Hide page loader
            $scope.helpers.uiLoader('hide');

						$scope.oneui.settings.isLogin = $location.path() == '/login' || $location.path() == '/' || $location.path() == '';

						// Run validation code
            $scope.helpers.uiValidateLogin();
			
						setTimeout(function() {
							$scope.helpers.uiHelperAppearCountTo();
						}, 0);

            // Resize #main-container
            $scope.helpers.uiHandleMain();
        });
    }
]);


/*
 * Partial views controllers
 *
 */

// Side Overlay Controller
App.controller('SideOverlayCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function () {
            // Handle Scrolling
            $scope.helpers.uiHandleScroll();
        });
    }
]);

// Sidebar Controller
App.controller('SidebarCtrl', ['$scope', '$localStorage', '$window', '$location',
    function ($scope, $localStorage, $window, $location) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function () {
            // Handle Scrolling
            $scope.helpers.uiHandleScroll();

            // Get current path to use it for adding active classes to our submenus
            $scope.path = $location.path();
        });
    }
]);

// Header Controller
App.controller('HeaderCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function () {
            // Transparent header functionality
            $scope.helpers.uiHandleHeader();
        });
    }
]);

App.service('fs', function() {
	var fs = require('fs');
	this.Write = function(filename, data) {
		console.log('writing '+data+' to '+filename);
	}
});

App.factory('Toast', function() {
	let service = {};
	service.Danger = Danger;
	service.Success = Success;
	return service;
	
	function Danger(message) {
		jQuery.notify({
			message: message
		}, 
		{
			type: 'danger', 
			placement: {
				from: 'top',
				align: 'center',
			}
		});
	}

	function Success(message) {
		jQuery.notify({
			message: message
		}, 
		{
			type: 'success', 
			placement: {
				from: 'top',
				align: 'center',
			}
		});
	}
});

App.factory('AuthService', ['$http', '$cookies', '$rootScope',
function($http, $cookies, $rootScope) {
	let service = {};
	//HELPERS
	service.SetCredentials = SetCredentials;
	service.ClearCredentials = ClearCredentials;
	//POST
	service.Login = Login;
	//PUT
	service.CreateAccount = CreateAccount;
	return service;

	function Login ({email, password}) {
			console.log('login api -- trying ...', email);
			return $http.post('api/auth', {email, password})
	}
	function SetCredentials({user, email, password}) {
		const authdata = btoa(email + ':' + password).toString('base64');
		const id = user._id;
		const role = user.role;
		console.log('authdata', authdata);
		$rootScope.globals = {
				currentUser: { user, email, id, role, authdata }
		};
		$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
		$cookies.putObject('globals', $rootScope.globals);
	}
	function ClearCredentials() {
			$rootScope.globals = {};
			$cookies.remove('globals');
			$http.defaults.headers.common.Authorization = 'Basic';
	}
	function CreateAccount({email}) {
			return $http.put('api/auth/create', {email})
	}
}]);

App.factory('UserService', ['$http', function($http) {
	let service = {};
	//HELPERS
	service.HttpUrlGetManagerUsers = HttpUrlGetManagerUsers;
	service.isAuthorized = isAuthorized;
	//GET
	service.GetUsers = GetUsers;
	service.GetUserById = GetUserById;
	service.GetManagers = GetManagers;
	service.GetManagerUsers = GetManagerUsers;
	service.GetRoles = GetRoles;
	//POST
	service.CreateUser = CreateUser;
	//PUT
	service.UpdateUser = UpdateUser;
	return service;

	function GetManagers() {
		return $http.get('api/users?role=manager');
	}

	function GetRoles() {
		return new Promise(function(resolve) {
			const roles = ['manager', 'agent', 'observer'];
			resolve(roles);
		});
	}

	function GetUsers(fields=[], roles=['agent,manager']) {
		if (fields && fields.length > 0) {
			return $http.get('api/users?role='+roles.join(',')+'&&fields='+fields.join(','));
		}
		return $http.get('api/users?role='+roles.join(','));
	}

	function HttpUrlGetManagerUsers(id, role) {
		if (role && role.toLowerCase() == 'admin') {
			return 'api/users';
		} else {
			return 'api/users/'+id+'/managing';
		}
	}

	function GetManagerUsers(id, role) {
		if (role && role.toLowerCase() == 'admin') {
			return $http.get('api/users');
		} else {
			return $http.get('api/users/'+id+'/managing');
		}
	}

	function isAuthorized(role) {
		return role.toLowerCase() == 'admin' || 
						role.toLowerCase() == 'manager'; 
	}

	function GetUserById(id) {
		return $http.get('api/users/'+id);
	}

	function CreateUser(user) {
		return $http.post('api/users', user);
	}

	function UpdateUser(user) {
		return $http.put('api/users/'+user._id, user);
	}
}]);

App.factory('IssueService', ['$http', function($http) {
	let service = {};
	//GET
	service.GetStatus = GetStatus;
	service.GetLabels = GetLabels;
	service.GetPriorities = GetPriorities;
	service.GetIssues = GetIssues;
	service.GetIssueById = GetIssueById;
	service.GetIssueComment = GetIssueComment;
	//POST
	service.CreateIssue = CreateIssue;
	service.PostIssueComment = PostIssueComment;
	//PUT
	service.UpdateIssues = UpdateIssues;
	//DELETE
	service.DeleteIssueById = DeleteIssueById;
	return service;

	function GetStatus() {
		return new Promise(function(resolve) {
			const status = ['open', 'close'];
			resolve({data: {success: true, data: status}});
		});
	}

	function GetLabels() {
		return new Promise(function(resolve) {
			const labels = ['None', 'sensor failure', 'battery problem', 'communication problem', 'general maintenance'];
			resolve({data: {success: true, data: labels}});
		});
	}

	function GetPriorities() {
		return new Promise(function(resolve) {
			const priorities = ['HIGH', 'NORMAL', 'LOW'];
			resolve({data: {success: true, data: priorities}});
		});
	}

	function GetIssues(status="", assignee="") {
		return $http.get('api/issues?status='+status+'&assignee='+assignee);
	}

	function GetIssueById(id) {
		return $http.get('api/issues/'+id);
	}
	
	function GetIssueComment(id) {
		return $http.get('api/issues/'+id+'/comments');
	}

	function CreateIssue(issue) {
		return $http.post('api/issues', issue);
	}
	
	function PostIssueComment(id, comments) {
		console.log('posting comments id', id);
		console.log('posting comments', comments);
		return $http.post('api/issues/'+id+'/comments', comments);
	}

	function UpdateIssues(issues) {
		return $http.put('api/issues', issues);
	}

	function DeleteIssueById(id) {
		return $http.delete('api/issues/'+id);
	}
}]);

App.factory('SiteService', ['$http', function($http) {
	let service = {};
	//GET
	service.GetSites = GetSites;
	service.GetSiteByCode = GetSiteByCode;
	return service;

	function GetSites(provider="tahmo", format="") {
		return $http.get('api/sites?provider='+provider+'&format='+format);
	}

	function GetSiteByCode(sitecode) {
		return $http.get('api/sites/'+sitecode);
	}
}]);

App.factory('CommentService', ['$http', function($http) {
	let service = {};
	//GET
	service.GetComments = GetComments;
	service.GetCommentById = GetCommentById;
	//POST
	service.CreateComment = CreateComment;
	//PUT
	service.UpdateComment = UpdateComment;
	//DELETE
	service.DeleteCommentById = DeleteCommentById;
	return service;

	function GetComments() {
		return $http.get('api/comments');
	}

	function GetCommentById(id) {
		return $http.get('api/comments/'+id);
	}

	function CreateComment(comment) {
		return $http.post('api/comments', comment);
	}

	function UpdateComment(comment) {
		return $http.put('api/comments/'+comment._id, comment);
	}

	function DeleteCommentById(id) {
		return $http.delete('api/comments/'+id);
	}
}]);

App.factory('EmailService', ['$http', function($http) {
	let service = {};
	service.SendMail = SendMail;
	service.SendMailByType = SendMailByType;
	return service;

	function SendMail(mail) {
		return $http.post('api/sendmail', mail);
	}
	function SendMailByType(receiver, type='new_account') {
		let mail = {};
		mail.to = receiver;
		switch (type) {

		}
		return $http.post('api/sendmail', mail);
	}
}]);
