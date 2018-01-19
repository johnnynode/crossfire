//引入插件
var gulp = require('gulp');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var plumber = require('gulp-plumber');
var process = require('process');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var open = require('gulp-open');

var allPath = {
    src: './src',
    dist: './dist'
};

var connectFlag = 0; // 用于控制connect任务中的root路径
var portFlag = 0; // 用于控制端口不同

// 生产模式任务
var productionTask = [];

// 判断操作系统
var platform = process.platform;

// 定义一组browser的判断
var browser = platform === 'linux' ? 'google-chrome' : (
    platform === 'darwin' ? 'google chrome' : (
        platform === 'win32' ? 'chrome' : 'firefox'));

// 使用connect启动一个Web服务器
gulp.task('connect', function() {
    var root = connectFlag ? allPath.dist : allPath.src;
    connect.server({
        root: root,
        host: '127.0.0.1',
        livereload: {
            hostname: '127.0.0.1',
            enable: true,
            port: portFlag ? 36000 : 35729
        },
        port: portFlag ? 8012 : 9012,
        middleware: function(connect, opt) {
            return [
                /*
                proxy(["/api"], {
                    target: 'your-url',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api': '/'
                    }
                })
                */
            ]
        }
    });
});

gulp.task('watch', function() {
    gulp.src(allPath.src)
        .pipe(plumber())
        .pipe(watch(allPath.src))
        .pipe(connect.reload());
});

// 打开浏览器的任务
gulp.task('open', function() {
    // gulp-open 的选项
    var browserOptions = {
        uri: 'http://localhost:' + (portFlag ? '8012' : '9012'),
        app: browser
    };
    gulp.src(allPath.src)
        .pipe(open(browserOptions));
});

//运行Gulp时,搭建起跨域服务器 开发模式下
gulp.task('server', ['connect'], function() {
    connectFlag = 0;
    portFlag = 0;
    runSequence(['watch', 'open']);
});