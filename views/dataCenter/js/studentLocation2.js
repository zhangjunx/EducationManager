$(function(){
	initLocation();
	getGradeList();//初始化年级下拉框
	getClassList();//初始化班级下拉框
	//openReader();
})
// 百度地图API功能
var map = new BMap.Map("allmap");
var point = new BMap.Point(113.759384,34.771712);
//创建地址解析器实例
var myGeo = new BMap.Geocoder();
map.centerAndZoom(point,12);

//原始坐标转换为百度坐标
//var convertor = new BMap.Convertor();

map.enableScrollWheelZoom(true);
map.disableDragging();     //禁止拖拽
setTimeout(function(){
   map.enableDragging();   //两秒后开启拖拽
   //map.enableInertialDragging();   //两秒后开启惯性拖拽
}, 2000);

//输入地址获取位置
function theLocation(){
	//map.clearOverlays();
	var address=$("#address").val();
	// 将地址解析结果显示在地图上,并调整地图视野
	myGeo.getPoint(address, function(point){
		if (point) {
			map.centerAndZoom(point, 12);
			var marker=new BMap.Marker(point)
			map.addOverlay(marker);
			//marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
		}else{
			layer.msg("您输入的地址没有解析到结果!",{time:2000});
		}
	},"中国");
}
layui.use(["form","table"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table;
	  //监听搜索
	  form.on('submit(LAY-user-front-search)', function(data){
	    var field = data.field;
	    theLocation();
	    initLocation();
	});
})
var index=0;
var address=[];
function initLocation(){
	var gradeID=$("#gradeID").val();
	var classID=$("#classID").val();
	var studentname=$("#studentName").val();
	var obj={"gradeID":gradeID,"classID":classID,"studentName":studentname};
	$.ajax({
		url:url+"/location/getNewLocation",
		type:"post",
		data:obj,
		success:function(res){
			console.log(res);
			map.clearOverlays();
			if(res.result){
				index=0;
				address = [];
				var data=res.data;
				for(var item of data){
					var obj;
					if(item.BAIDULOCAL==undefined){
						var index1=item.GAODELOCAL.indexOf("靠近");
						var index2=item.GAODELOCAL.indexOf("(");
						var str1=item.GAODELOCAL.substring(0,index1);
						var str2=item.GAODELOCAL.substring(index2);
						var local=str1+str2;
						if(index1 == -1 || index2 == -1){
							local=item.GAODELOCAL;
						}
						
						obj={
								"address":local,
								"studentname":item.STUDENTNAME,
								"classname":item.CLASSNAME
						}
					}else{
						var index1=item.BAIDULOCAL.indexOf("靠近");
						var index2=item.BAIDULOCAL.indexOf("(");
						var str1=item.BAIDULOCAL.substring(0,index1);
						var str2=item.BAIDULOCAL.substring(index2);
						var local=str1+str2;
						if(index1 == -1 || index2 == -1){
							local=item.BAIDULOCAL;
						}
						obj={
								"address":local,
								"studentname":item.STUDENTNAME,
								"classname":item.CLASSNAME
						}
					}
					
					address.push(obj);
				}
				console.log(address);
				bdGEO();
			}
		}
	})
}
function bdGEO(){
	if(index<address.length){
		var add=address[index];
		geocodeSearch(add);
		index++;
	}
}
function geocodeSearch(add){
		if(index<address.length){
			setTimeout(window.bdGEO,400);
		}
	myGeo.getPoint(add.address, function(point){
		if (point) {
			map.centerAndZoom(point, 12);
			var text=add.studentname+",班级:"+add.classname+","+add.address;
			var opts={
					width:200,
					height:70,
			}
			var infoWindow=new BMap.InfoWindow(text,opts);
			var marker=new BMap.Marker(point);
			marker.addEventListener("click", function(e){
				map.openInfoWindow(infoWindow,point); //开启信息窗口
			});
			map.addOverlay(marker);
		}else{
			layer.msg("没有解析到结果!",{time:2000});
		}
	},"中国");
}
//初始化年级下拉框
function getGradeList(){
	$.ajax({
		url:url+"/public/getGradeList",
		type:"post",
		success:function(data){
			if(data.result){
				for(var item of data.data){
					var $opt=$("<option value="+item.FID+">"+item.GRADENAME+"</option>");
					$("#gradeName").append($opt);
				}
				layui.use("form",function(){
					var form=layui.form;
					form.render();
				})
			}
		}
	})
}
//初始化班级下拉框
function getClassList(){
	$.ajax({
		url:url+"/public/getClassList",
		type:"post",
		success:function(data){
			if(data.result){
				for(var item of data.data){
					var $opt=$("<option value="+item.FID+">"+item.CLASSNAME+"</option>");
					$("#className").append($opt);
				}
				layui.use("form",function(){
					var form=layui.form;
					form.render();
				})
			}
		}
	})
}
