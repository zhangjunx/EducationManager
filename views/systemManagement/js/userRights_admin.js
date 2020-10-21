var list = [];
var i=0;
var parentName="";
$(function(){
	//获取权限列表
	getList();
	//获取用户列表
	getUserList();
})
layui.config({
    base: '../'
}).extend({
    treeTable: 'treeTable/treeTable'
}).use(['treeTable'], function () {
    var treeTable = layui.treeTable;
});
//点击角色添加
$("#addRole").click(function(){
	$("#roleName").val("").attr("data-fid","");
	$("#roleName").show();
})
//角色输入框的回车事件
$("#roleName").keydown(function(e){
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    var roleName=$(this).val();
    var fid=$(this).attr("data-fid");
    if(fid==undefined){
    	fid="";
    }
    if (code == 13) {
    	addRole(fid,roleName);
    }
})

//点击修改
$("#updateRole").click(function(){
	if($(".userBox li.current").length==0){
		layer.msg("请选择角色!",{time:2000});
		return;
	}
	var roleName=$(".userBox li.current").html();
	var fid=$(".userBox li.current").attr("data-fid");
	$("#roleName").val(roleName).attr("data-fid",fid);
	$("#roleName").show();
})
//点击删除
$("#delRole").click(function(){
	if($(".userBox li.current").length==0){
		layer.msg("请选择角色!",{time:2000});
		return;
	}
	var fid=$(".userBox li.current").attr("data-fid");
	delRole(fid);
})
//删除角色
function delRole(fid){
	$.ajax({
		url:url+"/role/delInfo",
		type:"post",
		data:{"fid":fid},
		success:function(res){
			if(res.result){
				layer.msg(res.msg,{time:1000},function(){
					getUserList();
				})
			}else{
				layer.msg(res.msg,{time:2000});
			}
		}
	})
}
//新增修改角色方法
function addRole(fid,roleName){
	$.ajax({
		url:url+"/role/addInfo",
		type:"post",
		data:{"fid":fid,"roleName":roleName,"findex":1,"remark":""},
		success:function(res){
			if(res.result){
				layer.msg(res.msg,{time:1000},function(){
					$("#roleName").hide();
					getUserList();
				})
			}else{
				layer.msg(res.msg,{time:2000});
			}
		}
	})
}
//点击左侧角色
$(document).on("click",".userBox li",function(){
	$(this).addClass("current").siblings().removeClass("current");
	var roleid=$(this).attr("data-fid");
	for(var i=0;i<$(".ew-tree-icon-file").length;i++){
		if($("tr td .layui-form-checkbox").eq(i).hasClass("layui-form-checked")==true){
			$("tr td .layui-form-checkbox").eq(i).removeClass("layui-form-checked");
		}
	}
	queryPermTreeListByRoleId(roleid)
})
function queryPermTreeListByRoleId(roleid){
	var loadIndex = layer.load(1,{
		shade:[0.1,"#fff"]
	});
	var obj={"fid":roleid};
	$.ajax({
		url:url+"/role/getLimit",
		type:"POST",
		data:obj,
		dataType:"json",
		success:function(val){
			console.log(val);
			if(!val.result){
				layer.close(loadIndex);
				layer.msg(val.msg,{time:2000});
				return;
			}
			var res=val.data;
			//根据后台数据渲染表格
			for(var item of res){
				$("tr[data-id="+item.id+"] td .layui-form-checkbox").addClass("layui-form-checked");
			}
			layer.close(loadIndex);
		}
	})
}//end

//获取角色列表
function getUserList(){
	$.ajax({
		url:url+"/role/getList",
		type:"post",
		success:function(res){
			console.log(res);
			$(".userBox").empty();
			if(res.result){
				var data=res.data;
				for(var item of data){
					var $li=$("<li data-fid="+item.FID+">"+item.ROLENAME+"</li>");
					$(".userBox").append($li);
				}
			}
		}
	})
}


