
let project_folder = "dist";
let source_folder = "src";

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,webp,gif,ico}",
        fonts: source_folder + "/fonts/*.ttf",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.style.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,webp,gif,ico}",
    },
    clean: "./" + project_folder + "/"
}

let { src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(); /* запускает сборку в браузере */
    fileinclude = require("gulp-file-include"); /* подключает файлы сборки и сохраняет в dist */
    del = require("del"); /* удаляет ненужные файлы из dist */
    scss = require("gulp-sass"); /* подключает scss файлы и сохраняет в style.css в папке dist*/
    autoprefixer = require("gulp-autoprefixer"); /*расставляет вендорные префиксы свойств css*/
    group_media = require("gulp-group-css-media-queries"); /*группирует разбросанные медиа запросы*/
    clean_css = require("gulp-clean-css"); /*оптимизирует css*/
    rename = require("gulp-rename"); /*переименовывает css в min и создаёт новый*/

    function browserSync(params) {
    browsersync.init( {
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe( 
            autoprefixer({
                overrideBrowserlist: ["last 5 version"],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css)
}

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;