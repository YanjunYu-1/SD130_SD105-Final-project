const  {src, dest, parallel, watch} = require('gulp');
const gulpWebpack = require('webpack-stream');

const processPage = () => {
  return src('src/*.html').pipe(dest('dist'));
};

const processStyles = () => {
  return src('src/styles/**/*.css').pipe(dest('dist/styles'));
};

const processScripts = () => {
  return src('src/scripts/**/*.js')
  .pipe(
    gulpWebpack({ mode:'production', output:{filename:'app.js'}})
  )
  .pipe(dest('dist/scripts'));
};

const watchTask = () => {
  return watch(
    ['src/**/**/**'],
    parallel(processPage,processStyles,processScripts)
  );
};

exports.default = parallel(processPage,processStyles,processScripts);
exports.watch = watchTask;