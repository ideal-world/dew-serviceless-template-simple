const gulp = require('gulp');
const path = require('path');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const { series, parallel } = require('gulp');
const rm = require('rimraf');
const concat = require('gulp-concat');
const cheerio = require('gulp-cheerio');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-cssmin');
const minifyHtml = require('gulp-minify-html');
const rename = require('gulp-rename');
const resversion = require('gulp-res-version');
const connect = require('gulp-connect');
const gulpif = require('gulp-if');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const exorcist = require('exorcist');
const tsify = require('tsify');

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;
const isDev = NODE_ENV === 'dev';
const isProd = NODE_ENV === 'prod';

const _path = {
  main_js: './index.js',
  js: ['./index.js', './src/*.tsx', './src/**/**/*.tsx'],
  lint_js: ['./src/*.tsx', './src/**/**/*.tsx'],
  scss: ['./src/components/**/*.scss'],
  html: './index.html'
};

const clean = (done) => {
  rm('./dist', error => {
    if (error) throw error;
    done();
  });
};

const _lint = () => {
  return gulp.src(_path.lint_js)
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};

const _css = () => {
  return gulp.src(_path.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(gulpif(isProd, cssmin()))
    .pipe(gulpif(isProd, rename({suffix: '.min'})))
    .pipe(gulpif(isDev, sourcemaps.write('/')))
    .pipe(gulp.dest('./dist/css'))
    .pipe(gulpif(isDev, connect.reload()));
};

const _script = () => {
  return browserify({
      entries: _path.main_js,
      debug: isDev,
      extensions: ['.js', '.jsx', 'tsx', '.json'],
      paths: ['./src/'],
    }).plugin(tsify)
    .transform(babelify, {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        '@babel/plugin-transform-runtime', 
        ['@babel/plugin-proposal-decorators', { 'legacy': true }], 
        ['@babel/plugin-proposal-class-properties', { 'loose': true }]
      ]
    })
    .bundle()
    .pipe(gulpif(isDev, exorcist(path.resolve(__dirname, 'dist/js/app.js.map')))) // 生成外部map
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(isProd, uglify()))
    .pipe(gulpif(isProd, rename({suffix: '.min'})))
    .pipe(gulp.dest('./dist/js'))
    .pipe(gulpif(isDev, connect.reload()));
};

const _html = () => {
  return gulp.src(_path.html)
  .pipe(cheerio(($ => {
    $('script').remove();
    $('link').remove();
    $('body').append(`<script src="./js/app${isDev ? '' : '.min'}.js"></script>`);
    $('head').append(`<link rel="stylesheet" href="./css/app${isDev ? '' : '.min'}.css">`);
  })))
  .pipe(gulpif(isProd, minifyHtml({
    empty: true,
    spare: true
  })))
  .pipe(gulp.dest('./dist'))
  .pipe(gulpif(isDev, connect.reload()));
};

const _version = () => {
  return gulp.src('./dist/*.html')
    .pipe(resversion({
      rootdir: './dist/',
      ignore: [/#data$/i]
    }))
    .pipe(gulp.dest('./dist'));
};

const _server = () => {
  connect.server({
    root: 'dist',
    port: PORT,
    livereload: true
  });
};

const _watch = () => {
  gulp.watch(_path.html, _html);
  gulp.watch(_path.js, _script);
  gulp.watch(_path.scss, _css);
};

module.exports = {
  build: series(clean, parallel(_script, _css, _html), _version),
  dev: series(clean, _lint, parallel(_script, _css, _html), _version, parallel(_server, _watch))
};
