
var gulp = require('gulp');
// var reactify = require('reactify');
var browserify = require('browserify');
var source = require("vinyl-source-stream");

var babel = require('babelify');



// i suspect it's only running reactify on .jsx files.
// need to modify...

// https://truongtx.me/2014/07/18/using-reactjs-with-browserify-and-gulp/
// https://viget.com/extend/gulp-browserify-starter-faq
// http://christianalfoni.github.io/javascript/2014/08/15/react-js-workflow.html


var deps = ['react', 'redux', 'react-redux', 'react-bootstrap' ];

gulp.task('vendor', function(){
  var b = browserify();
  b.transform({ global: true }, babel );
  b.require(deps);
  return b.bundle()
    // .on('error', handleErrors)
    .pipe(source('vendor.js'))
    .pipe(gulp.dest('./dist'));
});



gulp.task('bundle', function(){
  var b = browserify();
  b.transform({ global: true }, babel ); // use the reactify transform
  b.add('./src/js/main.js');
  b.external(deps);

  return b.bundle()
    // .on('error', handleErrors)
    .on('error', function(e) {
      console.error(e.message);
      console.error(e.loc);
      console.error(e.codeFrame);
      this.emit('end');
    })

    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('copy', function() {
    gulp.src('src/*.html')
      .pipe(gulp.dest('dist'));
});

gulp.task('default',['bundle', 'copy']);


gulp.task('watch', function() {
    // we want to not exit when this fails...
    gulp.watch('src/js/*.js', ['default']);
});



