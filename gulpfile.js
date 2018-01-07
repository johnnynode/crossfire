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

//运行Gulp时,搭建起跨域服务器 开发模式下
gulp.task('server', ['connect'], function() {
    sh.echo("服务器开启!");
    connectFlag = 0;
    portFlag = 0;
    sh.echo('将要打开浏览器访问：http://localhost:9012');
    // avoid page crashed error transiently
    var t = setTimeout(function() {
        runSequence(['watch', 'open-browser']);
        t = null;
    }, 1500);
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
    // avoid page crashed error transiently
    var t = setTimeout(function() {
        runSequence(['open-browser']);
        t = null;
    }, 1500);
});