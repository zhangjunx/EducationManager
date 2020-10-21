$(function(){
	//获取当前用户下的校区
	getThisLoginSchoolList();
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
		    url:url+'/ring/getList',
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
	    	  {field:'STUDENTNO', title:'学号', width:150},
		      {field:'STUDENTNAME', title:'姓名', width:150,sort:true},
		      /*{field:'SEX', title:'性别', width:220,sort:true},
		      {field:'AGE', title:'年龄', width:95,},
		      {field:'IDCARD', title:'身份证号', width:300,sort:true},*/
		      {field:'CLASSNAME', title:'班级', width:150,sort:true},
		      {field:'GRADENAME', title:'年级', width:150,},
		      {field:'TERM', title:'学期', width:150,},
		      {field:'YEARNAME', title:'学年', width:200,},
		      {field:'REMARK', title:'体温', width:150,},
		      {field:'REMARK', title:'心率', width:150,},
		      {field:'REMARK', title:'血压', width:150,},
		      {field:'REMARK', title:'日期', width:228,},
		    ]],
		    page: true
		  });
	  $('.test-table-schoolManagement-btn .layui-btn').on('click', function(){
	      var type = $(this).data('type');
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
					$("#gradeName").append($opt);
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
					$("#className").append($opt);
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
