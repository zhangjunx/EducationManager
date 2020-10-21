var status=1;
if(getUrlParam("fid")!=undefined&&getUrlParam("fid")!=null&&getUrlParam("fid")!=""){//编辑
	getOneInfo();
}else{//新增
	$("#fid").val("");
}
//手环sn输入框回车事件
$("#deviceSn").keydown(function(e){
	if(e.keyCode == 13){
		$("#ringCode").val("").focus();
    }
})
//手环IMEI输入框回车事件
$("#ringCode").keydown(function(e){
	if(e.keyCode == 13){
		$("#submit").click();
		$("#deviceSn").val("").focus();
		$("#ringCode").val("");
    }
})

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
	     $.ajax({
	    	 url:url+'/ring/addInfo',
	    	 type:"post",
	    	 data:obj,
	    	 success:function(res){
	    		 console.log(res);
	    		 if(res.result){
	    			 layer.msg(res.msg,{time:1000},function(){
	    				 //parent.layer.closeAll();
	    				 //window.parent.location.reload();
	    			 })
	    		 }else{
	    			 layer.msg(res.msg,{time:2000});
	    		 }
	    	 }
	     })
    });
	 //点击重置
	 $("#resetData").click(function(){
		 $("#deviceName").val("");
		 $("#deviceSn").val("");
		 $("#ringCode").val("");
		 $("#factory").val("");
		 $("#remark").val("");
		 $("#status").attr("checked",true);
			layui.use('form', function(){
			 var form = layui.form; 
			 form.render();
		})
		 
	 })
})
//编辑时获取一条信息
function getOneInfo(){
	$.ajax({
		url:url+"/ring/getOneInfo",
		type:"post",
		data:{"fid":getUrlParam("fid")},
		success:function(data){
			if(data.result){
				$("#fid").val(data.data.FID);
				$("#deviceName").val(data.data.DEVICENAME);
				$("#deviceSn").val(data.data.DEVICESN);
				 $("#ringCode").val(data.data.RINGCODE0);
				 $("#factory").val(data.data.FACTORY);
				 $("#remark").val(data.data.REMARK);
				//开关赋值
				if(data.data.STATUS=="0"){
					$("#status").attr("checked",false);
					status=0;
				}
				layui.use('form', function(){
					 var form = layui.form; 
					 form.render();
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