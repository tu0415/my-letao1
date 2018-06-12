var letao;
$(function(){
    letao = new Letao();
    // 调用初始化上下拉菜单
    letao.initPullRefresh();

    // 调用商品列表函数
    letao.searchProductList();

    // 商品的排序
    letao.productSort();
    search = getQueryString('search');

    // 进入商品列表页面马上执行搜索
    letao.getProductList({
        proName: search
    }, function (data) {
          // 4. 把数据调用模板引擎生成html
          var html = template('productListTmp', data);
          // 5. 把生成的模板绑定到商品列表的内容
          $('.content .mui-row').html(html);
    })

});

// 乐淘的构造函数
var Letao = function() {}

var search;
var page = 1;

Letao.prototype = {
    // 初始化上下拉刷新
    initPullRefresh:function() {
        mui.init({
            pullRefresh : {
              container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
              down : {
                // style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
                // color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
                // height:'50px',//可选,默认50px.下拉刷新控件的高度,
                // range:'100px', //可选 默认100px,控件可下拉拖拽的范围
                // offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
                // auto: true,//可选,默认false.首次加载自动上拉刷新一次
                //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback :function () {
                    setTimeout(function () {
                        letao.getProductList({
                            proName:search
                        },function (data) {
                            console.log('下拉刷新完毕');
                            var html = template('productListTmp',data);
                            // 5. 把生成的模板绑定到商品列表的内容
                            $('.content .mui-row').html(html); 
                              // 当前数据请求渲染完毕后结束下拉刷新
                            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                            //每次下拉刷新的时候要重置上拉加载更多
                            mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                            // page当前页码也要重置为1
                            page = 1;  
                        })
                    },1500)
                }
              },
              up : {
                  contentnomore : "没有更多了...",
                  callback:function () {
                      setTimeout (function () {
                          letao.getProductList({
                              proName:search,
                              page:++page
                          },function (data) {
                            console.log('上拉加载完毕');
                            // 4. 把数据调用模板引擎生成html
                           var html = template('productListTmp',data);
                           // 5. 把生成的模板绑定到商品列表的内容
                           $('.content .mui-row').append(html); 
                           if(data.data.length > 0){                                    
                             // 当前数据请求渲染完毕后结束下拉刷新
                           mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                           }else{
                               //length小于等于表示数据已经加载完毕
                               //结束上拉加载并且提示没有更多数据了
                                mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                           }
                          })
                        mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(true);
                      },1500)
                  }
              }
            }
          });
    },
    
    // 搜索商品列表
    searchProductList:function () {
        // 1. 给搜索按钮添加点击事件
        $(".btn-search").on("tap",function () {
            // alert(123);
            // 2. 获取输入框里的值
             search = $(".search-input").val();
            // console.log(search);
            // 3. 调用商品列表的API搜索商品
            letao.getProductList({
                proName:search
            },function (data) {
                // console.log(data);
                
                // 4. 把数据调用模板引擎生成html
                var html = template("productListTmp",data);
                // console.log(html);
                
               // 5. 把生成的模板绑定到商品列表的内容
               $('.content .mui-row').html(html); 
            });
        })
    },
 
    getProductList:function (obj,callback) {
        $.ajax({
            url:'/product/queryProduct',
            data:{
                page:obj.page || 1,
                pageSize:obj.pageSize || 2,
                proName:obj.proName,
                price:obj.price,
                num:obj.num 
            },
            success:function (data) {
                // console.log(data); 
                // 判断回调函数传递了就调用
                if(callback){            
                    //  数据确定渲染完毕后我就可以结束下拉刷新    
                    callback(data);
                }
            }
        })
    },

   // 商品列表的排序
   productSort: function() {
    // 1. 给所有排序按钮添加点击事件 tap
    $('.productlist .title').on('tap', 'a', function() {
        // 2. 跟当前点击的a获取当前a链接的排序方式
        var sortType = $(this).data('sort-type');
        // 3. 获取当前a上data-sort排序顺序  1代表升序 2代表降序
        var sort = $(this).data('sort');
        // 4. 判断当前sort 是1 还是2  
        if (sort == 1) {
            //如果是1 就表示当前是升序 点击了之后变成降序 sort = 2
            sort = 2;
        } else {
            //如果是1 就表示当前是降序 点击了之后变成升序 sort = 1
            sort = 1;
        }
        // 5. 改变完sort后赋值给当前的data-sort自定义属性的值
        $(this).attr('data-sort', sort);
        // 6. 判断当前sortType是哪个排序方式 如果是price就执行价格排序 如果是num就执行num排序
        if (sortType == 'price') {
            // 7. 当前是排序类型是price 就调用获取数据函数传入price的排序方式
            letao.getProdcutList({
                proName: search,
                price: sort
            }, function(data) {
                // 4. 把数据调用模板引擎生成html
                var html = template('productListTmp', data);
                // 5. 把生成的模板绑定到商品列表的内容
                $('.content .mui-row').html(html);
            });
        } else if (sortType == 'num') {
            // 8. 当前是排序类型是num 就调用获取数据函数传入num的排序方式
            letao.getProdcutList({
                proName: search,
                num: sort
            }, function(data) {
                // 4. 把数据调用模板引擎生成html
                var html = template('productListTmp', data);
                console.log(html);
                
                // 5. 把生成的模板绑定到商品列表的内容
                $('.content .mui-row').html(html);
            });
        }
    });
}
}

//获取url地址栏的参数的函数 网上找的  name就是url参数名
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}

