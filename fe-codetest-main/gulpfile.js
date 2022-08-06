// Define our constants.

const gulp = require("gulp");
const babel = require("gulp-babel");
const plumber = require('gulp-plumber');
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require('sass'));
const uglify = require("gulp-uglify-es").default;
const imagemin = require('gulp-imagemin');
const notifier = require("node-notifier");
const browserSync = require("browser-sync").create();


/**
 * Run our styles through SASS, autoprefixer, cleanCSS
 * and then output them to the "assets" folder.
 */
function styles() {

  return gulp.src([
      "src/scss/main.scss"
  ])
  .pipe(plumber({
      errorHandler: function (err) {
          console.log(err);
          this.emit('end');
      }
  }))
  .pipe(
    sass({
      outputStyle: 'compressed'
    })
  )
  .pipe(
    gulp.dest("www/assets/css")
  )
  .pipe(
    browserSync.reload({stream:true})
  )
  .pipe(
    plumber.stop()
  );
}

/**
 * Run our scripts through Babel & uglify
 * and then output them to the "assets" folder.
 */
function scripts() {
    console.log("scripts");
  return gulp.src("src/js/main.js")
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .on("error", swallowError)

    // Minify it.
    .pipe(uglify())
    .on("error", swallowError)

    // Suffix our fil with ".min".
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .on("error", swallowError)

    // Output the JS to the "assets" folder.
    .pipe(gulp.dest("www/assets/js"))

    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

/**
 * Compress images
 */
 function images() {
  return gulp
    .src("src/images/*")

    // minify images
    .pipe(
      imagemin()
    )
    .on("error", swallowError)

    // Save images in assets
    .pipe(
      gulp.dest('www/assets/images')
    )
    .on("error", swallowError)

    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}


/**
 * Setup BrowserSync.
 */
function bsync() {
  console.log("BSYNC loaded");

  browserSync.init({
    watch: false,
    reloadDelay: 100,
    server: "./www"
  });
}

/**
 * Setup file watching.
 */
function watch() {
  // Run the "styles" task whenever we see any ".scss" files update.
  gulp.watch("src/scss/**/*.scss", styles);

  // Run the "scripts" task whenever we see any ".js" files update.
  gulp.watch("src/js/**/*.js", scripts);

  // Run the "images" task whenever we see a change in any file in the images directory
  gulp.watch("src/images/**/*", images);

}

/**
 * Reload the page with BrowserSync.
 */
function reload(done) {
  browserSync.reload();

  if (done) {
    done();
  }
}

/**
 * Prevent errors from causing NPM to quit,
 * instead notify us with the error.
 */
function swallowError(error) {
  notifier.notify({
    title: "Error:",
    message: error.toString(),
  });

  console.error(error.toString());

  this.emit("end");
}

// Export our gulp functions.

exports.styles = styles;
exports.scripts = scripts;
exports.bsync = bsync;
exports.watch = watch;
exports.reload = reload;

const serve = gulp.series(styles, scripts, images, bsync)

const def = gulp.parallel(serve, watch);

exports.default = def;
