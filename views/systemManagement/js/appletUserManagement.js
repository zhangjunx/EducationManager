layui.use(["form","table"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table;
	 
	 //监听开关
	 form.on('switch(sexDemo)', function(data){
	      var status=this.checked?"1":"0";
	      var fid=data.value;
	      var obj={"fid":fid,"status":status};
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
		    url:url+'/parentUser/getList',
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
		    cols:  [[
		    	  {field:'NAME', title:'姓名', width:150},
//			      {field:'RELATION', title:'与学生关系', width:150,sort:true},
			      {field:'PHONENUM', title:'手机号', width:220,sort:true},
			      {field:'STUDENTS', title:'学生', width:220,sort:true},
			      {field:'CREATEDATE', title:'注册日期', width:300,sort:true,templet:function(d){
			    	  if(d.CREATEDATE==undefined||d.CREATEDATE==null||d.CREATEDATE==""){
			    		  return "";
			    	  }else{
			    		  return resolvingDate(d.CREATEDATE);  
			    	  }
			      }},
			      {field:'STATUS', title:'状态', width:185, templet: '#switchTpl',sort:true},
			      {field:'REMARK', title:'备注', width:550,},
			    ]]
		    ,page: true
		  });
})
function updateDeviceStatus(obj){
	$.ajax({
		url:url+"/parentUser/updateUserStatus",
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
