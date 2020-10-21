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
	        	console.log(res)
	          var val=res.data;
	          layer.msg(res.msg,{time:2000});
	          initTable([]);
	          if(res.result){
	        	  var arr=[];
	        	  for(var item of val){
	        		  if(item[1]!=null&&item[1]!=""){
	        			  var obj={
		        				  "studentNo":item[0],
		        				  "studentName":item[1],
		        				  "IDCard":item[2],
		        				  "sex":item[3],
		        				  "age":item[4],
		        				  "nationality":item[5],
		        				  "nation":item[6],
		        				  "homePlace":item[7],
		        				  "className":item[8],
		        				  "gradeName":item[9],
		        				  "term":item[10],
		        			      "yearName":item[11],
	        			    	  "firstParent":item[12],
		        			      "phone1":item[13],
	        			    	  "secondParent":item[14],
		        			      "phone2":item[15],
		        			      "remark":item[16],
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
			      {field:'studentNo', title:'学号', width:100,templet:function(d){
			    	  if(d.studentNo==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.studentNo;
			    	  }
			      }},
			      {field:'studentName', title:'姓名', width:100,templet:function(d){
			    	  if(d.studentName==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.studentName;
			    	  }
			      }},
			      {field:'IDCard', title:'身份证号', width:200,sort:true,templet:function(d){
			    	  if(d.IDCard==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.IDCard;
			    	  }
			      }},
			      {field:'sex', title:'性别', width:100,sort:true},
			      {field:'age', title:'年龄', width:100,sort:true},
			      {field:'nationality', title:'国籍', width:100,sort:true},
			      {field:'nation', title:'民族', width:100,sort:true},
			      {field:'homePlace', title:'家庭住址', width:200,sort:true},
			      {field:'className', title: '班级', Width:80,sort:true,templet:function(d){
			    	  if(d.className==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.className;
			    	  }
			      }},
			      {field:'gradeName', title: '年级', Width:80,sort:true,templet:function(d){
			    	  if(d.gradeName==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.gradeName;
			    	  }
			      }},
			      {field:'term', title: '学期', Width:80,sort:true,templet:function(d){
			    	  if(d.term==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.term;
			    	  }
			      }},
			      {field:'yearName', title: '学年', Width:80,sort:true,templet:function(d){
			    	  if(d.yearName==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.yearName;
			    	  }
			      }},
			      {field:'firstParent', title: '第一联系人', Width:200,sort:true,templet:function(d){
			    	  if(d.firstParent==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.firstParent;
			    	  }
			      }},
			      {field:'phone1', title: '联系电话', Width:200,sort:true,templet:function(d){
			    	  if(d.phone1==null){
			    		  return  "<div class='redData' style='color:red'>请填写</div>";
			    	  }else{
			    		  return d.phone1;
			    	  }
			      }},
			      {field:'secondParent', title: '第二联系人', Width:200,sort:true},
			      {field:'phone2', title: '联系电话', Width:200,sort:true},
			      {field:'remark', title: '备注', Width:100},
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
					 var birthday=getBirthdayFromIdCard(item.IDCard);
					 item.birthDay=birthday;
					 if(item.sex==undefined){
						 item.sex="";
					 }
					 if(item.age==undefined){
						 item.age="";
					 }
					 if(item.nationality==undefined){
						 item.nationality="";
					 }
					 if(item.nation==undefined){
						 item.nation="";
					 }
					 if(item.homePlace==undefined){
						 item.homePlace="";
					 }
					 if(item.phone2==undefined){
						 item.phone2="";
					 }
					 if(item.secondParent==undefined){
						 item.secondParent="";
					 }
					 if(item.remark==undefined){
						 item.remark="";
					 }
				 }
				 console.log(arr)
			     $.ajax({
			    	 url:url+'/stu/insertStuBatch',
			    	 type:"post",
			    	 data:{"stuList":JSON.stringify(arr)},
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
//身份证号截取出生年月
function getBirthdayFromIdCard(idCard) {  
    var birthday = "";  
    if(idCard != null && idCard != ""){  
        if(idCard.length == 15){  
            birthday = "19"+idCard.substr(6,6);  
        } else if(idCard.length == 18){  
            birthday = idCard.substr(6,8);  
        }  
        birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");  
    }  
    return birthday;  
}
