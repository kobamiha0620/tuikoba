// 各処理メソッドを、gulpの中で読み込むのではなく、直接取り出す
// const {src, dest} = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require("gulp-sass-glob");

gulp.task('sass', function(){
  return gulp
      .src('styles/*.scss')
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(sass({
        includePaths: require('node-reset-scss').includePath
      }))
      .pipe(gulp.dest('assets'))

  });
  


gulp.task('watch', function(){
  gulp.watch('styles/**/*.scss', gulp.series('sass'));
});
