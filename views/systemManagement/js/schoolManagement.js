layui.use(["form","table"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table;
	 
	 //监听开关
	 form.on('switch(sexDemo)', function(data){
	      var status=this.checked?"1":"0";
	      var fid=data.value;
	      var obj={"fid":fid,"status":status};
	       updateSchoolStatus(obj);
    });
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
		    url:url+'/school/getList',
		    cellMinWidth: 80,
		    request:{
		    	pageName:"curpage",
		    	limitName:"pagesize",
		    },
		    parseData: function(res){ //res 即为原始返回的数据
		    	console.log(res);
		        return {
		          "code": res.result==true?"0":"", //解析接口状态
		          "msg": res.msg, //解析提示文本
		          "count": res.count, //解析数据长度
		          "data": res.data //解析数据列表
		        };
		      },
		    cols: [[
		      {field:'SCHOOLNAME', title:'校区名称', width:150},
		      {field:'SCHOOLIMG', title:'校徽', width:150,templet:function(d){
		    	  if(d.SCHOOLIMG!=null&&d.SCHOOLIMG!=undefined&&d.SCHOOLIMG!=""){
		    		  return  "<img src='data:image/png;base64,"+d.SCHOOLIMG+"' style='width:60px'>";
		    	  }else{
		    		  return "";
		    	  }
		      }},
		      {field:'LOCATION', title:'位置', width:150,},
		      {field:'POINT', title: '坐标', minWidth:80,},
		      {field:'SCALE', title:'规模', width:85,sort:true},
		      {field:'TYPE', title:'类型', width:85,},
		      {field:'MANAGER', title:'管理人', width:85,},
		      {field:'PHONE', title:'联系电话', width:120,},
		      {field:'EDIORNAME', title:'操作人', width:85,},
		      {field:'EDITEDATE', title:'操作日期', width:200,sort:true},
		      {field:'STATUS', title:'状态', width:100, templet: '#switchTpl',sort:true},
		      {field:'REMARK', title:'备注', width:85,},
		      {fixed: 'right', title:'操作',width:160, templet:function(d){
		    	  if(d.STATUS==1){
		    		  return "<a class='layui-btn layui-btn-normal layui-btn-xs' lay-event='edit'><i class='layui-icon layui-icon-edit'></i>编辑</a>"+
		                     "<a class='layui-btn layui-btn-danger layui-btn-xs layui-bg-gray'><i class='layui-icon layui-icon-delete'></i>删除</a>";
		    	  }else{
		    		  return "<a class='layui-btn layui-btn-normal layui-btn-xs' lay-event='edit'><i class='layui-icon layui-icon-edit'></i>编辑</a>"+
	                          "<a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'><i class='layui-icon layui-icon-delete'></i>删除</a>";
		    	  }
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
	        	url:url+"/school/delOneSchool",
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
		    	 title:"修改校区",
		    	 content:"school_add.html?fid="+data.FID,
		    	 area:["90%","91%"],
		     })
	    }
	  });
	  $('.test-table-schoolManagement-btn .layui-btn').on('click', function(){
	      var type = $(this).data('type');
	     layer.open({
	    	 type:2,
	    	 title:"添加校区",
	    	 content:"school_add.html",
	    	 area:["90%","91%"],
	     })
	  });
})
function updateSchoolStatus(obj){
	$.ajax({
		url:url+"/school/updateSchoolStatus",
		type:"post",
		data:obj,
		success:function(data){
			layer.msg(data.msg);
			if(data.result){
				layui.use("table",function(){
					var table = layui.table;
					table.reload('LAY-user-manage');
				})
				 
			}
		}
	})
}

