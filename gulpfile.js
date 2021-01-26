const {dewBuild} = require('@idealworld/plugin-gulp')
const gulp = require('gulp')
const path = require('path')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const {series, parallel} = require('gulp')
const rm = require('rimraf')
const concat = require('gulp-concat')
const cheerio = require('gulp-cheerio')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify-es').default
const cssmin = require('gulp-cssmin')
const minifyHtml = require('gulp-minify-html')
const rename = require('gulp-rename')
const resversion = require('gulp-res-version')
const connect = require('gulp-connect')
const gulpif = require('gulp-if')
const eslint = require('gulp-eslint')
const sourcemaps = require('gulp-sourcemaps')
const exorcist = require('exorcist')
let ts = require("gulp-typescript")
let tsProject = ts.createProject('tsconfig.json')

const PORT = process.env.PORT || 8080
const NODE_ENV = process.env.NODE_ENV
const isDev = NODE_ENV === 'dev'
const isProd = NODE_ENV === 'prod'

const _path = {
    dist: './dist',
    action: './dist/actions',
    release: './release',
    main_js: './index.js',
    js: ['./index.js','./src/**/*.ts', './src/**/*.tsx'],
    lint_js: ['./src/**/*.tsx'],
    scss: ['./src/**/*.scss'],
    html: './index.html'
}

function _clean(done) {
    rm(_path.dist, error => {
        if (error) throw error
        rm(_path.release, error => {
            if (error) throw error
            done()
        })
    })
}

function _ts() {
    return tsProject.src()
        .pipe(tsProject()).js
        .pipe(gulp.dest(_path.dist))
}

function _dewBuild() {
    return dewBuild(_path.action,NODE_ENV,isDev)
}

function _lint() {
    return gulp.src(_path.lint_js)
        .pipe(eslint({
            useEslintrc: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
}

function _css() {
    return gulp.src(_path.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('app.css'))
        .pipe(gulpif(isProd, cssmin()))
        .pipe(gulpif(isProd, rename({suffix: '.min'})))
        .pipe(gulpif(isDev, sourcemaps.write('/')))
        .pipe(gulp.dest(gulpif(isProd, _path.release, _path.dist) + '/css'))
        .pipe(gulpif(isDev, connect.reload()))
}

function _script() {
    return browserify({
        entries: _path.main_js,
        debug: isDev,
        extensions: ['.js', '.jsx', 'tsx', '.json'],
        paths: [_path.dist],
    })
        .transform(babelify, {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
                '@babel/plugin-transform-runtime',
                ['@babel/plugin-proposal-decorators', {'legacy': true}],
                ['@babel/plugin-proposal-class-properties', {'loose': true}]
            ]
        })
        .bundle()
        .pipe(gulpif(isDev, exorcist(path.resolve(__dirname, gulpif(isProd, _path.release, _path.dist) + '/js/app.js.map')))) // 生成外部map
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulpif(isProd, uglify()))
        .pipe(gulpif(isProd, rename({suffix: '.min'})))
        .pipe(gulp.dest(gulpif(isProd, _path.release, _path.dist) + '/js'))
        .pipe(gulpif(isDev, connect.reload()))
}

function _html() {
    return gulp.src(_path.html)
        .pipe(cheerio(($ => {
            $('script').remove()
            $('link').remove()
            $('body').append(`<script src="./js/app${isDev ? '' : '.min'}.js"></script>`)
            $('head').append(`<link rel="stylesheet" href="./css/app${isDev ? '' : '.min'}.css">`)
        })))
        .pipe(gulpif(isProd, minifyHtml({
            empty: true,
            spare: true
        })))
        .pipe(gulp.dest(gulpif(isProd, _path.release, _path.dist)))
        .pipe(gulpif(isDev, connect.reload()))
}

function _version() {
    return gulp.src(gulpif(isProd, _path.release, _path.dist) + '/*.html')
        .pipe(resversion({
            rootdir: gulpif(isProd, _path.release, _path.dist),
            ignore: [/#data$/i]
        }))
        .pipe(gulp.dest(_path.dist))
}

function _server() {
    connect.server({
        root: _path.dist,
        port: PORT,
        livereload: true
    })
}

function _watch() {
    gulp.watch(_path.html, _html)
    gulp.watch(_path.js, series(_ts, _script))
    gulp.watch(_path.scss, _css)
}

module.exports = {
    build: series(_clean, _ts, _dewBuild, parallel(_script, _css, _html), _version),
    dev: series(_clean, _ts,_dewBuild, _lint, parallel(_script, _css, _html), _version, parallel(_server, _watch)),
}

