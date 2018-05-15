const gulp = require("gulp");
const less = require("gulp-less");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const csso = require("gulp-csso");
const del = require("del");
const imagemin = require("gulp-imagemin");
const pump = require("pump");
const rename = require("gulp-rename");
const run = require("run-sequence");
const uglify = require("gulp-uglify");
const babel = require('gulp-babel');
const eslint = require('eslint');

//Автопрефиксер и минификация

gulp.task("style", () => {
    gulp.src("src/less/style.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());

});

//eslint for js 
gulp.task('eslint', () => {
    gulp.src(["src/js/*.js", "!src/js/*.min.js", "!gulpfile.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
});


//траспиляция + Минификация JS 
gulp.task('js', () => {
    gulp.src("./src/js/index.js")
    
      .pipe(babel({
           presets: ['env']  
        })) 
        .pipe(uglify()) //сжать
        .pipe(gulp.dest("./build/js"))

});

//Оптимизация изображений
gulp.task('images', () =>
    gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
);


//Очистка build
gulp.task("clean", () => {
    return del("build");
});

//Копирование в build
gulp.task("copy", () => {
    return gulp.src([
        "src/fonts/*.{woff,woff2}",
        "src/js/*.js",
        "src/img/*png",
        "*.html"
    ], {
            base: "."
        })
        .pipe(gulp.dest("build"));
});



// копирование html
gulp.task("html", () => {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("build"));
});




//Запуск сборки
gulp.task("./", done => {
    run(
        "style",
      "eslint",    
        "js",
        "html",
        "images",
        done
    );
});

//запуск сервера с конфигурацией
gulp.task('serve', () => {
    server.init({
   
        server: "./build",
        notify: false,
        open: false,
        cors: false,
        ui: false
    });


    gulp.watch("src/less/**/*.less", ["style"]).on("change", server.reload);
    gulp.watch("src/js/**/*.js", ["js"]).on("change",server.reload);  
    gulp.watch("src/*.html", ["html"]).on("change", server.reload);

});


