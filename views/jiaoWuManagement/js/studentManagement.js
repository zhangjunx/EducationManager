$(".add").hide();
setTimeout(function(){
	for(var item of window.top.arr){
		$("button[data-uid="+item.UUID+"]").show();
	}
},50)

layui.use(["form","table"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table;
	 
	/* //监听开关
	 form.on('switch(sexDemo)', function(data){
	      var status=this.checked?"1":"0";
	      var fid=data.value;
	      var obj={"fid":fid,"status":status};
	       updateSchoolStatus(obj);
    });*/
	  //监听搜索
	  form.on('submit(LAY-user-front-search)', function(data){
	    var field = data.field;
	    //执行重载
	    table.reload('LAY-user-manage', {
	      where: field
	    });
	  });
	  table.render({
		    elem: '#LAY-user-manage',
		    url:url+'/stu/getList',
		    cellMinWidth: 80,
		    request:{
		    	pageName:"curpage",
		    	limitName:"pagesize",
		    },
		    parseData: function(res){ //res 即为原始返回的数据
		        return {
		          "code": res.result==true?"0":"", //解析接口状态
		          "msg": res.msg, //解析提示文本
		          "count": res.count, //解析数据长度
		          "data": res.data //解析数据列表
		        };
		      },
		    cols: [[
		      {field:'STUDENTNO', title:'学号', width:140},
		      {field:'STUDENTNAME', title:'姓名', width:100},
		      {field:'SEX', title:'性别', width:80},
		      {field:'AGE', title:'年龄', width:80},
		      {field:'IDCARD', title:'身份证号', width:200,sort:true},
		      {field:'YEARNAME', title: '学年', width:150, sort:true},
		      {field:'TERM', title: '学期', Width:80,sort:true},
		      {field:'GRADENAME', title: '年级', width:200,sort:true},
		      {field:'CLASSNAME', title: '班级',width:150, sort:true},
		      {field:'EDITORNAME', title:'操作人', width:120,},
		      {field:'EDITEDATE', title:'操作日期', width:220,sort:true,templet:function(d){
		    	  if(d.EDITEDATE==undefined||d.EDITEDATE==null||d.EDITEDATE==""){
		    		  return "";
		    	  }else{
		    		  return resolvingDate(d.EDITEDATE);  
		    	  }
		      }},
		      {field:'REMARK', title:'备注', width:100,},
		      {fixed: 'right', title:'操作',width:160, templet:function(d){
		    	  var $a1="<a class='layui-btn layui-btn-normal layui-btn-xs layui-bg-gray' ><i class='layui-icon layui-icon-edit'></i>编辑</a>";
		    	  var $a2="<a class='layui-btn layui-btn-danger layui-btn-xs layui-bg-gray' ><i class='layui-icon layui-icon-delete'></i>删除</a>";
		    	  for(var item of window.top.arr){
		    		  if(item.UUID=="06BE90C3C285447EA368DCF52C4F7F11"){//编辑
		    			  $a1="<a class='layui-btn layui-btn-normal layui-btn-xs' lay-event='edit'><i class='layui-icon layui-icon-edit'></i>编辑</a>"
		    		  }
		    		  if(item.UUID=="87428F21A38845FAA7B18A1D204FA504"){//删除
		    			  $a2="<a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'><i class='layui-icon layui-icon-delete'></i>删除</a>";
		    		  }
		    	  }
		    		  return $a1+$a2;
		      }}
		    ]]
		    ,page: true
		  });
	//监听工具条
	  table.on('tool(LAY-user-manage)', function(obj){
	    var data = obj.data;
	   if(obj.event === 'del'){
	      layer.confirm('确定删除?', function(index){
	        $.ajax({
	        	url:url+"/stu/delOneStu",
	        	type:"post",
	        	data:{"fid":data.FID},
	        	success:function(res){
	        		layer.close(index);
	        		if(res.result){
	        			layer.msg(res.msg,{time:1000},function(){
	        				 obj.del();
	        			})
	        		}else{
	        			layer.msg(res.msg,{time:2000});
	        		}
	        	}
	        })
	      });
	    } else if(obj.event === 'edit'){
	    	 layer.open({
		    	 type:2,
		    	 title:"修改信息",
		    	 content:"student_add.html?fid="+data.FID,
		    	 area:["90%","91%"],
		     })
	    }
	  });
	  $('.test-table-schoolManagement-btn .layui-btn').on('click', function(){
	      var type = $(this).data('type');
	      if(type=="add"){
	    	   layer.open({
	  	    	 type:2,
	  	    	 title:"添加学生",
	  	    	 content:"student_add.html",
	  	    	 area:["90%","91%"],
	  	     })
	      }else if(type=="addBulk"){
	    	  layer.open({
		  	    	 type:2,
		  	    	 title:"批量导入",
		  	    	 content:"studentImport.html",
		  	    	 area:["90%","91%"],
		  	     })
	      }
	  });
})
/*function updateSchoolStatus(obj){
	$.ajax({
		url:url+"/school/updateSchoolStatus",
		type:"post",
		data:obj,
		success:function(data){
			layer.msg(data.msg);
		}
	})
}
*/
//转换日期格式
function resolvingDate(date){
	//date是传入的时间
	  let d = new Date(date);
	  let month = (d.getMonth() + 1) < 10 ? '0'+(d.getMonth() + 1) : (d.getMonth() + 1);
	  let day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
	  let hours = d.getHours()<10 ? '0'+d.getHours() : d.getHours();
	  let min = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
	  let sec = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
	  let times=d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec;
	  return times
}
