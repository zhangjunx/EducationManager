var arr=[];
var list=[];
var delList=[];
var flag=0;
getSchoolList();
if(getUrlParam("fid")!=undefined&&getUrlParam("fid")!=null&&getUrlParam("fid")!=""){//编辑
	getOneInfo();
}else{//新增
	$("#fid").val("");
}
layui.use(["form","table","laydate"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table,
	  laydate = layui.laydate;
//	 //监听开关
	 form.on('switch(component-form-switchTest)', function(data){
	       status=this.checked?"1":"0";
    });
	 lay('.date').each(function() {
			laydate.render({
				elem : this,//元素
				type:'datetime',
				trigger : 'click',//怎么触发
			});
		});
	 
	//监听提交按钮    
	 form.on('submit(component-form-demo1)', function(res){
		 if(arr.length == 0 && list.length == 0){//未上传图片
			 saveInfo(res.field);
		 }else if(arr.length == 0 && list.length !=0){//编辑时未添加图片
			 saveInfo(res.field);
		 }else{
			 $.ajax({
				url:url+"/obs/getUploadAuthor",
				type:"post",
				success:function(data){
					var access=data.credential.access;
					var secret=data.credential.secret;
					var securitytoken=data.credential.securitytoken;
					flag=0;
					for(let item of arr){
						uploadUsingFile(access,secret,securitytoken,item,res.field);
					 }
				}
			})
		 }
    });
	 //点击重置
	 $("#resetData").click(function(){
		 $("#studentName").val("");
		 $("#phoneNum").val("");
		 $("#schoolID").val("");
		 $("#runTime").val("");
		 $("#description").val("");
		 $("#description").val("");
		 $(".item-img").remove();
		 arr=[];
		 list=[];
		layui.use('form', function(){
			 var form = layui.form; 
			 form.render();
		})
		 
	 })
	 /* 自定义验证规则 */
	    form.verify({
	    	phoneNum: function(value){
			    var reg=/^1[3456789]\d{9}$/;
		        if(!reg.test(value)){
		          return '请正确输入手机号!';
		        }
		      },
	    });
})

/* 通过file上传一个对象    obs服务 */
function uploadUsingFile(ak,sk,token,item,obj){
	var obsClient = new ObsClient({
	       access_key_id: ak,
	       secret_access_key: sk,
	       security_token: token,
	       server : 'https://obs.cn-north-4.myhuaweicloud.com'
	});
	var time=new Date().getTime();
	obsClient.putObject({
	       Bucket : 'dslx',
	       Key : "product/pic/"+time+".png",
	       SourceFile : item
	}, function (err, result) {
	       if(err){
	              console.error('Error-->' + err);
	       }else{
	              console.log('Status-->' + result.CommonMsg.Status);
				  console.log(result);
				  var path="https://dslx.obs.cn-north-4.myhuaweicloud.com/product/pic/"+time+".png";
				  list.push(path);
				  flag++;
				  if(flag == arr.length){//全部上传obs成功
					  saveInfo(obj);
				  }
	       }
	});
}
//提交数据到后台接口
function saveInfo(obj){
	var fid=$("#fid").val();
    var pathstr="";
    if(list.length != 0){
	   pathstr=list.join(",");
    }
    obj.fid=fid;
    obj.imagePath=pathstr;
	 $.ajax({
    	 url:url+'/eduHelp/addInfo',
    	 type:"post",
    	 data:obj,
    	 success:function(res){
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
}
//编辑时获取一条信息
function getOneInfo(){
	$.ajax({
		url:url+"/eduHelp/getOneInfo",
		type:"post",
		data:{"fid":getUrlParam("fid")},
		async:false,
		success:function(data){
			if(data.result){
				 var imgpath=data.data.IMAGEPATH;
				 $("#fid").val(data.data.FID);
				 $("#studentName").val(data.data.STUDENTNAME);
				 $("#phoneNum").val(data.data.PHONENUM);
				 $("#schoolID").val(data.data.SCHOOLID);
				 $("#runTime").val(data.data.RUNTIME);
				 $("#description").val(data.data.DESCRIPTION);
				 if(imgpath!=undefined){
					 var imgArr=imgpath.split(",");
					 list=imgArr;
					 for(var item of imgArr){
						 var $div=$("<div class='item-img layui-inline' style='width:102px;height:102px;margin-right:10px;'>" +
									"<img src="+item+" style='width:100%;height:100%;object-fit:cover' class='showImg'></div>");
							$(".photoBox").append($div);
					 }
				 }
				 layui.use('form', function(){
					 var form = layui.form; 
					 form.render();
				})
			}
		}
	})
}

//初始化学校下拉框
function getSchoolList(){
	$.ajax({
		url:url+"/school/getList",
		type:"post",
		async:false,
		success:function(data){
			$("#schoolID option").find("not:first").empty();
			if(data.result){
				for(var item of data.data){
					var $opt=$("<option value="+item.FID+">"+item.SCHOOLNAME+"</option>");
					$("#schoolID").append($opt);
				}
				layui.use("form",function(){
					var form=layui.form;
					form.render();
				})
			}
		}
	})
} 
//双击删除
$(document).on("dblclick",".item-img",function(){
	$(this).remove();
	var index=$(this).index();
	var src=$(this).find("img").attr("src");
	if(getUrlParam("fid")!=undefined&&getUrlParam("fid")!=null&&getUrlParam("fid")!=""){//编辑
		if(src.indexOf("blob") == -1){//obs路径
			delList.push(list[index]);//将被删除的obs路径保存到数组中，以便后续从obs服务中删除
			list.splice(index,1);
		}else{//本地图片路径
			arr.splice(index,1);
		}
	}else{//新增
		arr.splice(index,1);
	}
	
})
//删除对象
function delObs(){
	var obsClient = new ObsClient({
	       access_key_id: ak,
	       secret_access_key: sk,
	       security_token: token,
	       server : 'https://obs.cn-north-4.myhuaweicloud.com'
	});

	 obsClient.deleteObject({
	        Bucket: 'dslx',
	        Key : 'objectname'
	 }, function (err, result) {
	        if(err){
	               console.log('Error-->' + err);
	        }else{
	               console.log('Status-->' + result.CommonMsg.Status);
	        }
	});
}
 
//选择照片
$(document).on("change","#logoIpt",function(){
	var imgUrl = getObjectURL(this.files[0]);
	var $div=$("<div class='item-img layui-inline' style='width:102px;height:102px;margin-right:10px;'>" +
			"<img src="+imgUrl+" style='width:100%;height:100%;object-fit:cover' class='showImg'></div>");
	$(".photoBox").append($div);
	arr.push(this.files[0]);
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