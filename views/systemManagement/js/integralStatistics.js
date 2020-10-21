getYearList();
layui.use(["form","table"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table;
	  //监听搜索
	  form.on('submit(LAY-user-front-search)', function(data){
	    var field = data.field;
	    var startDate="";
	    var endDate="";
	    var year=$("#yearID").val();
	    if(field.term=="上学期"){
	    	startDate=year+"-09-01";
	    	endDate=parseInt(year)+1+"-03-01";
	    }else if(field.term=="下学期"){
	    	startDate=parseInt(year)+1+"-03-01";
	    	endDate=parseInt(year)+1+"-09-01";
	    }
	    field.startDate=startDate;
	    field.endDate=endDate;
	    console.log(field);
	    //执行重载
	    table.reload('LAY-user-manage', {
	      where: field
	    });
	  });
	  table.render({
		    elem: '#LAY-user-manage',
		    url:url+'/value/getValueList',
		    cellMinWidth: 80,
		    where:{
		    	"yearID":$("#yearID").val(),
		    	"term":"上学期",
		    	"startDate":$("#yearID").val()+"-09-01",
		    	"endDate":parseInt($("#yearID").val())+1+"-03-01"
		    },	
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
		    cols:  [[
		    	  {field:'NAME', title:'家长姓名', width:300},
			      {field:'STUDENTNAMES', title:'学生姓名', width:700,sort:true,},
			      {field:'PHONENUM', title:'联系电话', width:410,sort:true},
			      {field:'loginValue', title:'积分', width:224,sort:true,template:function(d){
			    	  var loginValue=(d.loginValue==undefined?0:d.loginValue);
			    	  var scoreValue=(d.scoreValue==undefined?0:d.scoreValue);
			    	  return loginValue+scoreValue;
			      }},
			    ]]
		    ,page: true
		  });
})
//初始化学年下拉框
function getYearList(){
	$.ajax({
		url:url+"/public/getYearList",
		type:"post",
		async:false,
		success:function(data){
			$("#yearID option").empty();
			if(data.result){
				for(var item of data.data){
					var $opt=$("<option value="+item.FID+">"+item.YEARNAME+"</option>");
					$("#yearID").append($opt);
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
