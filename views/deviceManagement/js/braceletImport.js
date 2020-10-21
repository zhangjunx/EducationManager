$(function(){
	initTable([]);
})

$(".file").change(function(e){
	postData();
	//清空input
	e.target.value = '';
});//end


function postData(){
	 var formData = new FormData();
	 var excle = $(".file").val();
	 formData.append("file",$(".file")[0].files[0]);
	//文件名可以带空格
    var reg = /^.*\.(?:xls|xlsx)$/i;
	//校验不通过
	if(!reg.test(excle)) {
		layer.msg("请上传excel格式的文件!",{time:2000});
		initTable([]);
	}else{
		$.ajax({
	        url:url+"/public/analysisFile",//后台检查Excel表格中的数据
	        type:'POST',
	        //async:false,
	        data:formData,
	        // 告诉jQuery不要去处理发送的数据
	        processData:false,
	        // 告诉jQuery不要去设置Content-Type请求头
	        contentType:false,
	        success : function(res) {
	        	console.log(res);
	          var val=res.data;
	          layer.msg(res.msg,{time:2000});
	          initTable([]);
	          if(res.result){
	        	  var arr=[];
	        	  for(var item of val){
	        		  if(item[0]!=null&&item[0]!=""){
	        			  var obj={
		        				  "deviceSn":item[0],
		        				  "ringCode":item[1],
		        				  "factory":item[2]
		        		  }
	        			  arr.push(obj);
	        		  }
	        	  }
	        	  initTable(arr);
	          }
	        }
	     })
	 }
}
function initTable(res){
	layui.use(["form","table"],function(){
		 var $ = layui.$,
		  form = layui.form,
		  table = layui.table;
		 
		  table.render({
			    elem: '#studentManage',
			    cellMinWidth: 80,
			    cols: [[
			      {field:'deviceSn', title:'手环SN', width:'500',templet:function(d){
			    	  if(d.deviceSn==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.deviceSn;
			    	  }
			      }},
			      {field:'ringCode', title:'手环IMEI', width:'500',templet:function(d){
			    	  if(d.ringCode==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.ringCode;
			    	  }
			      }},
			      {field:'factory', title:'厂家', width:'465',templet:function(d){
			    	  if(d.factory==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.factory;
			    	  }
			      }},
			    ]],
			    data:res,
			    page: true,
			    limits:[100,200,1500,2000],
			    limit:100
			  });
		//监听提交按钮    
			 form.on('submit(component-form-demo1)', function(data){
				 var index=layer.load(2);
			     var arr=table.cache.studentManage;
			     //判断页面有没有加红的数据
			     if($(".redData").length!=0){
			    	 layer.msg("请检查页面加红的数据!",{time:2000});
			    	 layer.close(index);
			    	 return;
			     }
				 for(var item of arr){
					 item.deviceName="";
					 item.remark="";
					 if(item.deviceSn==undefined){
						 item.deviceSn="";
					 }
					 if(item.ringCode==undefined){
						 item.ringCode="";
					 }
					 if(item.factory==undefined){
						 item.factory="";
					 }
				 }
				 console.log(arr);
			     $.ajax({
			    	 url:url+'/ring/insertRingBatch',
			    	 type:"post",
			    	 data:{"ringList":JSON.stringify(arr)},
			    	// contentType:"application/json",
			    	 success:function(res){
			    		 layer.close(index);
			    		 if(res.result){
			    			 layer.msg(res.msg,{time:1000},function(){
			    				 parent.layer.closeAll();
			    				 window.parent.location.reload();
			    			 })
			    		 }else{
			    			 layer.msg(res.msg,{time:2000});
			    		 }
			    	 },
			    	 error:function(){
			    		 layer.close(index);
			    	 }
			     })
		    });
			 //点击取消
			 $("#resetData").click(function(){
				 parent.layer.closeAll();
			 })
	})
}
