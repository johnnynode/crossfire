//引入插件
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    proxy = require('http-proxy-middleware'),
    plumber = require('gulp-plumber'),
    process = require('process'),
    runSequence = require('run-sequence'),
    watch = require('gulp-watch'),
    imagemin = require('gulp-imagemin'), // 压缩image
    sass = require('gulp-sass'), // sass 文件处理
    cleanCSS = require('gulp-clean-css'), // 压缩css
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin'), // 压缩html
    uglify = require('gulp-uglify'), // 压缩js
    gutil = require('gulp-util'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    htmlreplace = require('gulp-html-replace'),
    inject = require('gulp-inject'),
    del = require('del'), // 清空文件和文件夹
    open = require('gulp-open'),
    order = require("gulp-order"), // 判断引入优先级
    stripDebug = require('gulp-strip-debug'), // Strip console, alert, and debugger statements
    _if = require('gulp-if'); // 引用判断

var platform = process.platform, // 判断操作系统
    // 定义一组browser的判断
    browser = platform === 'linux' ? 'google-chrome' : (
    platform === 'darwin' ? 'google chrome' : (
        platform === 'win32' ? 'chrome' : 'firefox')),
    timeStamp = new Date().getTime(), // 添加时间戳，标识每次构建生成的不同的文件
    connectFlag = 0, // 用于控制connect任务中的root路径
    portFlag = 0; // 用于控制端口不同

var allPath = {
    src: './src',
    dist: './dist',
    index: './src/index.html',
    appCss: './src/css/**',
    libJs: './src/lib/**',
    appJs: './src/js/**',
    images: './src/images/**',
    replacePath: {
        'appCss':'app/app.' + timeStamp + '.min.css',
        'libJs':'app/vendor.' + timeStamp + '.min.js',
        'appJs': 'app/app.' + timeStamp + '.min.js',
    },
    copyList: ['./src/favicon.ico', './src/swf/**']
};

// 生产模式任务
var productionTask = ["index", "images", "app-css", "lib-js", "app-js", "copy-list"];

// 使用connect启动一个Web服务器
gulp.task('connect', function() {
    var root = connectFlag ? allPath.dist : allPath.src;
        hostname =  '127.0.0.1';
    connect.server({
        root: root,
        host: hostname,
        livereload: {
            hostname: hostname,
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
        uri: 'http://127.0.0.1:' + (portFlag ? '8012' : '9012'),
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

// 处理index.html相关引入脚本，包括样式和脚本
gulp.task('index', function () {
    return gulp.src(allPath.index)
        .pipe(plumber())
        .pipe(htmlreplace(allPath.replacePath))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(allPath.dist + '/.'));
});

// 处理app 样式
gulp.task('app-css', function() {
    return gulp.src(allPath.appCss)
        .pipe(plumber())
        // todo sass
        .pipe(cleanCSS({rebase: true}))
        .pipe(postcss([autoprefixer()]))
        .pipe(concat(allPath.replacePath.appCss))
        .pipe(gulp.dest(allPath.dist + '/.'));
});

// 处理 libjs
gulp.task('lib-js', function() {
    return gulp.src(allPath.libJs)
        .pipe(plumber())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat(allPath.replacePath.libJs))
        .pipe(gulp.dest(allPath.dist + '/.'));
});

// 处理 appjs
gulp.task('app-js', function() {
    return gulp.src(allPath.appJs)
        .pipe(plumber())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(concat(allPath.replacePath.appJs))
        .pipe(gulp.dest(allPath.dist + '/.'));
});

// 处理图片
gulp.task('images', function() {
    return gulp.src(allPath.images)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest(allPath.dist + '/images'));
});

// clean task
gulp.task('clean', function() {
    return del([
        allPath.dist
    ]);
});

// 复制任务
gulp.task('copy-list', function() {
    return gulp.src(allPath.copyList, {base:'./src'})
        .pipe(plumber())
        .pipe(gulp.dest(allPath.dist + '/'));
});

// 开始构建 todo
gulp.task('build', ['clean'], function() {
    console.time('build');
    gutil.log(gutil.colors.yellow('🚄 构建开始!'));
    runSequence(productionTask, function() {
        gutil.log(gutil.colors.yellow('🔥 构建完成,总共用时：'));
        console.timeEnd('build');
    });
});

// 构建之后开启服务器
gulp.task('build-server', function() {
    connectFlag = 1;
    portFlag = 1;
    runSequence(['connect', 'open']);
});