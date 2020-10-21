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
		        				  "userName":item[0],
		        				  "password":item[1],
		        				  "name":item[2],
		        				  "sex":item[3],
		        				  "IDCard":item[4],
		        				  "phoneNum":item[5],
		        				  "remark":item[6],
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
			      {field:'userName', title:'账号', width:100,templet:function(d){
			    	  if(d.userName==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.userName;
			    	  }
			      }},
			      {field:'name', title:'姓名', width:100,templet:function(d){
			    	  if(d.name==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.name;
			    	  }
			      }},
			      {field:'sex', title:'性别', width:100,templet:function(d){
			    	  if(d.sex==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.sex;
			    	  }
			      }},
			      {field:'IDCard', title:'身份证号', width:300,templet:function(d){
			    	  if(d.IDCard==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.IDCard;
			    	  }
			      }},
			      {field:'phoneNum', title:'联系电话', width:200,templet:function(d){
			    	  if(d.phoneNum==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.phoneNum;
			    	  }
			      }},
			      {field:'remark', title:'备注', width:300,templet:function(d){
			    	  if(d.remark==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.remark;
			    	  }
			      }},
			    ]],
			    data:res,
			    page: true,
			  });
		//监听提交按钮    
			 form.on('submit(component-form-demo1)', function(data){
			     var arr=table.cache.studentManage;
			     //判断页面有没有加红的数据
			     if($(".redData").length!=0){
			    	 layer.msg("请检查页面加红的数据!",{time:2000});
			    	 return;
			     }
			     for(var item of arr){
			    	 item.image="";
			     }
				 console.log(arr);
			     $.ajax({
			    	 url:url+'/teacherUser/insertTecBatch',
			    	 type:"post",
			    	 data:{"tecList":JSON.stringify(arr)},
			    	// contentType:"application/json",
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
			 //点击取消
			 $("#resetData").click(function(){
				 parent.layer.closeAll();
			 })
	})
}
