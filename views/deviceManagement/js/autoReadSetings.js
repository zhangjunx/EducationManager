$(function(){
	openReader();
	getList();
})
$(".layui-btn").hide();
setTimeout(function(){
	for(var item of window.top.arr){
		$("button[data-uid="+item.UUID+"]").show();
	}
},50)
layui.use(["laydate","form"],function(){
	 var laydate = layui.laydate;
	 var form=layui.form;
	 //监听开关
	 //计步设置
	/* form.on('switch(sexDemo)', function(data){
	      status=this.checked?"1":"0";
    });*/
	 
	 lay('.date').each(function() {
		laydate.render({
			elem: this,
			type:"time",
			format:"HH:mm",
			trigger:"click",
		});
	 })
})


//初始化命令数据
function getList(){
	 $.ajax({
    	 url:url+'/order/getList',
    	 type:"post",
    	 success:function(res){
    		 console.log(res);
    		 if(res.result){
    			 var data=res.data;
    			 for(var item of data){
    				 if(item.ORDERNAME == "UPLOAD"){//位置上传
    					 $("#locationTime").val(item.PARM);
    				 }else if(item.ORDERNAME == "PEDO"){//计步设置
    					 $("#stepByStep").val(item.PARM);
    				 }else if(item.ORDERNAME == "WALKTIME"){//计步时间段
    					 var arr=item.PARM.split("-");
    					 $("#stepStart").val(arr[0]);
    					 $("#stepEnd").val(arr[1]);
    				 }else if(item.ORDERNAME == "SILENCETIME2"){//免打扰时间段设置
    					 var list=item.PARM.split("-");
    					 for(var i=0;i<list.length;i++){
    						 $(".disturb").eq(i).val(list[i]);
    					 }
    				 }
    			 }
    			 layui.use('form', function(){
    				 var form = layui.form; 
    				 form.render();
    			})
    		 }
    	 }
     })
}



//点击位置上传命令下发
$("#locationSend").click(function(){
	var time=$("#locationTime").val();
	locationSend(time);
})
//点击计步开关命令下发
$("#stepSend").click(function(){
	var status=$("#stepByStep").val();
	stepSend(status);
})
//点击计步时间段下发
$("#stepTimeSend").click(function(){
	var startTime=$("#stepStart").val();
	var endTime=$("#stepEnd").val();
	if(startTime > endTime){
		layer.msg("开始时间不能大于结束时间!",{time:2000});
		return;
	}
	var time=startTime+"-"+endTime;
	stepTimeSend(time);
})

//点击免打扰命令下发
$("#disturbSend").click(function(){
	var time1=$("#startTime1").val()+"-"+$("#endTime1").val();
	var time2=$("#startTime2").val()+"-"+$("#endTime2").val();
	var time3=$("#startTime3").val()+"-"+$("#endTime3").val();
	var time4=$("#startTime4").val()+"-"+$("#endTime4").val();
	time1=time1.split("-");
	time2=time2.split("-");
	time3=time3.split("-");
	time4=time4.split("-");
	var timeData=[time1,time2,time3,time4];
	var result=merge(timeData);
	var arr=[];
	for(var item of result){
		var current=item[0]+"-"+item[1];
		arr.push(current);
	}
	arr=arr.join();
	disturbSend(arr);
})

//点击体温测量间隔下发
$("#temperatureSend").click(function(){
	var status=$("#temperatureSwitch").val();
	var time=$("#temperatureTime").val();
	temperatureSwitchSend(status,time);
})
//点击心率命令下发
$("#heartSend").click(function(){
	var time=$("#heartTime").val();
	heartSend(time);
})

//合并区间
function merge(arr){
    //排序
    arr.sort(function(a,b){
        if(a[0] != b[0]){
            return a[0]-b[0]
        }
        return a[1] - b[1]
    })
    let ans = [], start, end;
    console.log(arr)
    //排序之后，看看有没有重叠的，如果有，合并
    for(let i=0;i<arr.length;i++){
            let s = arr[i][0], e = arr[i][1];
            if(start === undefined){
                start = s, end = e;
            }else if(s <= end){
                if(e>end){
                	end=e;
                }else if(s!=""){
                	let part = [s, e];
                    ans.push(part)
                }
            }else{
                let part = [start, end];
                ans.push(part)
                start = s;
                end = e
            }
    }
    if(start !== undefined){
        let part = [start, end]
        ans.push(part)
    }
    
    return ans
}

