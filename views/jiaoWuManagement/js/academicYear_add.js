//var status=1;
if(getUrlParam("fid")!=undefined&&getUrlParam("fid")!=null&&getUrlParam("fid")!=""){//编辑
	getOneInfo();
}
layui.use(["form","table","laydate"],function(){
	 var $ = layui.$,
	  form = layui.form,
	  table = layui.table,
	  laydate = layui.laydate;
//	 //监听开关
//	 form.on('switch(component-form-switchTest)', function(data){
//	       status=this.checked?"1":"0";
//    });
	 lay('.date').each(function() {
			laydate.render({
				elem : this,//元素
				trigger : 'click',//怎么触发
			});
		});
	 
	//监听提交按钮    
	 form.on('submit(component-form-demo1)', function(data){
		 if($("#fid").hasClass("layui-disabled")){
			 var optType=2;
		 }else{
			 var optType=1;
		 }
	     var obj=data.field;
	     obj.optType=optType;
	     console.log(obj);
	     $.ajax({
	    	 url:url+'/yearInfo/addInfo',
	    	 type:"post",
	    	 data:obj,
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
	 //点击重置
	 $("#resetData").click(function(){
		 $("#yearName").val("");
		 $("#fid").val("");
		 $("#nowSchool").val("");
		 $("#term1StartDate").val("");
		 $("#term1EndDate").val("");
		 $("#term2StartDate").val("");
		 $("#term2EndDate").val("");
		 $("#remark").val("");
	 })
})
//编辑时获取一条信息
function getOneInfo(){
	$.ajax({
		url:url+"/yearInfo/getOneInfo",
		type:"post",
		data:{"fid":getUrlParam("fid")},
		success:function(data){
			console.log(data);
			if(data.result){
				$("#fid").val(data.data.FID).attr("readonly","readonly").addClass("layui-disabled");
				 $("#yearName").val(data.data.YEARNAME);
				 $("#term1StartDate").val(data.data.TERM1STARTDATE);
				 $("#term1EndDate").val(data.data.TERM1ENDDATE);
				 $("#term2StartDate").val(data.data.TERM2STARTDATE);
				 $("#term2EndDate").val(data.data.TERM2ENDDATE);
				 $("#remark").val(data.data.REMARK);
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
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}