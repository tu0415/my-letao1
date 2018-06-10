$(function () {
    var letao = new Letao();
    // 通过对象初始化区域滚动
    letao.initScroll();
    // 调用左侧分类的函数
    letao.getCategoryLeft();
    // 调用右侧分类的函数
    letao.getCategoryRight();

})

var Letao = function () {};

Letao.prototype = {
    // 滚动区域
    initScroll:function () {
        options = {
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: false, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        };
        mui('.mui-scroll-wrapper').scroll(options);
    },

    // 获取分类左侧的数据
    getCategoryLeft:function () {
        $.ajax({
            url:"/category/queryTopCategory",
            success:function (data) {
                // console.log(data);
                var html = template("categoryLeftTmp",data);
                // console.log(html);  
                $(".category-left ul").html(html);
                // console.log($("category-left ul").html(html));
            }
        })
    },

    // 获取右边分类的数据
    getCategoryRight:function () {
		getRightData(1)
		// 4. 给左侧分类添加点击事件 点击的时候获取右侧分类的数据渲染右侧品牌
		// 如果添加事件的代码写在别的地方要使用委托方式添加因为页面还没有渲染完毕
		$('.category-left ul').on('click','a',function (e) {
            // console.log(e);
			// 给所有li删除active
			// 获取当前的a的父元素li 给当前点击的li添加active 获取当前li的其他兄弟删除active
			$(e.target.parentNode).addClass('active').siblings().removeClass('active')
			// var current = $(e.target);
			// 通过获取自定义属性的函数获取当前元素的自定义属性的值
			// var id = current.data('id');
            var id = e.target.dataset['id'];
            // console.log(id);
			// 4. 根据当前的id请求右侧品牌数据
			// 5. 根据左侧id来请求API获取右侧品牌数据
			getRightData(id)
		});

		function getRightData(id){
			// 5. 根据左侧id来请求API获取右侧品牌数据
			$.ajax({
				url:'/category/querySecondCategory',
				data:{id:id},//右侧API需要传递参数
				success:function (data) {
                    // console.log(data);
					// 6. 调用右侧分类的模板生成html
					var html = template('categoryRightTmp',data);
					if(html){					
						// 7. 把html渲染到右侧的mui-row里面
						$('.category-right .mui-row').html(html);
					}else{
						// 8. 提示没有数据
						$('.category-right .mui-row').html('<h6>没有更多</h6>');
					}
				}
			}); 
		}
	}
}




