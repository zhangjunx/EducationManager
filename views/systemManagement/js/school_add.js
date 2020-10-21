var status=1;

$(function(){
	if(getUrlParam("fid")!=undefined&&getUrlParam("fid")!=null&&getUrlParam("fid")!=""){//编辑
		getOneInfo();
	}else{//新增
		$("#fid").val("");
	}
})
		

var map = new AMap.Map("allmap", {
    resizeEnable: true
});

var geocoder = new AMap.Geocoder({
    city: "全国", //城市设为北京，默认：“全国”
});

var marker = new AMap.Marker();

function geoCode() {
    var address  = document.getElementById('cityName').value;
    geocoder.getLocation(address, function(status, result) {
        if (status === 'complete'&&result.geocodes.length) {
            var lnglat = result.geocodes[0].location
            document.getElementById('point').value = lnglat;
            marker.setPosition(lnglat);
            map.add(marker);
            map.setFitView(marker);
        }else{
            console.error('根据地址查询位置失败');
        }
    });
}
document.getElementById('cityName').onkeydown = function(e) {
    if (e.keyCode === 13) {
        geoCode();
        return false;
    }
    return true;
};
layui.use(["form","table"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table;
	 //监听开关
	 form.on('switch(component-form-switchTest)', function(data){
	       status=this.checked?"1":"0";
    });
	//监听搜索
	  form.on('submit(LAY-user-front-search)', function(data){
		  geoCode();
	  });
	//监听提交按钮    
	 form.on('submit(component-form-demo1)', function(data){
		 var fid=$("#fid").val();
	     var obj=data.field;
	     obj.status=status;
	     obj.fid=fid;
	     console.log(obj);
	     var src=$("#img").attr("src");
	     var formdata=new FormData();
	     if(src.indexOf('data:image')>-1){
	    	 // base64 图片操作
	    	 var file=dataUrlToFile(src,"icon.png");
	    	 formdata.append("file", file);	
	     }else if(src!="../image/add_img.png"&&src.indexOf('data:image')==-1){
	    	 formdata.append("file", $("#logoIpt")[0].files[0]);
	     }
	     formdata.append("str",JSON.stringify(obj));
	     $.ajax({
	    	 url:url+'/school/addInfo',
	    	 type:"post",
	    	 data:formdata,
	    	 cache:false,
			 contentType:false,
			 processData:false,
	    	 success:function(res){
	    		 console.log(res);
	    		 if(res.result){
	    			 layer.msg(res.msg,{time:1000},function(){
	    				 parent.layer.closeAll();
	    				 window.parent.location.reload();
	    			 })
	    		 }else{
	    			 layer.msg(res.msg,{time:2000});
	    		 }
	    	 }
	     })
    });
	 //点击重置
	 $("#resetData").click(function(){
		 $file =$("#logoIpt");
     	 $file.remove();
     	 $('#schoolIcon').append("<input type='file' class='schoolLogo' id='logoIpt' title='点击更换图片' accept='.jpg,.png,.gif'>");
		 $("#img").attr("src","../image/add_img.png");
		 $("#schoolName").val("");
		 $("#location").val("");
		 $("#point").val("");
		 $("#scale").val("");
		 $("#type").val("");
		 $("#manager").val("");
		 $("#phone").val("");
		 $("#remark").val("");
		 $("#status").attr("checked",true);
			layui.use('form', function(){
				 var form = layui.form; 
				 form.render('checkbox');
			})
		 
	 })
})

//编辑时获取一条信息
function getOneInfo(){
	$.ajax({
		url:url+"/school/getOneInfo",
		type:"post",
		data:{"fid":getUrlParam("fid")},
		success:function(data){
			console.log(data);
			if(data.result){
				$("#fid").val(data.data.FID);
				$("#schoolName").val(data.data.SCHOOLNAME);
				$("#schoolName").val(data.data.SCHOOLNAME);
				$("#location").val(data.data.LOCATION);
				$("#point").val(data.data.POINT);
				$("#scale").val(data.data.SCALE);
				$("#type").val(data.data.TYPE);
				$("#manager").val(data.data.MANAGER);
				$("#phone").val(data.data.PHONE);
				$("#remark").val(data.data.REMARK);
				if(data.data.SCHOOLIMG!=undefined&&data.data.SCHOOLIMG!=null&&data.data.SCHOOLIMG!=""){
					$("#img").attr("src","data:image/png;base64,"+data.data.SCHOOLIMG);
				}
				//开关赋值
				if(data.data.STATUS=="0"){
					$("#status").attr("checked",false);
					status=0;
					layui.use('form', function(){
						 var form = layui.form; 
						 form.render('checkbox');
					})
				}
			}
		}
	})
}
//选择照片
$(document).on("change","#logoIpt",function(){
	var imgUrl = getObjectURL(this.files[0]);
	$("#img").attr("src", imgUrl);
})

function getObjectURL(file) {
	var url = null;
	if (window.createObjectURL != undefined) {
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) {
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) {
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}//end

//将base64转file文件
function dataUrlToFile(dataurl,filename){
	/*dataUrlToFile(dataurl,filename)*/
		var arr=dataurl.split(',');
		var mime=arr[0].match(/:(.*?);/)[1];
		var bstr=atob(arr[1]);
		//var bstr=window.atob(arr[1]);
		var n=bstr.length;
		var u8arr=new Uint8Array(n);
		while(n--){
			u8arr[n]=bstr.charCodeAt(n);
		}
		//转换成file对象
		var obj= new File([u8arr],filename,{type:mime});
		//转换成blob对象
		//var obj=new Blob([u8arr],{type:mime});
		return obj;
}//end

//url地址中解析参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}