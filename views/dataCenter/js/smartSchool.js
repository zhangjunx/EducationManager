$(function(){
	//获取当前时间
	getTime();
	//学生在校人数
	initPeopleSchool();
	//学校概况
	getStuWithGrade();
	//学生体温统计
	getTempWithSchool();
	//实时动态
	getTempTimely();
	setInterval(function(){
		//学生在校人数
		initPeopleSchool();
		//学校概况
		getStuWithGrade();
		//学生体温统计
		getTempWithSchool();
		//实时动态
		getTempTimely();
	},1000*300)
})
$(document).mousemove(function(event){
	var x=event.clientX; 
	var y=event.clientY;//监听鼠标位置;
	var width=document.body.clientWidth;
	var wx=width-x;
	if(wx<300&&y<85){
		//弹出关闭按钮
		$(".closeYeMian").css({
			"top":"12px",
			"transition":"all 0.5s ease"
		})
	}else{
		$(".closeYeMian").css({
			"top":"-100px",
			"transition":"all 0.5s ease"
			})
		}
})
$(".closeYeMian").click(function(){
	parent.layer.closeAll();
})

var myChart5 = echarts.init(document.getElementById('sportsStudents'));
var myChart6 = echarts.init(document.getElementById('studentSpread'));


var option5 = {
		grid:{
			x:40,
			y:20,
			x2:20,
			y2:20,
		},
	    xAxis: {
	        type: 'category',
	        axisLine: {
                lineStyle: {
                    color: '#00A0E9'
                }
            },
	        boundaryGap: false,
	        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
	    },
	    yAxis: {
	        type: 'value',
	        axisLine: {
                lineStyle: {
                    color: '#00A0E9'
                }
            },
            //坐标轴内线的样式
            splitLine: {
            	show:false,
                lineStyle: {
                    color: '#00A0E9',
                    //type:'dashed'虚线
                }
            }
	    },
	    tooltip:{
	    	trigger:'item'
	    },
	    series: [{
	        data: [820, 932, 901, 934, 1290, 1330, 1320],
	        type: 'line',
	        symbolSize: 15,//折线点的大小
	        areaStyle: {
	        	normal:{
	        		color:"#00A0E9"//改变区域颜色
	        	}
	        },
	        itemStyle:{
	        	normal:{
	        		color:"#00A0E9",
	        		lineStyle:{
	        			color:"#00A0E9"//改变折线颜色
	        		}
	        	}
	        }
	    }]
};
var option6 = {
	    tooltip: {
	        trigger: 'item',
	        formatter: '{a} <br/>{b}: {c} ({d}%)'
	    },
	    legend: {
	        orient: 'vertical',
	        left: '350',
	        bottom:'40',
	        textStyle: { //图例文字的样式
                color: '#fff',
                fontSize: 16
            },
	        data: ['餐厅', '教学楼', '宿舍楼', '操场', '图书馆']
	    },
	    color : [ '#1FB5FC', '#236BD7', '#FD895B', '#FC5659' ,'#9456FB'],
	    series: [
	        {
	            name: '访问来源',
	            type: 'pie',
	            radius: ['70%', '90%'],
	            center: ['30%', '50%'],//饼图的位置
	            avoidLabelOverlap: false,
	            label: {
	                show: false,
	                position: 'center'
	            },
	            emphasis: {
	                label: {
	                    show: true,
	                    fontSize: '30',
	                    fontWeight: 'bold'
	                }
	            },
	            labelLine: {
	                show: false
	            },
	            data: [
	                {value: 516, name: '餐厅'},
	                {value: 392, name: '教学楼'},
	                {value: 105, name: '宿舍楼'},
	                {value: 92, name: '操场'},
	                {value: 15, name: '图书馆'}
	            ]
	        }
	    ]
	};

myChart5.setOption(option5);
myChart6.setOption(option6);

//本周年级到客率
var colors = [
	['#013367', '#1CDEF9'], ['#013367', '#833BBB'], ['#013367', '#3368F2'], 
], circles = [];
for (var i = 1; i <= 3; i++) {
	var child = document.getElementById('circles-' + i),
		percentage=99;
	circles.push(Circles.create({
		id:         child.id,
		value:		percentage,
		radius:     60,
		width:      10,
		colors:     colors[i - 1]
	}));
}

//学生是否在校人数
function initPeopleSchool(){
	$.ajax({
		url:url+"/gatherSchool/getInSchoolStu",
		type:"post",
		success:function(res){
			if(res.result){
				var data=res.data;
				var allPeople=data.allStuNum;
				var inSchool=data.inSchool;
				var notInSchool=data.notInSchool;
				$("#inSchool").html(inSchool);
				$("#outSchool").html(notInSchool);
				var notUpload=allPeople-inSchool-notInSchool;//未上传记录的人数	
				var inSchoolPercent=percentPeople(inSchool,allPeople);//学生在校占比
				var outSchoolPercent=percentPeople(notInSchool,allPeople);//学生不在校占比
				$("#inSchoolPercent").html(inSchoolPercent);
				$("#inProgress").css("width",inSchoolPercent);
				$("#outSchoolPercent").html(outSchoolPercent);
				$("#outProgress").css("width",outSchoolPercent);
				$(".realPeopleNum").html(allPeople);
				$(".atSchoolPeople").html(inSchool);
			}
		}
	})
}

