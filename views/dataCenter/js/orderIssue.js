$(function(){
	openReader();    // 默认页面打开，就自动打开连接
	initTable([]);
})
$(".layui-btn").hide();
setTimeout(function(){
	for(var item of window.top.arr){
		$("button[data-uid="+item.UUID+"]").show();
	}
},50)
//websocket连接
var socket;
var arr=[];
function openReader() {
	var host = ws+"EducationManager/websocket/2";
	if(socket == null){
		socket = new WebSocket(host);
	}else{
		console.log("已初始化.");
	}
	try {
		
		socket.onopen = function () {
			console.log("初始化成功.");
		};
		
		socket.onclose = function (e) {
			console.log("连接已经断开.");
		};
		
		socket.onerror = function(){
			layer.msg("连接异常.",{time:2000});
		};
		
		socket.onmessage = function (msg) {
			console.log(msg);
				if(isJsonObj(msg.data)){
					var res=JSON.parse(msg.data);
					if(res.orderName=="btemp2"){
						var studentInfo=res.studentInfo;
						var schoolid=window.top.$("#nowSchool").val();
						if(studentInfo.SCHOOLID==schoolid){
							arr.push({
								"studentNo":studentInfo.STUDENTNO,
								"studentName":studentInfo.STUDENTNAME,
								"className":studentInfo.CLASSNAME,
								"gradeName":studentInfo.GRADENAME,
								"term":studentInfo.TERM,
								"yearName":studentInfo.YEARNAME,
								"temperature":res.temp,
								"remark1":"",
								"remark2":"",
								"remark3":""
							})
							initTable(arr);
						}
					}
				}
		};
	}
	catch (ex) {
		layer.msg("连接异常.",{time:2000});
	}
}

//判断字符串是不是json格式
function isJsonObj(str) {
         try {
                if (typeof JSON.parse(str) == "object") {
                       return true;
                 }
          } catch(e) {
          }
       return false;
}


//一键测温
function testTemperature() {
	try {
		if (socket.readyState == 1) {
			var schoolid=window.top.$("#nowSchool").val();
			var obj={
					    "orderName":"pc:@@@YYYYYYYYYY@@@[3G--YYYYYYYYYY--0002--LK]@@@[3G--YYYYYYYYYY--0009--bodytemp2]",
					    "schoolID":schoolid
					};
			socket.send(JSON.stringify(obj));
		}
		else {
			layer.msg("连接异常",{time:2000});
		}
	}
	catch (ex) {
		layer.msg("连接异常.",{time:2000});
	}
}


/*
 * 唯一标识
var tid = guid();
*//**
 *获取id
 *//*
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
console.log(tid);*/

//初始化表格
function initTable(res){
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
			    cellMinWidth: 80,
			    cols: [[
		    	  {field:'studentNo', title:'学号', width:150},
			      {field:'studentName', title:'姓名', width:150,sort:true},
			      /*{field:'SEX', title:'性别', width:220,sort:true},
			      {field:'AGE', title:'年龄', width:95,},
			      {field:'IDCARD', title:'身份证号', width:300,sort:true},*/
			      {field:'className', title:'班级', width:150,sort:true},
			      {field:'gradeName', title:'年级', width:150,},
			      {field:'term', title:'学期', width:150,},
			      {field:'yearName', title:'学年', width:200,},
			      {field:'temperature', title:'体温℃', width:150,},
			      {field:'remark1', title:'心率', width:150,},
			      {field:'remark2', title:'血压', width:150,},
			      {field:'remark3', title:'日期', width:228,},
			    ]],
			    data:res,
			    page: true
			  });
		  $('.test-table-schoolManagement-btn .layui-btn').on('click', function(){
		      var type = $(this).data('type');
		      layer.confirm("确定下发命令?",{title:"提示"},function(index){
		    	  layer.close(index);
		    	  if(type="temperature"){
			    	  testTemperature();
			      }
		      })
		      
		  });
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
	  return times;
}
