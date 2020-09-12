const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const htmlmin = require("gulp-htmlmin");
const csso = require("gulp-csso");
const webp = require("gulp-webp");
const sync = require("browser-sync").create();

// less to build css
const styles = () => {
  return gulp
    .src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};
exports.styles = styles;

// html min
const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(plumber())
    .pipe(htmlmin())
    .pipe(gulp.dest("build/"))
    .pipe(sync.stream());
};
exports.html = html;

//build folder del
const del = require("del");
const clean = () => {
  return del("build");
};
exports.clean = clean;

// copy files
const copy = () => {
  return gulp
    .src(
      [
        "source/fonts/**/*.{woff,woff2}",
        "source/img/**",
        "source/js/**",
        "source/*.ico",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
};
exports.copy = copy;

// svg sprites
const sprite = () => {
  return gulp
    .src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};
exports.sprite = sprite;

//creat webp
const createWebp = () => {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("source/img"));
};
exports.webp = createWebp;

// build
const build = gulp.series(clean, copy, styles, html, sprite);
exports.build = build;

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Watcher
const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series("html"));
  gulp.watch("source/img/**", gulp.series("copy"));

  gulp.watch("source/less/**/*.less").on("change", sync.reload);
  gulp.watch("source/*.html").on("change", sync.reload);
  gulp.watch("source/img/**").on("all", sync.reload);
};

exports.default = gulp.series(build, server, watcher);
