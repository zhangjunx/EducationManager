//初始化年级下拉框
getGradeList();
//初始化班级下拉框
getClassList();
//初始化学年下拉框
getYearList();
if(getUrlParam("fid")!=undefined&&getUrlParam("fid")!=null&&getUrlParam("fid")!=""){//编辑
	getOneInfo();
}else{//新增
	$("#fid").val("");
}
var map = new AMap.Map("allmap", {
    resizeEnable: true
});

var geocoder = new AMap.Geocoder({
    city: "全国", //城市设为北京，默认：“全国”
});

var marker = new AMap.Marker();

function geoCode() {
    var address  = document.getElementById('cityName').value;
    geocoder.getLocation(address, function(status, result) {
        if (status === 'complete'&&result.geocodes.length) {
            var lnglat = result.geocodes[0].location
            document.getElementById('homePoint').value = lnglat;
            marker.setPosition(lnglat);
            map.add(marker);
            map.setFitView(marker);
        }else{
            console.error('根据地址查询位置失败');
        }
    });
}
document.getElementById('cityName').onkeydown = function(e) {
    if (e.keyCode === 13) {
        geoCode();
        return false;
    }
    return true;
};
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
	//监听搜索
	  form.on('submit(LAY-user-front-search)', function(data){
		  geoCode();
	  });
	//监听提交按钮    
	 form.on('submit(component-form-demo1)', function(data){
		 var fid=$("#fid").val();
	     var obj=data.field;
	     obj.fid=fid;
	     console.log(obj);
	     var src=$("#img").attr("src");
	     var formdata=new FormData();
	     if(src.indexOf('data:image')>-1){
	    	 // base64 图片操作
	    	 var file=dataUrlToFile(src,"icon.png");
	    	 formdata.append("file", file);	
	     }else if(src!="../image/add_img.png"&&src.indexOf('data:image')==-1){
	    	 formdata.append("file", $("#studentIpt")[0].files[0]);
	     }
	     formdata.append("str",JSON.stringify(obj));
	     $.ajax({
	    	 url:url+'/stu/insertOneStu',
	    	 type:"post",
	    	 data:formdata,
	    	 cache:false,
			 contentType:false,
			 processData:false,
	    	 success:function(res){
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
		 var $file =$("#studentIpt");
     	 $file.remove();
     	 $('#headImg').append("<input type='file' class='studentImg' id='studentIpt' title='点击更换图片' accept='.jpg,.png,.gif'>");
		 $("#img").attr("src","../image/add_img.png");
		 $("#studentNo").val("");
		 $("#studentName").val("");
		 $("#IDCode").val("");
		 $("#age").val("");
		 $("#nationality").val("");
		 $("#nation").val("");
		 $("#birthDay").val("");
		 $("#homePlace").val("");
		 $("#cardNo").val("");
		 $("#SMCode").val("");
		 $("#homePoint").val("");
		 $("#gradeID").val("");
		 $("#classID").val("");
		 $("#term").val("");
		 $("#firstParent").val("");
		 $("#phone1").val("");
		 $("#secondParent").val("");
		 $("#phone2").val("");
		 $("#remark").val("");
		 form.render();
	 }),
	 /* 自定义验证规则 */
    form.verify({
      phone: function(value){
	    var reg=/^1[3456789]\d{9}$/;
        if(!reg.test(value)){
          return '请正确输入手机号!';
        }
      },
      idcode: function(value){
    	  var vcity = {
    	            11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
    	            21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
    	            33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
    	            42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
    	            51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
    	            63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
    	        };
    	        IdentityCodeValid = function (obj) {
    	            //是否为空
    	            if (obj === '') {
    	                return false;
    	            }
    	            //校验长度，类型
    	            if (isCardNo(obj) === false) {
    	                return false;
    	            }
    	            //检查省份
    	            if (checkProvince(obj) === false) {
    	                return false;
    	            }
    	            //校验生日
    	            if (checkBirthday(obj) === false) {
    	                return false;
    	            }
    	            //检验位的检测
    	            if (checkParity(obj) === false) {
    	                return false;
    	            }
    	            return true;
    	        };
    	        //检查号码是否符合规范，包括长度，类型
    	        isCardNo = function (obj) {
    	            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    	            var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    	            if (reg.test(obj) === false) {
    	                return false;
    	            }
    	            return true;
    	        };
    	        //取身份证前两位,校验省份
    	        checkProvince = function (obj) {
    	            var province = obj.substr(0, 2);
    	            if (vcity[province] == undefined) {
    	                return false;
    	            }
    	            return true;
    	        };
    	        //检查生日是否正确
    	        checkBirthday = function (obj) {
    	            var len = obj.length;
    	            //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    	            if (len == '15') {
    	                var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
    	                var arr_data = obj.match(re_fifteen);
    	                var year = arr_data[2];
    	                var month = arr_data[3];
    	                var day = arr_data[4];
    	                var birthday = new Date('19' + year + '/' + month + '/' + day);
    	                return verifyBirthday('19' + year, month, day, birthday);
    	            }
    	            //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    	            if (len == '18') {
    	                var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
    	                var arr_data = obj.match(re_eighteen);
    	                var year = arr_data[2];
    	                var month = arr_data[3];
    	                var day = arr_data[4];
    	                var birthday = new Date(year + '/' + month + '/' + day);
    	                return verifyBirthday(year, month, day, birthday);
    	            }
    	            return false;
    	        };
    	        //校验日期
    	        verifyBirthday = function (year, month, day, birthday) {
    	            var now = new Date();
    	            var now_year = now.getFullYear();
    	            //年月日是否合理
    	            if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
    	                //判断年份的范围（3岁到100岁之间)
    	                var time = now_year - year;
    	                if (time >= 0 && time <= 130) {
    	                    return true;
    	                }
    	                return false;
    	            }
    	            return false;
    	        };
    	        //校验位的检测
    	        checkParity = function (obj) {
    	            //15位转18位
    	            obj = changeFivteenToEighteen(obj);
    	            var len = obj.length;
    	            if (len == '18') {
    	                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    	                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    	                var cardTemp = 0, i, valnum;
    	                for (i = 0; i < 17; i++) {
    	                    cardTemp += obj.substr(i, 1) * arrInt[i];
    	                }
    	                valnum = arrCh[cardTemp % 11];
    	                if (valnum == obj.substr(17, 1)) {
    	                    return true;
    	                }
    	                return false;
    	            }
    	            return false;
    	        };
    	        //15位转18位身份证号
    	        changeFivteenToEighteen = function (obj) {
    	            if (obj.length == '15') {
    	                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    	                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    	                var cardTemp = 0, i;
    	                obj = obj.substr(0, 6) + '19' + obj.substr(6, obj.length - 6);
    	                for (i = 0; i < 17; i++) {
    	                    cardTemp += obj.substr(i, 1) * arrInt[i];
    	                }
    	                obj += arrCh[cardTemp % 11];
    	                return obj;
    	            }
    	            return obj;
    	        };
    	     if(!IdentityCodeValid(value)){
    	    	 return "请正确输入身份证号!";
    	     }
        }
    });
})
//编辑时获取一条信息
function getOneInfo(){
	$.ajax({
		url:url+"/stu/getOneInfo",
		type:"post",
		async:false,
		data:{"fid":getUrlParam("fid")},
		success:function(data){
			console.log(data);
			if(data.result){
				 $("#fid").val(data.data.FID);
				 if(data.data.IMAGE!=undefined&&data.data.IMAGE!=null&&data.data.IMAGE!=""){
						$("#img").attr("src","data:image/png;base64,"+data.data.IMAGE);
				}
				 $("#studentNo").val(data.data.STUDENTNO);
				 $("#studentName").val(data.data.STUDENTNAME);
				 $("#IDCard").val(data.data.IDCARD);
				 $("#age").val(data.data.AGE);
				 $("#nationality").val(data.data.NATIONALITY);
				 $("#nation").val(data.data.NATION);
				 $("#birthDay").val(data.data.BIRTHDAY);
				 $("#homePlace").val(data.data.HOMEPLACE);
				 $("#cardNo").val(data.data.CARDNO);
				 $("#SMCode").val(data.data.SMCODE);
				 $("#homePoint").val(data.data.HOMEPOINT);
				 $("#gradeID").val(data.data.GRADEID);
				 $("#classID").val(data.data.CLASSID);
				 $("#term").val(data.data.TERM);
				 $("#yearID").val(data.data.YEARID);
				 $("#firstParent").val(data.data.FIRSTPARENT);
				 $("#phone1").val(data.data.PHONE1);
				 $("#secondParent").val(data.data.SECONDPARENT);
				 $("#phone2").val(data.data.PHONE2);
				 $("#remark").val(data.data.REMARK);
				 $("input[value="+data.data.SEX+"]").attr("checked",true);
				layui.use("form",function(){
						var form=layui.form;
						form.render();
				})
			}
		}
	})
}


