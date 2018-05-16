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
const concat = require('gulp-concat');
const minify = require('gulp-minify');

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

 
gulp.task('jsc',()=>{

    return gulp.src(['./src/js/model/model.js', './src/js/view/view.js', './src/js/controller/controller.js'])
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./src/js/'))

})



// Минификация JS 

gulp.task('jsm', function() {
    gulp.src('./src/js/index.js')
      .pipe(minify({
          ext:{
              src:'.js',
              min:'-min.js'
          },
      }))
      .pipe(gulp.dest('./build/js'))
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
        "html",
        "images",
        "jsc",
        "jst",
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
    gulp.watch("src/*.html", ["html"]).on("change", server.reload);
   

});


