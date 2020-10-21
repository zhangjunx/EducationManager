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
			    url:url+"/location/getLocationRecord",
			    cellMinWidth: 80,
			    where:{"studentID":getUrlParam("fid"),"today":resolvingDate(getUrlParam("date"))},
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
		    	  {field:'STUDENTNO', title:'学号', width:150},
			      {field:'STUDENTNAME', title:'姓名', width:150,sort:true},
			      /*{field:'SEX', title:'性别', width:220,sort:true},
			      {field:'AGE', title:'年龄', width:95,},
			      {field:'IDCARD', title:'身份证号', width:300,sort:true},*/
			      {field:'CLASSNAME', title:'班级', width:150,sort:true},
			      {field:'GRADENAME', title:'年级', width:150,},
			      {field:'TERM', title:'学期', width:150,},
			      {field:'YEARNAME', title:'学年', width:182,},
			      {field:'BAIDULOCAL', title:'位置', width:300,templet:function(d){
			    	  if(d.BAIDULOCAL == undefined){
			    		  return d.GAODELOCAL;
			    	  }else if(d.GAODELOCAL == undefined){
			    		  return d.BAIDULOCAL;
			    	  }else {
			    		  return "";
			    	  }
			      }},
			      {field:'UPLOADTIME', title:'日期', width:210,},
			    ]],
			    page: true
			  });
	})
//url地址中解析参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
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
	  let times=d.getFullYear() + '-' + month + '-' + day;
	  return times
}
