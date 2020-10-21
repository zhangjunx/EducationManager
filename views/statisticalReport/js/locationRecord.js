$(function(){
	getGradeList();//初始化年级下拉框
	getClassList();//初始化班级下拉框
})

	layui.use(["form","table"],function(){
		 var $ = layui.$,
		  form = layui.form,
		  table = layui.table;
		 
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
			    url:url+"/location/getNewLocation",
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
			    cellMinWidth: 80,
			    cols: [[
		    	  {field:'STUDENTNO', title:'学号', width:150},
			      {field:'STUDENTNAME', title:'姓名', width:120,sort:true},
			      /*{field:'SEX', title:'性别', width:220,sort:true},
			      {field:'AGE', title:'年龄', width:95,},
			      {field:'IDCARD', title:'身份证号', width:300,sort:true},*/
			      {field:'YEARNAME', title:'学年', width:150,},
			      {field:'TERM', title:'学期', width:150,},
			      {field:'GRADENAME', title:'年级', width:150,},
			      {field:'CLASSNAME', title:'班级', width:150,sort:true},
			      {field:'BAIDULOCAL', title:'当前位置', width:500,templet:function(d){
			    	  if(d.BAIDULOCAL == undefined){
			    		  return d.GAODELOCAL;
			    	  }else if(d.GAODELOCAL == undefined){
			    		  return d.BAIDULOCAL;
			    	  }else {
			    		  return "";
			    	  }
			      }},
			      {field:'UPLOADTIME', title:'日期', width:228,},
			      {fixed:'right', title:'操作', width:150,templet:function(d){
			    	  return "<a class='layui-btn layui-btn-normal layui-btn-xs' lay-event='edit'><i class='layui-icon layui-icon-edit'></i>记录 </a>";
			      }},
			    ]],
			    page: true
			  });
		  table.on('tool(LAY-user-manage)', function(obj){
			    var data = obj.data;
			if(obj.event === 'edit'){
			    	 layer.open({
				    	 type:2,
				    	 title:"位置记录",
				    	 content:"locationRecord_details.html?fid="+data.STUDENTID+"&date="+data.UPLOADTIME+"",
				    	 area:["90%","91%"],
				     })
			    }
	      });
	})

//获取当前用户下的校区
function getThisLoginSchoolList(){
	  $.ajax({
		  url:url+"/login/getThisLoginSchoolList",
		  type:"post",
		  success:function(data){
			  $("#schoolName option").find("not:first").remove();
			  if(data.result){
				  var res=data.data;
				  for(var item of res){
					  var $opt=$("<option value='"+item.SCHOOLID+"'>"+item.SCHOOLNAME+"</option>");
					  $("#schoolName").append($opt);
				  }
				  layui.use("form",function(){
					  var form=layui.form;
				  	  form.render();
				   })
		      }
	  	  }
	 })
} 
//初始化年级下拉框
function getGradeList(){
	$.ajax({
		url:url+"/public/getGradeList",
		type:"post",
		success:function(data){
			if(data.result){
				for(var item of data.data){
					var $opt=$("<option value="+item.FID+">"+item.GRADENAME+"</option>");
					$("#gradeID").append($opt);
				}
				layui.use("form",function(){
					var form=layui.form;
					form.render();
				})
			}
		}
	})
}
//初始化班级下拉框
function getClassList(){
	$.ajax({
		url:url+"/public/getClassList",
		type:"post",
		success:function(data){
			if(data.result){
				for(var item of data.data){
					var $opt=$("<option value="+item.FID+">"+item.CLASSNAME+"</option>");
					$("#classID").append($opt);
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
