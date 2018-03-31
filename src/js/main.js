$(function () {
    // 构造函数
    var Page = function () {};
    // 原型
    Page.prototype = {
        init: function () {
            swfobject && swfobject.registerObject("FlashID"); // 处理flash
            (window.navigator.userAgent.indexOf("Chrome") === -1) && $('.flash-placeholder').addClass('cur') && $('#FlashID').addClass('cur');
            this.bindEvents();
            this.initComponents();
        },
        /* 绑定事件 */
        bindEvents: function () {
            /* 轩辕传奇 鼠标hover */
            $('.header_bar_up .extend').hover(function () {
                $(this).children('a').addClass('cur');
                $('.header_bar_up .header_bar_down').addClass('cur');
            }, function () {
                $(this).children('a').removeClass('cur');
                $('.header_bar_up .header_bar_down').removeClass('cur');
            });
 
            /* 右上角 腾讯游戏 hover */
            $('.header_bar_up .tencent_game').hover(function () {
                $(this).children('.tencent_game_down').addClass('cur');
            }, function () {
                $(this).children('.tencent_game_down').removeClass('cur');
            })
 
            /* 主导航部分 hover */
            $('#header_wrap .nav_holder').hover(function () {
                $(this).children('ul').addClass('cur');
            }, function () {
                $(this).children('ul').removeClass('cur');
            });
            $('#header_wrap .nav_holder > li').hover(function () {
                $(this).addClass('cur');
            }, function () {
                $(this).removeClass('cur');
            });
 
 
            /*      main  content   section           */
 
            /*       最大轮播图        */
            /*  定时器的设置  */
            var speed3 = 1000;
            var $rc_index = 0;
            var timer3 = setInterval(fun3, speed3);
            var speed3_3 = 300;
            var $pic_index = 0;
            var $pic_l = $('.real_pic_list li').length;
            var $pic_h = $('.real_pic_list li').outerHeight(true);
 
            function fun3() {
                /*pic  play*/
                $pic_index++;
                if ($pic_index > ($pic_l - 1)) {
                    $pic_index = 1;
                    $('.real_pic_list').css({
                        'top': 0
                    });
                }
                $('.real_pic_list').stop().animate({
                    'top': -$pic_index * $pic_h + 'px'
                }, speed3_3);
 
                /*     rectangle_click   play       */
                var $rc_li_l = $('.rectangle_click li').length;
                $rc_index++;
                if ($rc_index > ($rc_li_l - 1)) {
                    $rc_index = 0;
                }
                $('.rectangle_click li').eq($rc_index).addClass('cur').siblings().removeClass('cur');
            }
            /*     鼠标hover 图片 停止定时器         */
            $('.c_p1_pic_play').hover(function () {
                clearInterval(timer3);
            }, function () {
                clearInterval(timer3);
                timer3 = setInterval(fun3, speed3);
            })
            /*         小矩形的hover           */
            $('.rectangle_click li').hover(function () {
                clearInterval(timer3);
                var $this_rc_index = $(this).index();
                $('.real_pic_list').stop().animate({
                    'top': (-$this_rc_index * $pic_h) + 'px'
                }, speed3_3);
                $(this).addClass('cur').siblings().removeClass('cur');
            }, function () {
                /*clearInterval(timer3);
                timer3=setInterval(fun3, speed3);*/
            });
 
            /*        第一个选项卡             */
            $('.c_p1_tab ul li').hover(function () {
                $(this).children('a').addClass('cur');
                $(this).siblings('li').children('a').removeClass('cur');
                $(this).siblings('li').children('.tab_con').removeClass('cur');
                $(this).children('.tab_con').addClass('cur');
                $('.c_p1_tab ul li').eq(0).children('a').removeClass('cur cur1');
            });
 
            $('.c_p1_tab ul li').eq(0).hover(function () {
                $(this).children('a').addClass('cur1');
            });
            $('.c_p1_tab ul li').eq(4).hover(function () {
                $(this).children('.more1').addClass('cur');
            });
 
            /*          视频选项卡 tab                   */
            $('.con_part03_2 li').hover(function () {
                $(this).addClass('cur').siblings().removeClass('cur');
                $('.con_part03_3 .li_ruler').eq($(this).index()).addClass('cur').siblings().removeClass('cur');
            });
 
            /*     .con_part04_pic ol li tab  鼠标点击事件     */
            $('.con_part04_pic ol li').click(function () {
                $('.con_part04_pic ul li').eq($(this).index()).addClass('cur').siblings().removeClass('cur');
                $(this).addClass('cur').siblings().removeClass('cur');
            });
 
            /*     con_part04_2  li   的 hover  事件       */
            $('.con_part04_2 li').hover(function () {
                $(this).addClass('cur').siblings().removeClass('cur');
                $('.con_part04_3>li').eq($(this).index()).addClass('cur').siblings().removeClass('cur');
            });
        },
        /* 小组件 */
        initComponents: function () {
            /* 合作媒体  小轮播图 */
            var coMedia = function () {
                var speed1 = 3000;
                var $i = 0;
                var speed1_1 = 200;
                var timer1 = setInterval(mediaPlay, speed1);
 
                function mediaPlay() {
                    var $p_b = $('.co_in_med_ply_box ul li').length;
                    var $h_li = $('.co_in_med_ply_box ul li').outerHeight(true);
                    $i++;
                    if ($i > $p_b - 1) {
                        $i = 1;
                        $('.co_in_med_ply_box ul').css('top', 0);
                    }
                    $('.co_in_med_ply_box ul').stop().animate({
                        'top': (-$i * $h_li) + "px"
                    }, speed1_1);
                }
 
                /*  鼠标hover  停止计时器  */
                $('.co_in_med_ply_box ul li').hover(function () {
                    clearInterval(timer1);
                }, function () {
                    clearInterval(timer1);
                    timer1 = setInterval(mediaPlay, speed1);
                });
 
                /* 合作媒体 hover */
                $('.co_med_kuang').hover(function () {
                    $(this).children('.co_med_box').stop(true, true).slideDown('fast');
                }, function () {
                    $(this).children('.co_med_box').stop(true, true).fadeOut('fast');
                });
            };
 
            /* 评论的滚动字幕 */
            var rollingCaptions = function () {
                var speed2 = 3000;
                var $dis_count = 0;
                var speed2_2 = 300;
                var timer2 = setInterval(capPlay, speed2);
 
                function capPlay() {
                    var $dis_li_l = $('.data_base .discuss_list li').length;
                    var $dis_li_h = $('.data_base .discuss_list li').outerHeight(true);
                    $dis_count++;
                    if ($dis_count > ($dis_li_l - 1)) {
                        $dis_count = 1;
                        $('.data_base .discuss_list').css('top', 0);
                    }
                    //console.log($dis_count);
                    $('.data_base .discuss_list').stop().animate({
                        'top': -($dis_count * $dis_li_h) + 'px'
                    }, speed2_2);
                }
 
                /* 给滚动屏幕添加一个hover 停止 */
                $('.data_base .discuss').hover(function () {
                    clearInterval(timer2);
                }, function () {
                    clearInterval(timer2);
                    timer2 = setInterval(capPlay, speed2);
                });
            };
 
            return (function (co, ro) {
                co();
                ro();
            })(coMedia, rollingCaptions);
        }
    };
    // 实例化
    var page = new Page();
    // 初始化页面
    page.init();
});