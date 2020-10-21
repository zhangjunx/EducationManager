//var status=1;
//初始化年级下拉框
getGradeList();
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
//	 form.on('switch(component-form-switchTest)', function(data){
//	       status=this.checked?"1":"0";
//    });
	 lay('.date').each(function() {
			laydate.render({
				elem : this,//元素
				trigger : 'click',//怎么触发
			});
		});
	 
	//监听提交按钮    
	 form.on('submit(component-form-demo1)', function(data){
		 var fid=$("#fid").val();
		 var gradeID=$("#selectGrade").val();
	     var obj=data.field;
	     obj.fid=fid;
	     obj.gradeID=gradeID;
	     console.log(obj);
	     $.ajax({
	    	 url:url+'/classInfo/addInfo',
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
    });
	 //点击重置
	 $("#resetData").click(function(){
		 $("#className").val("");
		 $("#selectGrade").val("");
		 $("#minNum").val("");
		 $("#maxNum").val("");
		 $("#remark").val("");
	 })
})
//编辑时获取一条信息
function getOneInfo(){
	$.ajax({
		url:url+"/classInfo/getOneInfo",
		type:"post",
		async:false,
		data:{"fid":getUrlParam("fid")},
		success:function(data){
			if(data.result){
				 $("#fid").val(data.data.FID);
				 $("#selectGrade").val(data.data.GRADEID);
				 $("#className").val(data.data.CLASSNAME);
				 $("#minNum").val(data.data.MINNUM);
				 $("#maxNum").val(data.data.MAXNUM);
				 $("#remark").val(data.data.REMARK);
				/* layui.use("form",function(){
						var form=layui.form;
						form.render("select");
				})*/
			}
		}
	})
}

//获取年级数据
function getGradeList(){
	$.ajax({
		url:url+"/public/getGradeList",
		type:"post",
		async:false,
		success:function(res){
			$("#selectGrade").find("not:first").remove();
			if(res.result){
				for(var item of res.data){
					var $opt=$("<option value="+item.FID+">"+item.GRADENAME+"</option>");
					$("#selectGrade").append($opt);
				}
			}
			layui.use("form",function(){
				var form=layui.form;
				form.render("select");
			})
		}
	})
}


//url地址中解析参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}