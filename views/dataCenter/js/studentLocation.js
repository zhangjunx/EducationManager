$(function(){
	initLocation();
	getGradeList();//初始化年级下拉框
	getClassList();//初始化班级下拉框
	//openReader();
})
layui.use(["form","table"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table;
	  //监听搜索
	  form.on('submit(LAY-user-front-search)', function(data){
	    var field = data.field;
	    initLocation();
	});
})
//高德地图
var map = new AMap.Map("allmap", {
       resizeEnable: true
});
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
var lnglats = [],markers = [];
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
			 map.remove(markers);
	         markers = [];
	         lnglats = [];
			if(res.result){
				var data=res.data;
				var array1=[];//高德坐标
				var array2=[];//GPS坐标
				for(var item of data){
					if(item.LOCALTYPE == 1){//GPS坐标
						array2.push(new AMap.LngLat(item.ACCURACY,item.DIMENSION));
						markers.push({
							"studentname":item.STUDENTNAME,
							"classname":item.CLASSNAME,
							"date":item.UPLOADTIME,
							"gaodelocal":item.BAIDULOCAL
						})
					}else if(item.LOCALTYPE == 2){//高德坐标
						array1.push(
								{
									"lng":item.DIMENSION,
									"lat":item.ACCURACY,
									"studentname":item.STUDENTNAME,
									"classname":item.CLASSNAME,
									"date":item.UPLOADTIME,
									"gaodelocal":item.GAODELOCAL
								}
						);
					}
				}
				var list=spArray(40,array2);
				for(var item of list){
					//坐标转换
				    AMap.convertFrom(item, 'gps', function (status, result) {
				        if (result.info === 'ok') {
				        	var locations=result.locations;
					       	for(var i=0;i<locations.length;i++){
							    // 创建点覆盖物
							    var marker1 = new AMap.Marker({
							        position: locations[i],
							        offset: new AMap.Pixel(-13, -30),
							        icon:new AMap.Icon({
							        	image:"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
							        	imageSize:new AMap.Size(36,36)
							        })
							    });
							    marker1.content=markers[i].studentname+","+markers[i].classname+","+markers[i].date+","+markers[i].gaodelocal;
							    marker1.on("click",markerClick);
							    //marker.emit('click', {target: marker});
								map.add(marker1);
								map.setFitView();
							}
				        }
				    });
				}
				for(var item of array1){
				    // 创建点覆盖物
				    var marker2 = new AMap.Marker({
				        position: new AMap.LngLat(item.lng, item.lat),
				        offset: new AMap.Pixel(-13, -30),
				        icon:new AMap.Icon({
				        	image:"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
				        	imageSize:new AMap.Size(36,36)
				        })
				    });
				    marker2.content=item.studentname+","+item.classname+","+item.date+","+item.gaodelocal;
				    marker2.on("click",markerClick);
				    //marker.emit('click', {target: marker});
					map.add(marker2);
					map.setFitView();
				}
			}
		}
	})
}
function markerClick(e) {
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
}
//将数组按特定数量分组
function spArray(N,Q){
	var R = [],F;
	for (F = 0;F < Q.length;) {
		R.push(Q.slice(F,F += N))
	}
	return R
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
