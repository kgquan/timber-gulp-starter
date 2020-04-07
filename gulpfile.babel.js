//Gulp dependencies
import { src, dest, watch, series, parallel } from 'gulp';

//Utilities
import yargs from 'yargs';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import cache from 'gulp-cache';
import log from 'fancy-log';

//CSS
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import stylelint from 'gulp-stylelint';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';

//Images
import imagemin from 'gulp-imagemin';
import del from 'del';

//PHP
import phpcs from 'gulp-phpcs';

//Javascript
import rollup from 'gulp-better-rollup';
import babel from 'rollup-plugin-babel';

//Both JS and CSS
import sourcemaps from 'gulp-sourcemaps';

//Twig
import prettydiff from 'gulp-prettydiff';

/** Defines the opstring for signifying whether a task needs to 
 * run additional steps for production.
 */
const PRODUCTION = yargs.argv.prod;

/**
 * The paths that the Gulpfile will watch for changes.
 */
const watchPaths = {
    scss: 'static/scss/**/*.scss',
    js: 'static/js/**/*.js',
    img: 'static/img/**/*.{jpg,jpeg,png,svg,gif}',
    php: '**/*.php',
    twig: 'templates/**/*.twig'
}

/** The destination paths. */
const destPaths = {
    css: './',
    js: 'static/js',
    img: 'static/img',
    php: './',
    twig: 'templates'
}

/** 
 * Prepares .scss files by linting the file and generating the 
 * sourcemaps. If running the production version, it additionally 
 * runs autoprefixer and minifies the generated CSS. */
export const styles = () => {
    return src('static/scss/style.scss')
    .pipe(stylelint({
        configFile: './.stylelintscssrc',
        reporters: [
            { formatter: 'string', console: true }
        ]
    }))
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
    .pipe(gulpif(PRODUCTION, cleanCss({compatibility:'ie8'})))
    .pipe(gulpif(PRODUCTION, rename('style.min.css')))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest(destPaths.css))
    .pipe(server.stream());
}

/**
 * Watches for changes to any of the files. If there are
 * any changes, it processes the changes via the appropriate
 * task, and reloads the web page.
 */
export const watchForChanges = () => {
    watch(watchPaths.scss, series(styles, reload));
    watch(watchPaths.img, series(images, reload));
    watch(watchPaths.js, series(scripts, reload));
    watch(watchPaths.php, series(php, reload));
    watch(watchPaths.twig, series(twig, reload));
}

/**
 * Prepares images by compressing them.
 */
export const images = () => {
    return src(watchPaths.img)
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(dest(destPaths.img));
}

/**
 * Prepares Javascript files by generating the sourcemaps for it
 * and transpililng everything.
 */
export const scripts = () => {
    return src(watchPaths.js)
    .pipe(sourcemaps.init())
    .pipe(rollup({
        plugins: [babel()]
    }, {
        format:'iife',
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('static/js/compiled'));
}

/** Prepares PHP files by running them through a code sniffer. */
export const php = () => {
    return src(watchPaths.php)
    .pipe(phpcs({
        standard: 'WordPress',
        warningSeverity: 0
    }))
    .pipe(phpcs.reporter('log'))
    .on('error', log)
    .pipe(dest('.'));
}

/**
 * Prepare Twig files by pretty-printing them.
 */
export const twig = () => {
    return src(watchPaths.twig)
    .pipe(prettydiff({
        lang: "twig",
        mode: "beautify"
    }))
    .pipe(dest('templates'))
}

/** The BrowserSync server instance. */
const server = browserSync.create();

/** Serves the content. */
export const serve = done => {
    server.init({
        proxy: 'arkfoundation.test',
        open: 'external',
        files: ['*.php, *.css, **/*.js, **/*.twig']
    });
    cache.clearAll();
    done();
}

/** Reloads the page. */
export const reload = done => {
    cache.clearAll();
    server.reload({stream: true});
    done();
}

/** Removes the compiled files. */
export const clean = () => del(['dist']);

/** The main development task. */
export const dev = series(clean, parallel(styles, images, scripts, php, twig), serve, watchForChanges);

/** The main build task. */
export const build = series(clean, parallel(styles, images, scripts, php, twig));

export default dev;