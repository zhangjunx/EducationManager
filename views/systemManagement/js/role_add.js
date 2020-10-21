var status=1;
getList();
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
	    console.log(obj);
	     $.ajax({
	    	 url:url+'/role/addInfo',
	    	 type:"post",
	    	 data:obj,
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
		 $("#roleName").val("");
		 $("#schoolName").val("");
		 $("#findex").val("");
		 $("#remark").val("");
		layui.use('form', function(){
			 var form = layui.form; 
			 form.render('checkbox');
		})
	 })
})
//获取所有校区
function getList(){
	$.ajax({
		url:url+"/login/getThisLoginSchoolList",
		type:"post",
		async:false,
		success:function(res){
			$("#schoolID option").find("not:first").remove();
			if(res.result){
				for(var item of res.data){
					var $opt=$("<option value='"+item.SCHOOLID+"'>"+item.SCHOOLNAME+"</option>");
					$("#schoolID").append($opt);
				}
				var schoolid=window.top.$("#nowSchool").val();
				$("#schoolID").val(schoolid);
				layui.use('form', function(){
					 var form = layui.form; 
					 form.render('select');
				})
			}
		}
	})
}
//编辑时获取一条信息
function getOneInfo(){
	$.ajax({
		url:url+"/role/getOneInfo",
		type:"post",
		data:{"fid":getUrlParam("fid")},
		async:false,
		success:function(data){
			console.log(data);
			if(data.result){
				 $("#fid").val(data.data.FID);
				 $("#roleName").val(data.data.ROLENAME);
				 $("#schoolID").val(data.data.SCHOOLID);
				 $("#findex").val(data.data.FINDEX);
				 $("#remark").val(data.data.REMARK);
				layui.use('form', function(){
					 var form = layui.form; 
					 form.render('select');
				})
			}
		}
	})
}


//url地址中解析参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}