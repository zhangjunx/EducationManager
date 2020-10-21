getSchoolList();//初始化学校下拉框
if(window.top.usercode!="0"){//usercode为0是超级管理员
	$(".add").hide();
	setTimeout(function(){
		for(var item of window.top.arr){
			$("button[data-uid="+item.UUID+"]").show();
		}
	},50)
}
layui.use(["form","table"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table;
	 
	 //监听开关
	 form.on('switch(sexDemo)', function(data){
	      var status=this.checked?"1":"0";
	      var fid=data.value;
	      var jobName=$(this).attr("data-jobname");
	      var groupName=$(this).attr("data-jobgroup");
	      var className=$(this).attr("data-classname");
	      var cron=$(this).attr("data-cron");
	      var obj={"fid":fid,"status":status,"jobName":jobName,"groupName":groupName,"className":className,"cron":cron};
	      console.log(obj);
	      updateDeviceStatus(obj);
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
		    url:url+'/eduHelp/getList',
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
	    	  {field:'STUDENTNAME', title:'助学对象', width:150},
		      {field:'PHONENUM', title:'联系方式', width:150,sort:true},
		      {field:'SCHOOLNAME', title:'归属校区', width:150,sort:true},
		      {field:'RUNTIME', title:'时间', width:200,},
		      {field:'DESCRIPTION', title:'活动描述', width:520,},
		      {field:'EDITORNAME', title:'操作人', width:100,},
		      {field:'EDITEDATE', title:'操作日期', width:200,},
		      {fixed: 'right', title:'操作',width:160, templet:function(d){
		    	  	if(window.top.usercode==0){
		    	  		var $a1="<a class='layui-btn layui-btn-normal layui-btn-xs' lay-event='edit'><i class='layui-icon layui-icon-edit'></i>编辑</a>";
			    	  	var $a2= "<a class='layui-btn layui-btn-danger layui-btn-xs' lay-event='del'><i class='layui-icon layui-icon-delete'></i>删除</a>";
			    	  	return $a1+$a2;
		    	  	}else{
		    	  		var $a1="<a class='layui-btn layui-btn-normal layui-btn-xs layui-bg-gray'><i class='layui-icon layui-icon-edit'></i>编辑</a>";
			    	  	var $a2= "<a class='layui-btn layui-btn-danger layui-btn-xs layui-bg-gray'><i class='layui-icon layui-icon-delete'></i>删除</a>";
			    	  	for(var item of window.top.arr){
			    	  		if(item.UUID=="C2DA74F96D374D8F86FB9EF9671B856B"){//编辑
			    	  			$a1="<a class='layui-btn layui-btn-normal layui-btn-xs' lay-event='edit'><i class='layui-icon layui-icon-edit'></i>编辑</a>"
			    	  		}
			    	  		if(item.UUID=="6BB0C9BAF365497D8D26300E2A856ED1"){//删除
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
	        	url:url+"/eduHelp/delOneInfo",
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
		    	 title:"修改活动",
		    	 content:"publicWelfareEducation_add.html?fid="+data.FID,
		    	 area:["90%","91%"],
		     })
	    }
	  });
	  $('.test-table-schoolManagement-btn .layui-btn').on('click', function(){
	      var type = $(this).data('type');
	     layer.open({
	    	 type:2,
	    	 title:"添加活动",
	    	 content:"publicWelfareEducation_add.html",
	    	 area:["90%","91%"],
	     })
	  });
})

function updateDeviceStatus(obj){
	$.ajax({
		url:url+"/job/changeJobStatus",
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

//初始化学校下拉框
function getSchoolList(){
	$.ajax({
		url:url+"/school/getList",
		type:"post",
		success:function(data){
			$("#schoolID option").find("not:first").empty();
			if(data.result){
				for(var item of data.data){
					var $opt=$("<option value="+item.FID+">"+item.SCHOOLNAME+"</option>");
					$("#schoolID").append($opt);
				}
				layui.use("form",function(){
					var form=layui.form;
					form.render();
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

//url地址中解析参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var paramsString = window.location.search.substring(1);
    var r = window.decodeURIComponent(window.atob(paramsString)).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}