//获取年级数据
function getGradeList(){
	$.ajax({
		url:url+"/public/getGradeList",
		type:"post",
		async:false,
		success:function(res){
			$("#gradeID").find("not:first").remove();
			if(res.result){
				for(var item of res.data){
					var $opt=$("<option value="+item.FID+">"+item.GRADENAME+"</option>");
					$("#gradeID").append($opt);
				}
			}
			layui.use("form",function(){
				var form=layui.form;
				form.render("select");
			})
		}
	})
}
//获取班级数据
function getClassList(){
	$.ajax({
		url:url+"/public/getClassList",
		type:"post",
		async:false,
		success:function(res){
			$("#classID").find("not:first").remove();
			if(res.result){
				for(var item of res.data){
					var $opt=$("<option value="+item.FID+">"+item.CLASSNAME+"</option>");
					$("#classID").append($opt);
				}
			}
			layui.use("form",function(){
				var form=layui.form;
				form.render("select");
			})
		}
	})
}
//获取学年数据
function getYearList(){
	$.ajax({
		url:url+"/public/getYearList",
		type:"post",
		async:false,
		success:function(res){
			$("#yearID").find("not:first").remove();
			if(res.result){
				for(var item of res.data){
					var $opt=$("<option value="+item.FID+">"+item.YEARNAME+"</option>");
					$("#yearID").append($opt);
				}
			}
			layui.use("form",function(){
				var form=layui.form;
				form.render("select");
			})
		}
	})
}
//选择照片
$(document).on("change","#studentIpt",function(){
	var imgUrl = getObjectURL(this.files[0]);
	$("#img").attr("src", imgUrl);
})

function getObjectURL(file) {
	var url = null;
	if (window.createObjectURL != undefined) {
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) {
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) {
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}//end

//url地址中解析参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}
//将base64转file文件
function dataUrlToFile(dataurl,filename){
	/*dataUrlToFile(dataurl,filename)*/
		var arr=dataurl.split(',');
		var mime=arr[0].match(/:(.*?);/)[1];
		var bstr=atob(arr[1]);
		//var bstr=window.atob(arr[1]);
		var n=bstr.length;
		var u8arr=new Uint8Array(n);
		while(n--){
			u8arr[n]=bstr.charCodeAt(n);
		}
		//转换成file对象
		var obj= new File([u8arr],filename,{type:mime});
		//转换成blob对象
		//var obj=new Blob([u8arr],{type:mime});
		return obj;
}//end