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
	     var regex=/^(0\.[1-9][0-9]|1\.00)$/;
	     var discount=parseFloat(obj.discount).toFixed(2);
	     if(!regex.test(discount)){
	    	 layer.msg("输入折扣错误!",{time:2000})
	    	 return;
	     }
	     $.ajax({
	    	 url:url+'/flowPay/addInfo',
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
		 $("#modelName").val("");
		 $("#charge").val("");
		 $("#discount").val("");
		 $("#days").val("");
		 $("#realCharge").val("");
		 $("#remark").val("");
		 $("#status").attr("checked",true);
			layui.use('form', function(){
				 var form = layui.form; 
				 form.render('checkbox');
			});
	 })
})
//应收金额输入框内容改变，实收金额赋值
$("#charge").blur(function(){
	var charge=$("#charge").val();
	var discount=$("#discount").val();
	var realCharge=charge * discount;
	$("#realCharge").val(realCharge);
})


//折扣输入框内容改变，实收金额赋值
$("#discount").blur(function(){
	var charge=$("#charge").val();
	var discount=$(this).val();
	discount=parseFloat(discount).toFixed(2);
	var regex=/^(0\.[1-9][0-9]|1\.00)$/;
     if(!regex.test(discount)){
    	 layer.msg("输入折扣错误!",{time:2000})
    	 return;
     }
	var realCharge=charge * discount;
	$("#realCharge").val(realCharge);
})
//实收金额输入框内容改变，折扣赋值
$("#realCharge").blur(function(){
	var charge=$("#charge").val();
	var realCharge=$(this).val();
	var discount=realCharge/charge;
	discount=parseFloat(discount).toFixed(2);
	$("#discount").val(discount);
})

//编辑时获取一条信息
function getOneInfo(){
	$.ajax({
		url:url+"/flowPay/getOneInfo",
		type:"post",
		data:{"fid":getUrlParam("fid")},
		success:function(data){
			if(data.result){
				$("#fid").val(data.data.FID);
				$("#modelName").val(data.data.MODELNAME);
				$("#charge").val(data.data.CHARGE);
				 $("#discount").val(data.data.DISCOUNT);
				 $("#days").val(data.data.DAYS);
				 $("#realCharge").val(data.data.REALCHARGE);
				 $("#remark").val(data.data.REMARK);
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

//url地址中解析参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}