//初始化权限列表
function initTreeTable(res){
	layui.use(['layer','util','treeTable'], function () {
		var $=layui.jquery;
		var util=layui.util;
	    var treeTable = layui.treeTable;
	    var form=layui.form;
	    // 渲染表格
        var insTb = treeTable.render({
            elem: '#LAY-user-manage',
            data: res,  // 数据
            tree: {
                iconIndex: 1,  // 折叠图标显示在第几列
                arrowType: 'arrow2', 
                idName: 'id',
                pidName: 'pId',
                isPidData: true,
               //openName: 'open',
                treeLinkage: false,
                getIcon: function(d) {  // 自定义图标
                    // d是当前行的数据
                   if (d.children) {  // 判断是否有子集
                	   return '<i class="ew-tree-icon ew-tree-icon-folder"></i>';
                    } else {
                    	 return '<i class="ew-tree-icon ew-tree-icon-file"></i>';
                    }
                }
            },
            cols: [
            	{type:"checkbox",width:"50"},
                {field: 'title', title: '名称',width:"250"},
                {field: 'FINDEX', title: '序号',width:"60"},
                {field: 'UUID', title: 'uid',width:"150"},
                {field: 'ICON', title: '字体图标',width:"100"},
                {field: 'PAGEPATH', title: '路径',width:"250"},
                {field: 'type', title: '类型',width:"80",templet:function(d){
                	if(d.IFPAGE==0){
                		return "菜单";
                	}else if(d.IFPAGE==1){
                		return "页面";
                	}else if(d.IFPAGE==2){
                		return "按钮";
                	}
                }},
                {field: 'REMARK', title: '备注',},
                {align:"center",title:"操作",width:"210",templet:function(d){
                		if(d.id==0){
                			 return '<a href="javascript:;" class="layui-btn layui-btn-xs" lay-event="add"><i class="layui-icon layui-icon-add-circle"></i>新增</a>'+
		             		        '<a href="javascript:;" class="layui-bg-gray layui-btn layui-btn-xs"><i class="layui-icon layui-icon-edit"></i>修改</a>'+
		             		        '<a href="javascript:;" class="layui-bg-gray layui-btn layui-btn-xs layui-btn-danger"><i class="layui-icon layui-icon-delete"></i>删除</a>';
                		}else if(d.IFPAGE==2){
                			return '<a href="javascript:;" class="layui-btn layui-btn-xs layui-bg-gray"><i class="layui-icon layui-icon-add-circle"></i>新增</a>'+
		             		       '<a href="javascript:;" class="layui-btn layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>修改</a>'+
		             		       '<a href="javascript:;" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</a>';
                		}else{
                			return '<a href="javascript:;" class="layui-btn layui-btn-xs" lay-event="add"><i class="layui-icon layui-icon-add-circle"></i>新增</a>'+
		             		   '<a href="javascript:;" class="layui-btn layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>修改</a>'+
		             		   '<a href="javascript:;" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</a>';
                		}
	                    
                }}
            ],
            
        });
       /* insTb.done=function(){
        	console.log("run");
        	$("th[data-field="+0+"] input[type='checkbox']").prop("disabled",true);
        	insTb.render();
        }*/
        treeTable.on('tool(LAY-user-manage)', function(obj){
            var event=obj.event;
            var data=obj.data;
            if(event=="del"){
        		var optType="";
            	if(data.IFPAGE==0||data.IFPAGE==1){ //删除菜单或者页面
            		optType=1;
    			}else if(data.IFPAGE==2){//删除按钮
            		optType=2;
    			}
            	var fid=data.id;
            	var obj3={"optType":optType,"fid":fid};
            	console.log(obj3);
            	layer.confirm("确定删除?",{title:'提示'},function(index){
            		layer.close(index);
            		$.ajax({
            			url:url+"/menu/delMenuInfo",
            			type:"POST",
            			data:obj3,
            			success:function(data){
            				console.log(data);
            				if(data.result){
            					layer.msg(data.msg,{time:1000},function(){
            						obj.del();
            					})
            				}else{
            					layer.msg(data.msg,{time:2000});
            				}
            			}
            		})
            	})
            }else if(event=="edit"){
            	//清空弹出层表单
	           	 $("#title1").val("");
	           	 $(".ifPage").val(0);
	           	 $(".ifScreenFull").val(0);
	           	 $("#parentName1").val("");
	           	 $("#orderId1").val("");
	           	 $("#icon").val("");
	           	 $("#modelPath").val("");
	           	 $("#remark1").val("");
	           	 $("#fid").val("");
	           	 $("#title3").val("");
				$("#code3").val("");
				$("#orderId3").val("");
				$("#remark3").val("");
				if(data.IFPAGE==0||data.IFPAGE==1){//编辑页面或者菜单
            		$("#add_button").hide();
            		$("#add_menu").show();
            		var parentname=$(".layui-table tr[data-id="+data.pId+"] .ew-tree-pack span").html();
            		$("#parentName1").val(parentname);
            		$("#title1").val(data.title);
            		$(".ifPage").val(data.IFPAGE);
            		$(".ifScreenFull").val(data.IFSCREEN);
            		$("#orderId1").val(data.FINDEX);
            		$("#icon").val(data.ICON);
            		$("#modelPath").val(data.PAGEPATH);
            		$("#remark1").val(data.REMARK);
            		$("#fid").val(data.id);
            	}else if(data.IFPAGE==2){//编辑按钮
            		$("#add_button").show();
            		$("#add_menu").hide();
            		var parentname=$(".layui-table tr[data-id="+data.pId+"] .ew-tree-pack span").html();
            		$("#parentName3").val(parentname);
            		$("#title3").val(data.title);
            		$("#code3").val(data.OPERATENAME);
            		$("#orderId3").val(data.FINDEX);
            		$("#remark3").val(data.REMARK);
            		$("#fid").val(data.id);
            	}
				form.render();
            	layer.open({
            		type:1,
            		title:"修改",
            		content:$("#menu_add_update"),
            		area:["90%","91%"],
            		btn:["确定","取消"],
            		btnAlign: 'c',
            		yes:function(index){
            			var fid=$("#fid").val();
            			if(data.IFPAGE==0||data.IFPAGE==1){//编辑菜单
            				var menuName=$("#title1").val();
            				var ifPage=$(".ifPage").val();
            				var ifScreen=$(".ifScreenFull").val();
            				var parentID=data.id;
                			var findex=$("#orderId1").val();
                			var pagePath=$("#modelPath").val();
                			var remark=$("#remark1").val();
                			var icon=$("#icon").val();
                			var obj={"optType":"1","fid":fid,"icon":icon,"ifScreen":ifScreen,"ifPage":ifPage,"pagePath":pagePath,"menuName":menuName,"parentID":parentID,"findex":findex,"remark":remark};
            			}else if(data.IFPAGE==2){//编辑按钮
            				var operateName=$("#title3").val();
            				var operateCode=$("#code3").val();
            				var findex=$("#orderId3").val();
            				var menuID=data.id;
            				var remark=$("#remark3").val();
            				var obj={"optType":"2","fid":fid,"operateName":operateName,"operateCode":operateCode,"findex":findex,"menuID":menuID,"remark":remark};
            			}
            			console.log(obj);
            			$.ajax({
            				url:url+"/menu/addMenuInfo",
            				type:"post",
            				data:obj,
            				success:function(data){
            					if(data.result){
            						layer.msg(data.msg,{time:1000},function(){
            							layer.close(index);
            							getList();
            						});
            					}else{
            						layer.msg(data.msg,{time:2000});
            					}
            				}
            			})
            		}
            	})
            }else if(event=="add"){
            	//清空弹出层表单
            	 $("#title1").val("");
            	 $(".ifPage").val(0);
            	 $(".ifScreenFull").val(0);
            	 $("#parentName1").val("");
            	 $("#orderId1").val("");
            	 $("#icon").val("");
            	 $("#modelPath").val("");
            	 $("#remark1").val("");
            	 $("#fid").val("");
            	 $("#title3").val("");
 				$("#code3").val("");
 				$("#orderId3").val("");
 				$("#remark3").val("");
 				form.render();
            	if(obj.data.IFPAGE==0){//新增页面或者菜单
            		$("#add_button").hide();
            		$("#add_menu").show();
            		parentName=obj.data.title;
            		$("#parentName1").val(obj.data.title);
            	}else if(obj.data.IFPAGE==1){//新增按钮
            		$("#add_button").show();
            		$("#add_menu").hide();
            		parentName=obj.data.title;
            		$("#parentName3").val(obj.data.title);
            	}
            	layer.open({
            		type:1,
            		title:"新增",
            		content:$("#menu_add_update"),
            		area:["90%","91%"],
            		btn:["确定","取消"],
            		btnAlign: 'c',
            		yes:function(index){
            			var fid=$("#fid").val();
            			if(data.IFPAGE==0){//新增菜单
            				var menuName=$("#title1").val();
            				var ifPage=$(".ifPage").val();
            				var ifScreen=$(".ifScreenFull").val();
            				var parentID=data.id;
                			var findex=$("#orderId1").val();
                			var pagePath=$("#modelPath").val();
                			var remark=$("#remark1").val();
                			var icon=$("#icon").val();
                			var obj={"optType":"1","fid":fid,"icon":icon,"ifScreen":ifScreen,"ifPage":ifPage,"pagePath":pagePath,"menuName":menuName,"parentID":parentID,"findex":findex,"remark":remark};
            			}else if(data.IFPAGE==1){//新增按钮
            				var operateName=$("#title3").val();
            				var operateCode=$("#code3").val();
            				var findex=$("#orderId3").val();
            				var menuID=data.id;
            				var remark=$("#remark3").val();
            				var obj={"optType":"2","fid":fid,"operateName":operateName,"operateCode":operateCode,"findex":findex,"menuID":menuID,"remark":remark};
            			}
            			$.ajax({
            				url:url+"/menu/addMenuInfo",
            				type:"post",
            				data:obj,
            				success:function(data){
            					console.log(data);
            					if(data.result){
            						layer.msg(data.msg,{time:1000},function(){
            							layer.close(index);
            							getList();
            						});
            					}else{
            						layer.msg(data.msg,{time:2000});
            					}
            				}
            			})
            		},
            	})
            }
        });
        //监听复选框
        treeTable.on('checkbox(LAY-user-manage)', function(obj){
        	var roleID=$(".userBox li.current").attr("data-fid");
        	if(roleID==undefined){
        		layer.msg("请先选择角色！",{time:2000})
       		    return;
        	}
        	var index=layer.load(2);
        	list = [];
    		var res4 = getList12(obj.data.children,obj.data.id);
    		var optList=[];
    		if(obj.data.IFPAGE==2){
    			optList.push({"operateID":obj.data.id});
    		}
    		for(var item of res4){
    			if(item.IFPAGE==2){
    				optList.push({"operateID":item.id});
    			}
    		}
    		if(optList.length==0){
    			optList.push({"operateID":"-1"});
    		}
    		if(obj.checked==true){//分配权限
    			 var optType=1;
    		}else{//取消权限
    			 var optType=2;
    		}
    		var obj2=JSON.stringify({"optType":optType,"fid":roleID,"optList":optList});
        	$.ajax({
        		url:url+"/role/addLimit",
        		type:"POST",
        		data:obj2,
        		dataType:"json",
        		contentType:"application/json",
        		success:function(data){
        			layer.msg(data.msg,{time:2000});
        			layer.close(index);
        		},
        		error:function(){
        			layer.close(index);
        		}
        	})
        })
	});
}
function getList12(childList,pid){
	if(childList != undefined && childList.length>0){
		for(var i =0;i<childList.length;i++){
			list.push(childList[i]);
			if(childList[i].children == undefined){
				continue;
			}
			var thisPid = childList[i].id;
			var thisChildList = childList[i].children;
			var thisParent = childList[i].parent;
			getList12(thisChildList,thisPid);
		}
	}
	return list;
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
//查询权限列表
function getList(){
	$.ajax({
		url:url+"/menu/getTreeList",
		type:"POST",
		dataType:"json",
		async:false,
		success:function(res){
			console.log(res);
			initTreeTable(res.data);
		}
	})
}//end