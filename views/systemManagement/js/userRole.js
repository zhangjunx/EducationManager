$(function(){
	//获取角色列表
	getRoleList();
	//获取用户列表
	getUserList();
})
layui.use("layer",function(){
	var layer=layui.layer;
	var form=layui.form;
})

//点击用户
$(document).on("click",".backUser li",function(){
	var fid=$(this).attr("data-fid");
	var roleid=$(".userBox li.current").attr("data-fid");
	if($(".userBox li.current").length==0){
		layer.msg("请先选择角色!",{time:2000});
		return;
	}
	if($(this).hasClass("current")){
		$(this).removeClass("current");
		var obj={"optType":2,"roleID":roleid,"fid":fid};
		addRole(obj);
	}else{
		$(this).addClass("current");
		var obj={"optType":1,"roleID":roleid,"fid":fid};
		addRole(obj);
	}
})
//角色绑定用户
function addRole(obj){
	console.log(obj);
	$.ajax({
		url:url+"/user/addRole",
		type:"post",
		data:obj,
		success:function(val){
			layer.msg(val.msg,{time:2000});
		}
	})
}
//点击左侧角色
$(document).on("click",".userBox li",function(){
	$(this).addClass("current").siblings().removeClass("current");
	var roleid=$(this).attr("data-fid");
	queryPermTreeListByRoleId(roleid)
})
//查询与该角色绑定的用户
function queryPermTreeListByRoleId(roleid){
	var obj={"roleID":roleid};
	$.ajax({
		url:url+"/user/getUserRole",
		type:"POST",
		data:obj,
		dataType:"json",
		success:function(val){
			$(".backUser li").removeClass("current");
			if(val.result){
				for(var item of val.data){
					$(".backUser li[data-fid="+item.USERID+"]").addClass("current");
				}
			}else{
				layer.msg(val.msg,{time:2000});
			}
		}
	})
}//end

//获取角色列表
function getRoleList(){
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
//获取用户列表
function getUserList(){
	$.ajax({
		url:url+"/user/getList",
		type:"post",
		success:function(res){
			console.log(res);
			$(".backUser").empty();
			if(res.result){
				var data=res.data;
				for(var item of data){
					var $li=$("<li data-fid="+item.FID+"><div class='personPhoto'><img src='../image/person.png'></div>" +
							"<div class='holderInfo'><p title="+item.USERNAME+">用户名:<span class='holdername layui-elip'>"+item.USERNAME+"</span></p>" +
							"<p title="+item.USERCODE+">用户编码:<span class='holderno layui-elip'>"+item.USERCODE+"</span></p></div></li>");
					$(".backUser").append($li);
				}
			}
		}
	})
}