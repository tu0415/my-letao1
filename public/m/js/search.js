// 后面也要用到letao对象的,所以全局声明 
var letao;
$(function () {
     letao = new Letao();
    // 调用历史记录函数
    letao.addHistory();
    // 掉用查询历史记录,并渲染页面
    letao.queryHistory();
    // 调用搜索记录上的删除
    letao.deleteHistory();
    // 调用清单空记录函数
    letao.clearHistory();

});

var Letao = function () {};

Letao.prototype = {
    // 添加历史记录
   addHistory:function () {
        // 1. 获取搜索按钮点击添加事件
        $(".btn-search").on("click",function (){
            // 2. 获取搜索框输入的值(必须要在点击后才能获取,不然是空值)
            var search = $(".search-input").val();
            // 判断当前输入的值是否为空
            if (!search.trim()) {
                alert("请输入要搜索的商品")
                return;
            }
            // console.log(search);
            // 3. 获取本地存储已经存储的值
            var arr = window.localStorage.getItem("searchData");
            // console.log(arr);
            // 如果数组为空 id = 0;
            var id = 0;
            // 判断当前arr是否有值
            if (arr && JSON.parse(arr).length > 0) {
                // 如果有值, 转成数组
                arr = JSON.parse(arr);
                // id 为arr数组中的最后一个值(arr[arr.length-1])的id+1;     
                id = arr[arr.length-1].id+1;
            }else {
                // 没有值,就等于空数组
                arr = [];
                // 如果数组为空 id = 0; 
                id = 0;
            }
            //6. 定义一个搜素内容是否在存储中存在 
            var flag = false;
            for (var i = 0 ; i < arr.length ; i++) {
                // 如果存在吧flag = true
                if (arr[i].search == search) {
                    flag = true;
                }
            }
            //7. 判断flag如果还是==false表示表示当前输入的值不存在
            if (flag == false) {
                // 8. 如果当前文本框输入框的值 不在arr中 就添加arr数组里面
				arr.push({
					'search':search,
					'id':id
				});
            }
            // console.log(arr);
            // 9. 把arr转成字符串存储到本地存储中
            window.localStorage.setItem("searchData",JSON.stringify(arr));
            	// 10. 添加完成后调用查询方法刷新页面
			letao.queryHistory();
			// 11. 点击了搜索按钮跳转到商品列表页面
			window.location.href = 'productlist.html';
        })
   },

   //  查询历史记录,并渲染页面
   queryHistory:function () {
       // 1. 获取本地存储已经存储的值
       var arr = window.localStorage.getItem("searchData");
       // console.log(arr);
       // 2. 判断当前arr是否有值
       if (arr && JSON.parse(arr).length > 0) {
           // 如果有值, 转成数组
           arr = JSON.parse(arr);
       } else {
           // 没有值,就等于空数组
           arr = [];
       }
        // 3.如果需要最后搜素的内容展示在最前面 进行数组反转 再去渲染 
        arr = arr.reverse();
        //4. 调用模板
        var html = template("searchListTmp",{'rows':arr});
        // console.log(html);
        $('.content').html(html);
        
   },

   // 搜索记录的删除
   deleteHistory:function () {
    // 1. 给所有删除按钮添加点击事件
        var that = this;
        $(".content").on('click', '.fa-times', function () {
            // alert("12");
            // 2. 获取当前点击的删除按钮身上的data-id属性的值
            var id = $(this).data('id');
            // console.log(id);
            //    // 1. 获取本地存储已经存储的值
            var arr = window.localStorage.getItem("searchData");
            // console.log(arr);
            // 2. 判断当前arr是否有值
            if (arr && JSON.parse(arr).length > 0) {
                // 如果有值, 转成数组
                arr = JSON.parse(arr);
            } else {
                // 没有值,就等于空数组
                arr = [];
            }
            // 3. 遍历存储数组
            for (var i = 0 ;i < arr.length ; i ++) {
                // 判断数组中id和当前点击删除
                if(arr[i].id == id) {
                    // 第一个参数代表要删除的数据的下标,1表示删除几个
                    arr.splice(i,1);
                }
            }
            //  把删除的数组重新存储到本地存储
            window.localStorage.setItem('searchData',JSON.stringify(arr));
            // 调用查询方法重新查询当前数据和渲染列表
            letao.queryHistory();
        })
    },
    // 清空搜索记录
    clearHistory:function () {
        // 获取清空按钮添加事件
        $(".fa-trash").on('click',function () {
            // alert("134");
            // 把本地存储的值设置为空字符串
            window.localStorage.setItem('searchData','');
            // 清空完毕重新渲染
            letao.queryHistory();
        })
    }
}




