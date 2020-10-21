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
	     var str=obj.courseName;
	     var courseName=str.replace(/\s*/g,"");
	     obj.courseName=courseName;
	     $.ajax({
	    	 url:url+'/course/addInfo',
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
		 $("#courseName").val("");
		 $("#findex").val("");
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
		url:url+"/course/getOneInfo",
		type:"post",
		data:{"fid":getUrlParam("fid")},
		async:false,
		success:function(data){
			console.log(data);
			if(data.result){
				 $("#fid").val(data.data.FID);
				 $("#courseName").val(data.data.COURSENAME);
				 $("#findex").val(data.data.FINDEX);
				 $("#remark").val(data.data.REMARK);
				//开关赋值
					if(data.data.STATUS=="0"){
						$("#status").attr("checked",false);
						status=0;
					}
					layui.use('form', function(){
						 var form = layui.form; 
						 form.render('checkbox');
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