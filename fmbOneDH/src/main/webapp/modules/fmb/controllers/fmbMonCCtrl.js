/**  
 * @Class Name : fmbMoncCtrl.js
 * @Description : fmbMonc
 * @Modification Information  
 * @ 설비 모니터링 화면
 * @ 작업일       작성자      내용
 * @ ----------  ---------  -------------------------------
 * @ 2017.11.14  정유경    최초생성
 * @ 
 * 
 */

'use strict';

angular
    .module('app')
    .controller('FmbMonCCtrl', [   'CmmAjaxService'
    							, 'CmmModalSrvc'
    							, 'CmmWorkerSrvc'
    							, '$rootScope'
    						    , 'CmmFactSrvc'
    							, '$http'
    							, '$scope'
    							, '$window'
    							, '$q'
    							, '$filter'
    							, '$location'
    							, '$mdDialog'
    							, '$timeout'
    							, function (
    									  CmmAjaxService
    									, CmmModalSrvc
    									, CmmWorkerSrvc
    									, $rootScope
    								    , CmmFactSrvc
    									, $http
    									, $scope
    									, $window
    									, $q
    									, $filter
    									, $location
    									, $mdDialog
    									, $timeout
    									) 
{
	/*------------------------------------------
     * 변수 선언
     *-----------------------------------------*/


    							    
    var self = this;

    var workerList = CmmWorkerSrvc;
    var promise = null;
    var bgImagePromise = null;
    var eqptPromise = null;
    var plcPromise = null;
    var countEqptPromise = null;
    var countPromise =null;
    var andonEqptPromise = null;
    var andonPromise =null;
    $scope.isMobile = false;
    $scope.showBar1 = true;
    $rootScope.showBar = $location.url();
    //PLC설비parameter
    self.eqptParamVo = { factId   :'C'
    				   , eqptType :'PLC'
    				   , id  	  :''
    				   , eqptCnm  :''
    				} ;
    //count 설비 param
    self.countEqptParamVo = { factId    : 'C'
    						, eqptType  : 'COUNT'
    						, id 		: ''
    						, eqptCnm   : ''
			    			}
    //안돈설비 param
    self.andonEqptParamVo = { factId    : 'C'
    						, eqptType  : 'ANDON'
    						, id 		: ''
    						, eqptCnm   : ''
			    			}


    //plc parameter
	self.plcParamVo={};
	self.plcParamVo.plcId ='';
	self.plcParamVo.factId ='C';
    
    self.countParamVo = {
        	factId : '',
        	lineCd : '',
        	lineNm : '',
        	dGoal: '',
        	nGoal : '',
        	eqptStst : '',
        	dCount: '',
        	nCount: '',
        	dRate : '',
        	nRate : '',
        	lineTopNm: '',
        	lineMidNm: '',
        	lineBotNm: ''
        }
/*	//andon parameter
	self.andonParamVo={};
	self.andonParamVo.plcId ='';
	self.andonParamVo.factId ='';*/
	
	self.stsData = [];
	self.andonStsData = [];
	self.countStsData = [];
	self.BgList = {
	    factId: 'C'
	};
	$scope.eachBg = {
		  A: ''
	 	, B: ''
	 	, C: ''
	 	, Comd: ''
	};
	
    self.showModal = false;
    self.toggleModal = function(pid){
    	self.plcSelectedVo = {plcId: pid,
					    		  factId: ''
					    		  } 
    	//선택된 plc 데이터 가져오기
    	getSelectedPlc();
    	}
    
	// 모바일 체크 함수 실행
	isMobileFunc();

    getBgImageList();      
   	getData();
   	dataChk();
   	
    $scope.hover=[];
    $scope.hoverIn = function(index){
   	 $scope.hover[index] = true;
    }
    $scope.hoverOut = function(index){
   	 $scope.hover[index] = false;
    }
	function dataChk(){ //function(getplcList, getEqptList, bindData) 순서제어
	   	    if(self.preplcList==undefined ||self.preandonList==undefined
	   	    || self.preeqptList==undefined ||self.preAndonEqptList==undefined
	   	    || self.precountList==undefined || self.preCountEqptList==undefined){//모든 데이터를 읽지 못했을경우
	   	    	var dataChkTimeout= $timeout(function(){
	   	    	}, 100)
	   	    	.then(function(){
	   	    		dataChk();
	   	    	});
	   		}else{ 													//모든 데이터를 읽어들인 경우
	   			bindData();
	   			countBindData();
	   			andonBindData();
	   			dataChkTimeout.cancel();
	   			dataChkTimeout = null;
	   		}
	   	}
    
    // 모바일 체크 함수 정의
	function isMobileFunc(){
		var UserAgent = navigator.userAgent;

		if (UserAgent.match(/iPhone|iPod|iPad|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null)
		{
			$scope.isMobile = true;
		}else{
			$scope.isMobile =  false;
		}
	}
	
	function getSelectedPlc(){
		promise = CmmAjaxService.select("bas/selectFmbPlc.do", self.plcSelectedVo);
        promise.then(function(data){
        	self.plc = data;//fmbPlcVo가 담긴 리스트 형태리턴
        	promise = null;
        }
        ,function(data){
        	/*alert('fail: '+ data)*/
    		console.log('fail'+data);
        });
    	 self.showModal = !self.showModal;
    };
    
    function getBgImageList() {

        bgImagePromise = CmmAjaxService.select("bas/selectFmbBgImage.do", self.BgList);
        bgImagePromise.then(function (data) {
            self.bgImageList = data;
            //console.log(data)
            for (var i = 0; i < self.bgImageList.length; i++) {
                var factId = self.bgImageList[i].factId;

                if (factId == "A") {
                    $scope.eachBg.A = self.bgImageList[i].imgPath;
                } else if (factId == "B") {
                    $scope.eachBg.B = self.bgImageList[i].imgPath;
                } else if (factId == "C") {
                    $scope.eachBg.C = self.bgImageList[i].imgPath;
                } else if (factId == "Comb") {
                    $scope.eachBg.Comb = self.bgImageList[i].imgPath;
                }

            }
            bgImagePromise = null;
        }, function (data) {
        	/*alert('fail: '+ data)*/
    		console.log('fail'+data);
        });
    }

	//워커 스타트
	workerList.workerStart(workerList.worker, "worker.js");
	//워커 온메세진
	workerList.workerOnmessage(workerList.worker, function(){getData(); dataChk();} );
	  
	
    // 팝업 테스트용 코드입니다....
    var customFullscreen = false;
    
    $scope.cancel = function() {
    	$mdDialog.cancel();
    };
    $scope.hide = function() {
    	$mdDialog.hide();
    };
     
    //팝업클릭
    $scope.showAdvanced = function(id,ev) {
    	//PlC 데이터 저장 하는 부분.
    	CmmFactSrvc.setPlcData(id);
        $mdDialog.show({
          controller: 'DialogCtrl',
          controllerAs: 'vm',
          templateUrl: 'modules/fmb/views/dialog1.tmpl.html',
          parent: angular.element(document.body),
          isolateScope: false,
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };
	
	
    //설비 이미지리스트 가져오기 메소드
    function getEqptList(){
	    	eqptPromise = CmmAjaxService.select("bas/selectFmbEqpt.do", self.eqptParamVo);
	    	eqptPromise.then(function(data) {
	    		self.preeqptList = data; //fmbEqptVo가 담긴 리스트 형태리턴
	    		self.eqptList = self.preeqptList; 
	    		eqptPromise = null;
	    	}, function(data){
	    		/*alert('fail: '+ data)*/
	    		console.log('fail'+data);
	    	});
    }
    //count 이미지리스트 가져오기 메소드
    function getCountEqptList(){
	    	countEqptPromise = CmmAjaxService.select("bas/selectFmbEqpt.do", self.countEqptParamVo);
	    	countEqptPromise.then(function(data) {
	    		self.preCountEqptList = data; //fmbEqptVo가 담긴 리스트 형태리턴
	    		self.countEqptList = self.preCountEqptList; 
	    		countEqptPromise = null;
	    	}, function(data){
	    		/*alert('fail: '+ data)*/
	    		console.log('fail'+data);
	    	});
    }
	//andon 이미지리스트 가져오기
    function getAndonEqptList(){
    	andonEqptPromise = CmmAjaxService.select("bas/selectFmbEqpt.do", self.andonEqptParamVo);
    	andonEqptPromise.then(function(data) {
    		self.preAndonEqptList = data; //fmbEqptVo가 담긴 리스트 형태리턴
    		self.andonEqptList = self.preAndonEqptList; 
    		andonEqptPromise = null;
    		
    	}, function(data){
    		/*alert('fail: '+ data)*/
    		console.log('fail'+data);
    	});
    }
    function bindData(){
		for(var i =0; i < self.eqptList.length; i++){
			var target = $filter('filter')(self.plcList, {plcId : self.eqptList[i].id});
			self.stsData[i]= target[0];
		}
	};
	function countBindData(){
		for(var i =0; i < self.countEqptList.length; i++){
			var target = $filter('filter')(self.countList, {lineCd : self.countEqptList[i].id});

			
			self.countStsData[i]= target[0];
		}
	};
    function andonBindData(){//안돈신호 올라오면 수정해야함
		for(var i =0; i < self.andonEqptList.length; i++){
			//original
			var target = $filter('filter')(self.andonList, {plcId : self.andonEqptList[i].id});

			self.andonStsData[i] = target[0];

		}

	};

	//설비 plc 데이터 가져오기
	function getPlcList(){
   		plcPromise = CmmAjaxService.select("bas/selectFmbPlc.do", self.plcParamVo);
       	plcPromise.then(function(data) {
       		//console.log(data)
       		// 설비상태 카운트 변수
       		self.count0=0; //비가동
       		self.count1=0; //가동
       		self.count2=0; //대기
       		self.count4=0; //알람

       		for(var i=0; i< data.length; i++){
       			if(data[i].plcId.split('_')[0]=="MPLC"){
       				if(data[i].eqptSts ==0){		//비가동 카운트
       					self.count0++;
       				}else if(data[i].eqptSts ==1){	//가동 카운트
           				self.count1++;
           			}else if(data[i].eqptSts ==2){	//대기 카운트
           				self.count2++;
           			}else if(data[i].eqptSts ==4){	//알람 카운트
           				self.count4++;
           			}
       			}
       		}
       		$scope.plcList = data;
       		
       		//데이터를 가져오는동안 깜빡임 방지
       		self.preplcList = data; 
       		self.plcList = self.preplcList;
       		plcPromise = null;
       	}, function(data){
       		/*alert('fail: '+ data)*/
    		console.log('fail'+data);
       });
	}
	//count 데이터 가져오기
	function getCountList(){
		countPromise = CmmAjaxService.select("bas/selectFmbLine.do",  self.countParamVo);
		countPromise.then(function(data) {
       		//데이터를 가져오는동안 깜빡임 방지
       		self.precountList = data; 
       		self.countList = self.precountList;
       		countPromise = null;
       	}, function(data){
       		/*alert('fail: '+ data)*/
    		console.log('fail'+data);
       });
	}
	//설비 andon 상태 데이터 가져오기
	function getAndonList(){
   		andonPromise = CmmAjaxService.select("bas/selectFmbAndon.do", self.plcParamVo); //plc와 파라미터넘기는게 똑같아서같이쓰겟음
   		
       	andonPromise.then(function(data) {
       		
       		//데이터를 가져오는동안 깜빡임 방지
       		self.preandonList = data; 
       		self.andonList = self.preandonList;
       		andonPromise = null;
       	}, function(data){
       		/*alert('fail: '+ data)*/
    		console.log('fail'+data);
       });
	}
	
	
	function getData(){
		self.preplcList = undefined;
		self.preeqptList = undefined;
		self.preCountEqptList = undefined;
		self.precountList = undefined;
		self.preAndonEqptList = undefined;
		self.preandonList = undefined;
		
		getEqptList();
		getCountEqptList();
		getAndonEqptList();	
		
   		getPlcList();
   		getCountList();
   		getAndonList();
   		
	} 	
    	
}]);