//计算百分比
function percentPeople(number1,number2){
	return (Math.round(number1 / number2 * 10000) / 100.00 + "%");//小数点后两位百分比
}


//学校概况
function getStuWithGrade(){
	$.ajax({
		url:url+"/gatherSchool/getStuWithGrade",
		type:"post",
		success:function(res){
			var data=res.data;
			$(".stuWithGrade").empty();
			if(res.result){
				for(var item of data){
					var $div=$("<div class='schoolGrade'><h3>"+item.GRADENAME+"人数</h3><p class='gradeNum'>"+item.STUNUM+"</p></div>");
					$(".stuWithGrade").append($div);
				}
			}
		}
	})
}
//学生体温统计
function getTempWithSchool(){
	$.ajax({
		url:url+"/gatherSchool/getTempWithSchool",
		type:"post",
		success:function(res){
			var data=res.data;
			if(res.result){
				var arr=[
					{value: 0, name: '35℃-37℃'},
	                {value: 0, name: '37℃-37.2℃'},
	                {value: 0, name: '37.2℃-38℃'},
	                {value: 0, name: '38℃以上'},
				];
				var list=[];
				for(var item of data){
					for(var current of arr){
						switch(item.TEMP1){
						    case "temp1":
						    	if(current.name=="35℃-37℃"){
						    		current.value=item.TEMPSUM;
						    	}
						    	break;
						    case "temp2":
						    	if(current.name=="37℃-37.2℃"){
						    		current.value=item.TEMPSUM;
						    	}
						    	break;
						    case "temp3":
						    	if(current.name=="37.2℃-38℃"){
						    		current.value=item.TEMPSUM;
						    	}
						    	break;
						    case "temp4":
						    	if(current.name=="38℃以上"){
						    		current.value=item.TEMPSUM;
						    	}
						}
						
					}
				}
				initChartsTem(arr);
			}
		}
	})
}
//学生体温统计饼状图
function initChartsTem(arr){
	var myChart1 = echarts.init(document.getElementById('studentTemperature'));
	var option1 = {
		    tooltip: {
		        trigger: 'item',
		        formatter: '{a} <br/>{b} : {c} ({d}%)'
		    },
		    legend: {
		        orient: 'vertical',
		        left: '350',
		        bottom:'40',
		        textStyle: { //图例文字的样式
	                color: '#fff',
	                fontSize: 16
	            },
		        data: ['35℃-37℃', '37℃-37.2℃', '37.2℃-38℃', '38℃以上']
		    },
		    color : [ '#38DC98', '#3F95F6', '#40BAD0', '#B95FF9' ],
		    series: [
		        {
		            name: '访问来源',
		            type: 'pie',
		            radius: '70%',//饼图的半径大小
		            center: ['40%', '55%'],//饼图的位置
		            label:{//饼图图形上的文本标签
		            	normal:{
		            		show:true,
		            		//position:'inner',//标签的位置
		            		textStyle:{
		            			fontWeight:300,
		            			fontSize:16//文字的字体大小
		            		},
		            	}
		            },
		            data:arr,
//		            [
//		                {value: 335, name: '36℃-37℃'},
//		                {value: 310, name: '37℃-37.2℃'},
//		                {value: 234, name: '37.2℃-38℃'},
//		                {value: 135, name: '38℃以上'},
//		            ],
		            emphasis: {
		                itemStyle: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            },
		            
		        }
		    ]
	};
	myChart1.setOption(option1);
}
//实时动态
var time="";
function getTempTimely(){
	$.ajax({
		url:url+"/gatherSchool/getTempTimely",
		type:"post",
		data:{"thisTime":time},
		success:function(res){
			getTime();
			$(".studentTable tbody tr").eq(0).nextAll().remove();
			var data=res.data;
			if(res.result){
				for(var item of data){
					var text="正常";
					var classname="";
					var temp=parseFloat(item.TEMP);
					if(temp>=37.2 || temp<36){
						text="异常";
						classname="noNormal";
					}
					var $tr=$("<tr class="+classname+"><td>"+item.STUDENTNAME+"</td><td>"+item.CLASSNAME+"</td><td>"+text+"</td><td>"+item.UPLOADDATE+"</td></tr>");
					$(".studentTable").append($tr);
				}
			}
		}
	})
}
//获取当前时间
function getTime() {
	   var date = new Date();
	   var seperator1 = "-";
	   var year = date.getFullYear();
	   var month = date.getMonth() + 1;
	   var strDate = date.getDate();
	   var hour = date.getHours(); //得到小时
	   var minu = date.getMinutes(); //得到分钟
	   var sec = date.getSeconds(); //得到秒
	   if (hour < 10) hour = "0" + hour;
	   if (minu < 10) minu = "0" + minu;
	   if (sec < 10) sec = "0" + sec;
	   if (month >= 1 && month <= 9) {
	       month = "0" + month;
	   }
	   if (strDate >= 0 && strDate <= 9) {
	       strDate = "0" + strDate;
	   }
	   var currentdate = year + seperator1 + month + seperator1 + strDate+" "+hour + ":" + minu + ":" + sec;
	   time=currentdate;
}
