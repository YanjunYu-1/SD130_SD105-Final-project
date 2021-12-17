const  {src, dest, parallel, watch} = require('gulp');

const processPage = () => {
  return src('src/*.html').pipe(dest('dist'));
};

const processStyles = () => {
  return src('src/styles/*.css').pipe(dest('dist/styles'));
};

const processScripts = () => {
  return src('src/scripts/**/*.js').pipe(dest('dist/scripts'));
};

exports.default = parallel(processPage,processStyles,processScripts)