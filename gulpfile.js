var gulp = require("gulp");
var uglify = require("gulp-uglify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var sourcemaps = require("gulp-sourcemaps");
var browserify = require("browserify");
var concat = require("gulp-concat");
var babelify = require("babelify");
var minifyCSS = require("gulp-minify-css");
var sass = require("gulp-sass");
const terser = require("gulp-terser");
const { src, dest, watch } = require("gulp");
const { createGulpEsbuild } = require("gulp-esbuild");
var sass = require("gulp-sass")(require("sass"));
var ts = require("gulp-typescript");
const tailwindcss = require("tailwindcss");
const postcss = require("gulp-postcss");
const gulpEsbuild = createGulpEsbuild({ incremental: true });
/**
 *
 * for gulp-sass python2.7 is needed. Ubuntu 20.04/20.10 apt install python
 *
 npm install --save-dev gulp-clean-css sass gulp babelify browserify babel-preset-es2015 gulp-connect vinyl-source-stream vinyl-buffer gulp-uglify gulp-sourcemaps @babel/plugin-proposal-class-properties @babel/preset-env @babel/core @babel/preset-react gulp-concat gulp-minify-css gulp-terser gulp-sass axios @reduxjs/toolkit gulp-esbuild gulp-typescript breakpoint-sass compass-mixins
 npm install react-bootstrap-table2-paginator react-bootstrap-table-next react-bootstrap-table2-toolkit --save --legacy-peer-deps animate.css

 */
gulp.task("apply-prod-environment", function() {
    return (process.env.NODE_ENV = "production");
});



var sass_frontend_project = {
    merge: ["react/tailwind/**/*.*css",],
    in: "public/css",
    as: "tw.css",
    build: "react/tailwind/app.scss",
    watch: "react/tailwind/**/*.*css",
    sourcemap: "map",
    tailwindConfig: "react/tailwind/config.js"
};
// compiling tailwind CSS
gulp.task("tailwind", () => {
    return src(sass_frontend_project.merge)
        .pipe(sass())
        .pipe(concat(sass_frontend_project.as))
        .pipe(postcss([tailwindcss(sass_frontend_project.tailwindConfig), require("autoprefixer")]))
        .pipe(minifyCSS())
        .pipe(gulp.dest(sass_frontend_project.in));
});



gulp.task("buildES", function() {
    return src("./react/src/index.js")
        .pipe(
            gulpEsbuild({
                outfile: "reactCompiled.js",
                bundle: true,
                minify: true,
                target: "esnext",
                loader: { ".js": "jsx", ".ts": "tsx" },
            })
        )
        .pipe(dest("./public/js/"));
});

gulp.task("watch", function() {
    gulp.watch(
        [
            "react/src/**/*.ts",
            "react/src/**/*.tsx",
            "react/src/**/*.js",
            "react/src/**/*.jsx",
        ],
        gulp.series(["buildES"])
    );
    gulp.watch(["react/tailwind/**/*.*css",
        "react/src/**/*.ts",
        "react/src/**/*.tsx",
        "react/src/**/*.js",
        "react/src/**/*.jsx",
    ], gulp.series(["tailwind"]));
});

