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
	    table.reload('studentManage', {
	      where: field
	    });
	  });
	  table.render({
		    elem: '#studentManage',
		    url:url+'/public/getClassList',
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
		      {type:"checkbox",},
		      {field:'CLASSNAME', title:'班级名称', width:200},
		      {field:'GRADENAME', title:'归属年级', width:200},
		      {field:'MINNUM', title:'最低人数', width:150,sort:true},
		      {field:'MAXNUM', title: '满编人数', Width:80,sort:true},
		      {field:'EDITORNAME', title:'操作人', width:150,},
		      {field:'EDITEDATE', title:'操作日期', width:250,sort:true,templet:function(d){
		    	  if(d.EDITEDATE==undefined||d.EDITEDATE==null||d.EDITEDATE==""){
		    		  return "";
		    	  }else{
		    		  return resolvingDate(d.EDITEDATE);  
		    	  }
		      }},
		      //{field:'STATUS', title:'状态', width:100, templet: '#switchTpl',},
		      {field:'REMARK', title:'备注', width:300,},
		    ]],
		    done:function(res){
		    	var data=res.data;
		    	var str=getUrlParam("str");
		    	var arr=str.split(",");
		    	for(var item of arr){
		    		for(var i=0;i<data.length;i++){
		    			if(item==data[i].FID){
		    				data[i].LAY_CHECKED=true;
		    				$('tr[data-index=' +i + '] input[type="checkbox"]').prop('checked', true);
	    				    $('tr[data-index=' + i + '] input[type="checkbox"]').next().addClass('layui-form-checked');
		    			}
		    		}
		    	}
		    },
		    page: true
		  });
	  
	//监听提交按钮    
		 form.on('submit(component-form-demo1)', function(data){
			 var arr=table.cache.studentManage;
			 var fid=getUrlParam("fid");
			 var list=[];
			 for(var item of arr){
				 if(item.LAY_CHECKED==true){
					 list.push({
						 "classID":item.FID
					 })
				 }
			 }
		     $.ajax({
		    	 url:url+'/teacherUser/setClassLimit',
		    	 type:"post",
		    	 data:{"classList":JSON.stringify(list),"fid":fid},
		    	 success:function(res){
		    		 console.log(res);
		    		 if(res.result){
		    			 layer.msg(res.msg,{time:1000},function(){
		    				 parent.layer.closeAll();
		    				 window.parent.location.reload();
		    			 })
		    		 }else{
		    			 layer.msg(res.msg,{time:2000});
		    		 }
		    	 }
		     })
	    });
		 //点击取消
		 $("#resetData").click(function(){
			 parent.layer.closeAll();
		 })
		 
	  
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
//url地址中解析参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}