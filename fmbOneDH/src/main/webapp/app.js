/**  
 * @Class Name : app.js
 * @Description : 전체 app 
 * @Modification Information  
 * @
 * @  수정일      수정자              수정내용
 * @ ---------   ---------   -------------------------------
 * @ 2017.03.02  kb.shin     최초생성
 * @ 2017.03.03  hc.kang     수정
 * 
 * @author kb.shin
 * @since 2017.03.02
 * @version 1.0
 * @see
 * 
 *  Copyright (C) by Brit Consortium All right reserved.
 */

(function () {
    'use strict';
    angular				//  --(미사용 모듈)
        .module('app', [ 'angularModalService', 'ngSanitize','ngCookies', 'ngRoute',  'ngAnimate',  'ngMaterial', 'ngMessages', 'ngFileUpload', 'ui.bootstrap', 'ui.bootstrap.modal', 'ui.bootstrap.tpls', 'angular.filter', 'angular-marquee'])
        .config(config)
        .run(run);

    config.$inject = ['$httpProvider', '$routeProvider', '$locationProvider', '$qProvider', '$provide', '$mdDateLocaleProvider'];
    function config($httpProvider, $routeProvider, $locationProvider, $qProvider, $provide, $mdDateLocaleProvider) {
    	$qProvider.errorOnUnhandledRejections(false);	// Possibly unhandled rejection: {} 에러 처리
    	$locationProvider.hashPrefix('');				// angualrjs 1.6.1 사용 시 적용할 것
    	$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'; 
    	$mdDateLocaleProvider.formatDate = function(date) {
    		var day = date.getDate();
    	    var monthIndex = date.getMonth();
    	    var year = date.getFullYear();

    	    return year + '-' + (monthIndex + 1) + '-' + day;
    	};    	
    	$provide.decorator('inputDirective', function($delegate) {  //한글일 경우 처리
            var directive = $delegate[0];
            angular.extend(directive.link, {
                post: function(scope, element, attr, ctrls) {
                    element.on('compositionupdate', function (event) {
                        element.triggerHandler('compositionend');
                    })
                }
            });
            return $delegate;
        });    	
        $routeProvider
	        /*------------------------------------------
	         * 메인 화면
	         *-----------------------------------------*/
	        .when('/Main', {
	            controller: 'MainCtrl',
	            templateUrl: 'main.html',
	            controllerAs: 'vm'
	        })
	        .when('/login', {
	            controller: 'LoginCtrl',
	            templateUrl: 'login.html',
	            controllerAs: 'vm'
	        })
	        /*------------------------------------------
	         * FMB 화면
	         *-----------------------------------------*/
	        .when('/FmbMon', {
	            controller: 'FmbMonCtrl',
	            templateUrl: 'modules/fmb/views/fmbMon.html',
	            controllerAs: 'vm'
	        })
	        .when('/FmbMonA', {
	            controller: 'FmbMonACtrl',
	            templateUrl: 'modules/fmb/views/fmbMonA.html',
	            controllerAs: 'vm'
	        })
	        .when('/FmbMonB', {
	            controller: 'FmbMonBCtrl',
	            templateUrl: 'modules/fmb/views/fmbMonB.html',
	            controllerAs: 'vm'
	        })
	        .when('/FmbMonC', {
	            controller: 'FmbMonCCtrl',
	            templateUrl: 'modules/fmb/views/fmbMonC.html',
	            controllerAs: 'vm'
	        })
	        .when('/FmbMonD', {
	            controller: 'FmbMonDCtrl',
	            templateUrl: 'modules/fmb/views/fmbMonD.html',
	            controllerAs: 'vm'
	        }) 
	        .when('/FmbLineA', {
	            controller: 'FmbLineACtrl',
	            templateUrl: 'modules/fmb/views/fmbLineA.html',
	            controllerAs: 'vm'
	        })
	        .when('/FmbLineB', {
	            controller: 'FmbLineBCtrl',
	            templateUrl: 'modules/fmb/views/fmbLineB.html',
	            controllerAs: 'vm'
	        })
	        .when('/FmbLineC', {
	            controller: 'FmbLineCCtrl',
	            templateUrl: 'modules/fmb/views/fmbLineC.html',
	            controllerAs: 'vm'
	        })
	        .when('/FmbLineD', {
	            controller: 'FmbLineDCtrl',
	            templateUrl: 'modules/fmb/views/fmbLineD.html',
	            controllerAs: 'vm'
	        })
	        .when('/FmbCount', {
	            controller: 'FmbCountCtrl',
	            templateUrl: 'modules/fmb/views/fmbCount.html',
	            controllerAs: 'vm'
	        })
	        .when('/FmbMode', {
	            controller: 'FmbModeCtrl',
	            templateUrl: 'modules/fmb/views/fmbMode.html',
	            controllerAs: 'vm'
	        })
	       	.when('/FmbPopup', {
	            controller: 'FmbPopupCtrl',
	            templateUrl: 'modules/fmb/views/fmbPopup.html',
	            controllerAs: 'vm'
	        })	 
	       .when('/FmbTbm', {
	            controller: 'FmbTbmCtrl',
	            templateUrl: 'modules/fmb/views/fmbTbm.html',
	            controllerAs: 'vm'
	        })	 
	        .when('/FmbTotal', {
	            controller: 'FmbTotalCtrl',
	            templateUrl: 'modules/fmb/views/fmbTotal.html',
	            controllerAs: 'vm'
	        })

	        /*.otherwise({ redirectTo: '/FmbLogin' })*/;
    }
    run.$inject = ['$rootScope', '$interval' , '$timeout'];
    function run($rootScope, $interval, $timeout) {
        // add the register task to the rootScope. This will allow for autoUnregister when the  
        // scope is destroyed to prevent tasks from leaking.  
        var ScopeProt = Object.getPrototypeOf($rootScope);  
        ScopeProt.$interval = function(func, time){  
             var timer = $interval(func,time);  
             this.on('$destroy', function(){$timeout.cancel(timer); });  
             return timer;  
        };  
        ScopeProt.$timeout = function(func, time){  
            this.on('$destroy', function(){$timeout.cancel(timer); });  
       };  
        
    }
    
    
/*    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/Login']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/Main');
            }
        });
    }*/

})();