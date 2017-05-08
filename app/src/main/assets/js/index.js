var foots=new Object();
var ids=new Array();
$(function(){
//全局数据库对象
	var database;
	//数据库的名称
	var dbName='fastfoot';
	//数据表
	var tbNameUser='user';
	var tbNameBook='book';
	//表字段
	var fieldUser="pass/date";
	var fieldBook="username/footName/price/number/location/phone/sum/date";
	//创建数据库
	var request = window.indexedDB.open(dbName, 1);
	request.onsuccess = function(event) {
		//让数据库 可在任何地方访问
		database = request.result;

	};
	request.onerror = function (event) {
		alert("发生错误：" + request.error);
	};
	request.onupgradeneeded = function(event) {
		db = request.result;  
		//创建表 
		var objectStore = db.createObjectStore(tbNameUser,{"keyPath":"username"});  
	  	var fields=new Array();
	  	fields=fieldUser.split("/");
	  	for (var i = 0; i < fields.length; i++) {
	  		objectStore.createIndex(fields[i],fields[i],{unique:false});
	  	}
	  	//创建表 
		objectStore = db.createObjectStore(tbNameBook,{"keyPath":"ketID", autoIncrement:true});  
	  	fields=new Array();
	  	fields=fieldBook.split("/");
	  	for (var i = 0; i < fields.length; i++) {
	  		objectStore.createIndex(fields[i],fields[i],{unique:false});
	  	}
	}

	//对数据库处理得先初始化数据库
	//参数一：表名
	//参数二：操作数据库的模式 有两种：readwrite 和readonly
	function initDB(tableName,model){
		//获取事务
		var transaction = database.transaction([tableName], model);
		//获取表
		var objectStore = transaction.objectStore(tableName);
		return objectStore;
	}
	

	function insert(tableName,data){
		var objectStore=initDB(tableName,"readwrite");
		//add 或者put
		var request = objectStore.add(data);
			request.onerror = function(event) {
			    alert("发生错误：" + request.error);
			};
			request.onsuccess = function(event) {
				if(tableName==tbNameUser)
			    	alert("注册成功");
			    else
			    	alert("下单成功");
			};
	}
    function selectSingle(tableName,key){
    	var objectStore=initDB(tableName,"readonly");
    	var request=objectStore.get(key);
    	request.onerror=function(e){
    		alert("发生错误：" + request.error);
    	};
    	request.onsuccess=function(e){
    		var result=e.target.result;
    		console.log(result);
    	}
    }
 	function selectAll(tableName){
		var objectStore = initDB(tableName,"readonly");
		var response="";
		var i=0;
		// 打开游标，遍历customers中所有数据  
		objectStore.openCursor().onsuccess = function(event) {  
		    var cursor = event.target.result;  
		    if (cursor) {  
		        var rowData = cursor.value;  
		        if(rowData["username"]==localStorage.username){
		        	var tb="";
		        	var count=0;
			      	for (var Key in rowData){
			      		count++;
			      		if(count==9)
			      			ids[i++]=rowData[Key];
			      		else
							tb =tb+"<td>"+rowData[Key]+"</td>";
				    }
					tb="<tr>"+tb+"</tr>";
					response+=tb;
		        }
		        cursor.continue();  
		    }else{
		    	$("#footlist").html(response);
		    }
		}  
    }
    function login(username,pass){
	   	var objectStore=initDB(tbNameUser,"readonly");
    	var request=objectStore.get(username);
    	request.onerror=function(e){
    		alert("发生错误：" + request.error);
    	};
    	request.onsuccess=function(e){
    		var result=e.target.result;
			 try {
			 	if(result.pass==pass){
				 	localStorage.loginStatus=true;
	    			localStorage.username=result.username;
	    			$(".loginStatus").html(localStorage.username+"·注销");
			 	}else
			 		alert_back("密码错误"); 
			} 
			catch (e){ 
					alert_back("账号错误"); 
			} 
    	}
    }
    function deleteAll(tableName){
		var objectStore=initDB(tableName,"readwrite");
		var count=0;
		for (var i = 0; i < ids.length; i++) {
			var id=ids[i];
			var request = objectStore.delete(id);
				request.onerror = function(event) {
				    alert("发生错误：" + request.error);
				};
				request.onsuccess = function(event) {
					count++;
					if(count==ids.length-1)
						alert_link("取消订单成功","index.html#home");
				};
		}
    }
    function alert_back(message){
    	alert(message);
    	history.back();
    }
  	function alert_link(message,link){
    	alert(message);
    	location.href=link;
    }


	$('#login').on("pageshow",function(event){
		localStorage.clear();
		var registerusername=$("#registerusername").val();
		var registerpass=$("#registerpass").val();
		var registerpass2=$("#registerpass2").val();
		if(registerusername!=""){
			if(registerpass!=registerpass2){
				alert_back("前后密码不一致！");
			}else{
			    var mydate = new Date();
			    var str =mydate.getFullYear() + "年-";
			    str += (mydate.getMonth()+1) + "月-";
			    str += mydate.getDate() + "日 ";
			    str += mydate.getHours() + ":";
			    str += mydate.getMinutes() + ":";
			    str += mydate.getSeconds() ;
			    var data="{\"username\":\""+registerusername+"\",\"pass\":\""+registerpass+"\",\"date\":\""+str+"\"}";
			    data=($.parseJSON(data));
				insert(tbNameUser,data);
			}
		}
		$("#registerusername").val("");
		$("#registerpass").val("");
		$("#registeruserpass2").val("");
	});
	$('#register').on("pageshow",function(event){
		localStorage.clear();
	});
	$('#home').on("pageshow",function(event){
		if(!localStorage.loginStatus){  
			var loginusername=$("#loginusername").val();
			var loginpass=$("#loginpass").val();
			if(loginusername==""||loginpass==""){
				alert_back("请先登录");
			}else{
				login(loginusername,loginpass);
			}	
			$("#loginusername").val("");
			$("#loginpass").val("");
		}
	});
	$('#addToStorage').click(function(e){
	    var mydate = new Date();
	    var str =mydate.getFullYear() + "年-";
	    str += (mydate.getMonth()+1) + "月-";
	    str += mydate.getDate() + "日 ";
	    str += mydate.getHours() + ":";
	    str += mydate.getMinutes() + ":";
	    str += mydate.getSeconds() ;
		foots.username=localStorage.username;
		foots.footName=localStorage.foot;
		foots.price=localStorage.price;
		foots.number=$("#num").val();
		foots.location=$("#location").val();
		foots.phone=$("#phone").val();
		foots.sum=foots.price*foots.number;
		foots.date=str;
		insert(tbNameBook,foots);
	});
	$('#second').on("pageshow",function(event){
		$('#secondTitle').html(localStorage.foot+": "+localStorage.price+"￥/份");
		if(!localStorage.address){
			// 百度地图API功能
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					var mk = new BMap.Marker(r.point);
					var new_point = new BMap.Point(r.point.lng,r.point.lat);
					var address =r.address;
					var str=address.province+address.city+address.district+address.street+address.street_number;
					localStorage.address=str;
					$('#location').val(str);
				}
				else {
					alert('failed'+this.getStatus());
				}        
			},{enableHighAccuracy: true});
		}else{
			$('#location').val(localStorage.address);
		}
	});
	$('#third').on("pageshow",function(event){
		selectAll(tbNameBook);
	});
	$('#deletelist').click(function(e){
		deleteAll(tbNameBook);
	});
	$('#location').click(function(e){
	});


});
function gotoPage(price,foot){
	localStorage.foot=foot;
	localStorage.price=price;
}