//websocket连接
var socket;
function openReader() {
	var host = ws+"EducationManager/websocket/4";
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
		};
	}
	catch (ex) {
		layer.msg("连接异常.",{time:2000});
	}
}

//位置命令下发
function locationSend(time) {
	try {
		if (socket.readyState == 1) {
			var schoolid=window.top.$("#nowSchool").val();
			var length=time.length;
			length=length+7;
			var num=length.toString(16).toUpperCase();
			var str;
			if(num.length==1){
				str="000"+num;
			}else if(num.length==2){
				str="00"+num;
			}else if(num.length==3){
				str="0"+num;
			}else if(num.length==4){
				str=num;
			}
			var obj={
					    "orderName":"pc:@@@YYYYYYYYYY@@@[3G--YYYYYYYYYY--0002--LK]@@@[3G--YYYYYYYYYY--"+str+"--UPLOAD,"+time+"]",
					    "schoolID":schoolid
					};
			console.log(obj);
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

//计步命令下发
function stepSend(status) {
	try {
		if (socket.readyState == 1) {
			var schoolid=window.top.$("#nowSchool").val();
			
			var obj={
					    "orderName":"pc:@@@YYYYYYYYYY@@@[3G--YYYYYYYYYY--0002--LK]@@@[3G--YYYYYYYYYY--0006--PEDO,"+status+"]",
					    "schoolID":schoolid
					};
			console.log(obj);
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
//计步时间段下发
function stepTimeSend(time) {
	try {
		if (socket.readyState == 1) {
			var schoolid=window.top.$("#nowSchool").val();
			var length=time.length;
			length=length+9;
			var num=length.toString(16).toUpperCase();
			var str;
			if(num.length==1){
				str="000"+num;
			}else if(num.length==2){
				str="00"+num;
			}else if(num.length==3){
				str="0"+num;
			}else if(num.length==4){
				str=num;
			}
			
			var obj={
					    "orderName":"pc:@@@YYYYYYYYYY@@@[3G--YYYYYYYYYY--0002--LK]@@@[3G--YYYYYYYYYY--"+str+"--WALKTIME,"+time+"]",
					    "schoolID":schoolid
					};
			console.log(obj);
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
//免打扰命令下发
function disturbSend(time) {
	try {
		if (socket.readyState == 1) {
			var schoolid=window.top.$("#nowSchool").val();
			var len=time.length+12;
			len=len.toString(16).toUpperCase();
			var str;
			if(len.length==1){
				str="000"+len;
			}else if(len.length==2){
				str="00"+len;
			}else if(len.length==3){
				str="0"+len;
			}else if(len.length==4){
				str=len;
			}
			var obj={
					    "orderName":"pc:@@@YYYYYYYYYY@@@[3G--YYYYYYYYYY--0002--LK]@@@[3G--YYYYYYYYYY--"+str+"--SILENCETIME,"+time+"]",
					    "schoolID":schoolid
					};
			console.log(obj);
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
//体温间隔开关命令下发
function temperatureSwitchSend(status,time) {
	try {
		if (socket.readyState == 1) {
			var schoolid=window.top.$("#nowSchool").val();
			var len=11+time.length;
			len=len.toString(16).toUpperCase();
			var str;
			if(len.length==1){
				str="000"+len;
			}else if(len.length==2){
				str="00"+len;
			}else if(len.length==3){
				str="0"+len;
			}else if(len.length==4){
				str=len;
			}
			var obj={
					    "orderName":"pc:@@@YYYYYYYYYY@@@[3G--YYYYYYYYYY--0002--LK]@@@[3G--YYYYYYYYYY--"+str+"--bodytemp,"+status+","+time+"]",
					    "schoolID":schoolid
					};
			console.log(obj);
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

//心率命令下发
function heartSend(time) {
	try {
		if (socket.readyState == 1) {
			var schoolid=window.top.$("#nowSchool").val();
			var len=time.length+9;
			len=len.toString(16).toUpperCase();
			var str;
			if(len.length==1){
				str="000"+len;
			}else if(len.length==2){
				str="00"+len;
			}else if(len.length==3){
				str="0"+len;
			}else if(len.length==4){
				str=len;
			}
			var obj={
					    "orderName":"pc:@@@YYYYYYYYYY@@@[3G--YYYYYYYYYY--0002--LK]@@@[3G--YYYYYYYYYY--"+str+"--hrtstart,"+time+"]",
					    "schoolID":schoolid
					};
			console.log(obj);
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

