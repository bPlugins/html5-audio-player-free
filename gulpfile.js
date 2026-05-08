const gulp = require("gulp");
const zip = require("gulp-zip");
const browserSync = require("browser-sync").create();
const fs = require("fs");

const fs_config = require("./fs-config.json");

require("gulp-freemius-deploy")(gulp, {
  developer_id: fs_config.developer_id,
  plugin_id: fs_config.plugin_id,
  public_key: fs_config.public_key,
  secret_key: fs_config.secret_key,
  zip_name: "html5-audio-player.zip",
  zip_path: "zip/",
  add_contributor: false,
});

function bundle() {
  if (fs.existsSync("bundled")) {
    fs.rmSync("bundled", { recursive: true, force: true });
  }

  return gulp
    .src([
      "**/*",
      "!node_modules/**",
      "!node_moduless/**",
      "!src/**",
      "!zip/**",
      "!html_template/**",
      "!composer-lock.json",
      "!composer.json",
      "!composer.lock",
      "!bundled/**",
      "!gulpfile.js",
      "!todo.txt",
      "!package.json",
      "!fs-config.json",
      "!package-lock.json",
      "!tailwind.config.js",
      "!webpack.config.js",
      "!.gitignore",
      "!bplugins_sdk_working/**",
      "!**/*.map",
      "!.eslintrc.js",
      "!pnpm-lock.yaml",
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
    proxy: "http://shamim-bplugins.local", // replace with your local site URL
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