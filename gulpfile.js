const gulp = require("gulp");
const gulpSass = require("gulp-sass"); //编译scss
const cssmin = require("gulp-clean-css"); //压缩css
const gulpBabel = require("gulp-babel"); //编译js
const uglify = require("gulp-uglify"); //压缩js
const htmlmin = require("gulp-htmlmin"); //编译html;
const server = require("gulp-webserver");; //起服务
const { readFileSync } = require("fs");
const { join } = require("path");
const url = require("url");
const data = require("./src/data/getData.json");
gulp.task("devScss", () => {
    return gulp.src("./src/css/*.scss")
        .pipe(gulpSass()) //编译scss
        .pipe(cssmin({ compatibility: 'ie8' }))
        .pipe(gulp.dest("./public/css"))
})

gulp.task("devJs", () => {
    return gulp.src("./src/js/*.js")
        .pipe(gulpBabel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest("./public/scripts"))
})

//编译html
gulp.task("devHtml", () => {
    return gulp.src("./src/*.html")
        .pipe(htmlmin({
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./public"))
})



//起服务
gulp.task("devServer", () => {
    return gulp.src("./src")
        .pipe(server({
            port: 1234,
            livereload: true,
            Middleware(req, res, next) {
                let { pathname, query } = url.parse(req.url, true);
                if (pathname === "/favicon.ico") {
                    return res.end("")
                }
                pathname = pathname === "/" ? "index.html" : pathname;
                if (pathname === "/getData") {
                    res.end(JSON.stringify(readFileSync(join(__dirname, "src,pathname"))));
                } else {
                    res.end({ code: 1, data: { "name": "zs" } })
                }
            }
        }))
})



gulp.task("watch", () => {
    gulp.watch("./src/css/*.scss", gulp.series("devScss"));
    gulp.watch("./src/js/*.js", gulp.series("devJs"));
    gulp.watch("./src/*.html", gulp.series("devHtml"));
})

gulp.task("default", gulp.series("devScss", "devJs", "devHtml", "devServer", "watch"))