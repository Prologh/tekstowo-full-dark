'use strict';

// Load plugins
var gulp = require('gulp');
var gulpAutoprefixer = require('gulp-autoprefixer');
var gulpCssMin = require('gulp-cssmin');
var gulpRename = require('gulp-rename');
var gulpSass = require('gulp-sass');
var nodeSass = require('node-sass');
var rimraf = require('rimraf');

gulpSass.compiler = nodeSass;

const mainCssFileName = 'site';
const mainSassFileName = 'site';

var paths = {
    nodeModules: './node_modules/',
    source: './src/'
};

paths.cssDir = paths.source + 'css/';
paths.sassDir = paths.source + 'sass/';

paths.sassFiles = paths.sassDir + '**/*.scss';

paths.mainCss = paths.cssDir + mainCssFileName + '.css';
paths.mainMinCss = paths.cssDir + mainCssFileName + '.min.css';
paths.mainSass = paths.sassDir + mainSassFileName + '.scss';



/* ### Clean ### */

// Clean output files
gulp.task('clean:cssDir', done => rimraf(paths.cssDir, done));
gulp.task('clean', gulp.series(['clean:cssDir']));



/* ### Compile ### */

// Compile sass files to css
gulp.task('compile:sass', () => {
    return gulp.src(paths.mainSass)
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulpAutoprefixer())
        .pipe(gulp.dest(paths.cssDir));
});

// Global compile task
gulp.task('compile', gulp.series('compile:sass'));



/* ### Minify ### */

// Minify CSS files
gulp.task("minify:css", () => {
    return gulp.src(paths.mainCss)
        .pipe(gulpCssMin())
        .pipe(gulpRename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.cssDir));
});

// Global minify task
gulp.task('minify', gulp.series(['minify:css']));



/* ### Watch ### */

// Watch sass files
gulp.task('watch:sass', () => {
    return gulp.watch(paths.sassFiles, gulp.series(['compile', 'minify:css']));
});

//// Global watch
gulp.task('watch', gulp.parallel(['watch:sass']));



/* ### Default ### */

gulp.task('default', gulp.series(['compile', 'minify']));
