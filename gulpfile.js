
var gulp = require('gulp');
var reactify = require('reactify');
var browserify = require('browserify');
var source = require("vinyl-source-stream");

// i suspect it's only running reactify on .jsx files.
// need to modify...

// https://truongtx.me/2014/07/18/using-reactjs-with-browserify-and-gulp/
// https://viget.com/extend/gulp-browserify-starter-faq
// http://christianalfoni.github.io/javascript/2014/08/15/react-js-workflow.html



function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

var deps = ['react', 'redux', 'react-redux' ];

gulp.task('vendor', function(){
  var b = browserify();
  b.transform({ global: true }, reactify);
  b.require(deps);
  return b.bundle()
    // .on('error', handleErrors)
    .pipe(source('vendor.js'))
    .pipe(gulp.dest('./dist'));
});



gulp.task('bundle', function(){
  var b = browserify();
  b.transform({ global: true }, reactify); // use the reactify transform
  b.add('./src/js/main.js');
  b.external(deps);
  return b.bundle()
    // .on('error', handleErrors)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('copy', function() {
    gulp.src('src/*.html')
      .pipe(gulp.dest('dist'));
});

gulp.task('default',['bundle', 'copy']);


gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['default']);
});



