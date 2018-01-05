//引入插件
var gulp = require('gulp');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var plumber = require('gulp-plumber');
var process = require('process');
var sh = require('shelljs');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin'); // 压缩image
var cleanCSS = require('gulp-clean-css'); // 压缩css
var htmlmin = require('gulp-htmlmin'); // 压缩html
var uglify = require('gulp-uglify'); // 压缩js
var gutil = require('gulp-util');
var del = require('del'); // 清空文件和文件夹

var allPath = {
    src: ['./src'],
    dist: ['./dist']
};

var connectFlag = 0; // 用于控制connect任务中的root路径
var portFlag = 0; // 用于控制端口不同

// 生产模式任务
var productionTask = [];

// clean task
gulp.task('clean', function() {
    return del([
        allPath.dist + '/**/*'
    ]);
});

// 使用connect启动一个Web服务器
gulp.task('connect', function() {
    connect.server({
        root: connectFlag ? './dist' : './src',
        livereload: {
            enable: true,
            port: portFlag ? 36000 : 36000
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

// 打开浏览器
// 关于windows下(如在IE6下)的提示：start找不到[http://localhost:9000]文件
// 解决方案是：打开IE6浏览器(一个空白页)之后再执行gulp任务
gulp.task('open-browser', function() {
    var platform = process.platform;
    // 用于区分开发模式9005和生产模式8005的测试
    var shellStr1 = "open -a '/Applications/Google Chrome.app' 'http://localhost:9012'";
    var shellStr2 = "start http://localhost:9012";

    var shellStr3 = "open -a '/Applications/Google Chrome.app' 'http://localhost:8012'";
    var shellStr4 = "start http://localhost:8012";

    // 打开浏览器方法：
    var openFunc = function(str, flag) {
        // 执行并对异常处理
        if (sh.exec(str).code !== 0) {
            sh.echo(flag + '下打开浏览器失败,建议您安装chrome并设为默认浏览器!');
            sh.exit(1);
        }
    };
    if (platform === 'darwin') {
        openFunc(portFlag ? shellStr3 : shellStr1, 'Mac');
    } else if (platform === 'win32' || platform === 'win64') {
        openFunc(portFlag ? shellStr4 : shellStr2, 'Windows');
    } else {
        sh.echo('现在只支持Mac和windows系统!如果未打开页面，请确认安装chrome并设为默认浏览器!');
    }
});

//运行Gulp时,搭建起跨域服务器 开发模式下
gulp.task('server', ['connect'], function() {
    sh.echo("服务器开启!");
    connectFlag = 0;
    portFlag = 0;
    sh.echo('将要打开浏览器访问：http://localhost:9012');
    process.nextTick(function() {
        runSequence(['watch', 'open-browser']);
    }, 3500);
});

// 开始构建
gulp.task('build', ['clean'], function() {
    gutil.log(gutil.colors.yellow('构建开始!'));
    runSequence(productionTask, function() {
        gutil.log(gutil.colors.yellow('构建完成!'));
    });
});

gulp.task('build-server', ['connect'], function() {
    sh.echo("开始测试构建, 服务器开启!");
    connectFlag = 1;
    portFlag = 1;
    sh.echo('将要打开浏览器访问：http://localhost:8012');
    process.nextTick(function() {
        runSequence(['open-browser']);
    }, 3500);
});