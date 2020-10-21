layui.use(["form","table"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table;
	 
//	 //监听开关
//	 form.on('switch(sexDemo)', function(data){
//	      var status=this.checked?"1":"0";
//	      var fid=data.value;
//	      var obj={"fid":fid,"status":status};
//	      updateDeviceStatus(obj);
//    });
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
		    url:url+'/sysLog/getList',
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
		    	  {field:'OPERATORNAME', title:'操作人员', width:100},
			      {field:'OPERATEDATE', title:'操作时间', width:200,sort:true,templet:function(d){
			    	  if(d.OPERATEDATE==undefined||d.OPERATEDATE==null||d.OPERATEDATE==""){
			    		  return "";
			    	  }else{
			    		  return resolvingDate(d.OPERATEDATE);  
			    	  }
			      }},
			     {field:'OPERATEFUNC', title:'操作方法', width:224,sort:true},
			      {field:'DESCRIPTION', title:'操作描述', width:340,sort:true},
			      {field:'IP', title:'请求IP', width:150,sort:true,},
			      {field:'CURD', title:'CURD', width:150,sort:true},
			      {field:'PARM', title:'请求参数', width:250,},
			      {field:'OPERATEDEVICE', title:'操作设备', width:100},
			      {field:'USERTYPE', title:'用户类型', width:99},
			    ]]
		    ,page: true
		  });
})
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
