//密码的显示与隐藏
$("#eyesHide").click(function(){
	if($("#oldPassword").attr("type")=="password"){
        $("#oldPassword")[0].type="text";
        $("#eyesShow").show();
        $("#eyesHide").hide();
    }
})

$("#eyesShow").click(function(){
    if($("#oldPassword").attr("type")=="text"){
        $("#oldPassword")[0].type="password";
        $("#eyesShow").hide();
        $("#eyesHide").show();
    }
});

$("#eyesHide2").click(function(){
	if($("#newPassword").attr("type")=="password"){
        $("#newPassword")[0].type="text";
        $("#eyesShow2").show();
        $("#eyesHide2").hide();
    }
})

$("#eyesShow2").click(function(){
    if($("#newPassword").attr("type")=="text"){
        $("#newPassword")[0].type="password";
        $("#eyesShow2").hide();
        $("#eyesHide2").show();
    }
});

$("#eyesHide3").click(function(){
	if($("#reNewPassword").attr("type")=="password"){
        $("#reNewPassword")[0].type="text";
        $("#eyesShow3").show();
        $("#eyesHide3").hide();
    }
})

$("#eyesShow3").click(function(){
    if($("#reNewPassword").attr("type")=="text"){
        $("#reNewPassword")[0].type="password";
        $("#eyesShow3").hide();
        $("#eyesHide3").show();
    }
});

layui.use(["form","table","laydate"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table,
	  laydate = layui.laydate;
	 
	//监听提交按钮    
	 form.on('submit(setmypass)', function(data){
	     var obj=data.field;
	     console.log(obj);
	     $.ajax({
	    	 url:url+'/login/updatePass',
	    	 type:"post",
	    	 data:obj,
	    	 success:function(res){
	    		 console.log(res);
	    		 if(res.result){
	    			 layer.msg(res.msg,{time:1000},function(){
	    				 window.location.reload();
	    			 })
	    		 }else{
	    			 layer.msg(res.msg,{time:2000});
	    		 }
	    	 }
	     })
    });
})
