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
	 
	 //监听开关
	 form.on('switch(sexDemo)', function(data){
	      var status=this.checked?"1":"0";
	      var fid=data.value;
	      var obj={"fid":fid,"status":status};
	      //updateDeviceStatus(obj);
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
		    url:url+'/flowPay/getList',
		    cellMinWidth: 80,
		    request:{
		    	pageName:"curpage",
		    	limitName:"pagesize",
		    },
		    parseData: function(res){ //res 即为原始返回的数据
		    	console.log(res)
		        return {
		          "code": res.result==true?"0":"", //解析接口状态
		          "msg": res.msg, //解析提示文本
		          "count": res.count, //解析数据长度
		          "data": res.data //解析数据列表
		        };
		      },
		    cols: [[
	    	  {field:'MODELNAME', title:'模板名称', width:150},
		      {field:'CHARGE', title:'应收金额', width:120,sort:true},
		      {field:'DISCOUNT', title:'折扣', width:150,sort:true},
		      {field:'REALCHARGE', title:'实收金额', width:150,sort:true},
		      {field:'DAYS', title:'有效天数', width:150,sort:true},
		      {field:'EDITORNAME', title:'操作人', width:95,},
		      {field:'EDITEDATE', title:'操作日期', width:200,sort:true,templet:function(d){
		    	  if(d.EDITEDATE==undefined||d.EDITEDATE==null||d.EDITEDATE==""){
		    		  return "";
		    	  }else{
		    		  return resolvingDate(d.EDITEDATE);
		    	  }
		      }},
		      {field:'STATUS', title:'状态', width:100, templet: '#switchTpl',sort:true},
		      {field:'REMARK', title:'备注', width:353,},
		      {fixed: 'right', title:'操作',width:160, templet:function(d){
		    	  if(d.STATUS==1){
		    		  var $a1="<a class='layui-btn layui-btn-normal layui-btn-xs layui-bg-gray'><i class='layui-icon layui-icon-edit'></i>编辑</a>";
		    		  var $a2="<a class='layui-btn layui-btn-danger layui-btn-xs layui-bg-gray'><i class='layui-icon layui-icon-delete'></i>删除</a>";
		    		  for(var item of window.top.arr){
		    			  if(item.UUID=="2226F6501A1245398E8561FA19132A92"){//编辑
		    				  $a1="<a class='layui-btn layui-btn-normal layui-btn-xs' lay-event='edit'><i class='layui-icon layui-icon-edit'></i>编辑</a>";
		    			  }
		    		  }
		    		  return $a1+$a2;
		    	  }else{
		    		  var $a1="<a class='layui-btn layui-btn-normal layui-btn-xs layui-bg-gray'><i class='layui-icon layui-icon-edit'></i>编辑</a>";
		    		  var $a2="<a class='layui-btn layui-btn-danger layui-btn-xs layui-bg-gray'><i class='layui-icon layui-icon-delete'></i>删除</a>";
		    		  for(var item of window.top.arr){
		    			  if(item.UUID=="2226F6501A1245398E8561FA19132A92"){//编辑
		    				  $a1="<a class='layui-btn layui-btn-normal layui-btn-xs' lay-event='edit'><i class='layui-icon layui-icon-edit'></i>编辑</a>";
		    			  }
		    			  if(item.UUID=="336ACBC95F5342D9A97169320FAE6222"){//删除
		    				  $a2="<a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'><i class='layui-icon layui-icon-delete'></i>删除</a>";
		    			  }
		    		  }
		    		  return $a1+$a2;
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
	        	url:url+"/flowPay/delOneInfo",
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
		    	 title:"修改模板",
		    	 content:"payModel_add.html?fid="+data.FID,
		    	 area:["90%","91%"],
		     })
	    }
	  });
	  $('.test-table-schoolManagement-btn .layui-btn').on('click', function(){
	      var type = $(this).data('type');
	     layer.open({
	    	 type:2,
	    	 title:"添加模板",
	    	 content:"payModel_add.html",
	    	 area:["90%","91%"],
	     })
	  });
})
function updateDeviceStatus(obj){
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
