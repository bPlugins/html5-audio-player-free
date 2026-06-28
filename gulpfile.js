const gulp = require("gulp");
const zip = require("gulp-zip");
const browserSync = require("browser-sync").create();
const fs = require("fs");


function bundle() {
  if (fs.existsSync("bundled")) {
    fs.rmSync("bundled", { recursive: true, force: true });
  }

  return gulp
    .src([
      "**/*",
      "!node_modules/**",
      "!src/**",
      "!zip/**",
      "!composer.lock",
      "!bundled/**",
      "!gulpfile.js",
      "!package.json",
      "!package-lock.json",
      "!tailwind.config.js",
      "!webpack.config.js",
      "!.gitignore",
      "!**/*.map",
      "!.eslintrc.js",
      "!pnpm-lock.yaml",
      "!readme.md",
      "!todo.txt",
    ])
    .pipe(gulp.dest("bundled/html5-audio-player"));
}

exports.bundle = bundle;

exports.zip = () => {
  return (
    gulp
      .src(["bundled/**"])
      .pipe(zip("html5-audio-player.zip"))
      .pipe(gulp.dest("zip"))
  );
};


function serve() {
  browserSync.init({
    proxy: "http://free-plugins-dev.local", // replace with your local site URL
    files: [
      "**/*.php",
      "**/*.css",
      "**/*.js"
    ],
    open: false,   // prevents auto-opening browser
    notify: false  // disables browser notifications
  });

  // Watch all files in the folder
  gulp.watch("src/**/*.*").on("change", browserSync.reload);
}

exports.serve = serve;