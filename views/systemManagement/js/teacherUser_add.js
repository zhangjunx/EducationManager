var status=1;
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
				trigger : 'click',//怎么触发
			});
		});
	 
	//监听提交按钮    
	 form.on('submit(component-form-demo1)', function(data){
		 var fid=$("#fid").val();
	     var obj=data.field;
	     obj.fid=fid;
	     obj.status=status;
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
	    	 url:url+'/teacherUser/addInfo',
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
		 $("#userName").val("");
		 $("#password").val("");
		 $("#name").val("");
		 var $file =$("#logoIpt");
     	 $file.remove();
     	 $('#schoolIcon').append("<input type='file' class='schoolLogo' id='logoIpt' title='点击更换图片' accept='.jpg,.png,.gif' style='width:102px;height:102px'>");
		 $("#img").attr("src","../image/add_img.png");
		 $("#IDCard").val("");
		 $("#phoneNum").val("");
		 $("#remark").val("");
		 form.render();
		 
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
//编辑时获取一条信息
function getOneInfo(){
	$.ajax({
		url:url+"/teacherUser/getOneInfo",
		type:"post",
		data:{"fid":getUrlParam("fid")},
		async:false,
		success:function(data){
			console.log(data);
			if(data.result){
				 $("#fid").val(data.data.FID);
				 $("#userName").val(data.data.USERNAME);
				 $("#password").val(data.data.PASSWORD);
				 $("#name").val(data.data.NAME);
				 $("#IDCard").val(data.data.IDCARD);
				 $("#remark").val(data.data.REMARK);
				 $("#phoneNum").val(data.data.PHONENUM);
				 if(data.data.IMAGE!=undefined&&data.data.IMAGE!=null&&data.data.IMAGE!=""){
						$("#img").attr("src","data:image/png;base64,"+data.data.IMAGE);
				}
				//开关赋值1
				if(data.data.STATUS=="0"){
					$("#status").attr("checked",false);
					status=0;
				}
				 $("input[value="+data.data.SEX+"]").attr("checked",true);
				layui.use('form', function(){
					 var form = layui.form; 
					 form.render('checkbox');
				})
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