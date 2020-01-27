const gulp = require('gulp');
const del = require('del');



const PARCEL_SERVE       = './output/serve/**/*';
const PARCEL_WATCH       = './output/watch/**/*';
const PARCEL_BUILD       = './output/build/**/*';



gulp.task('clear-output:serve', function(){
	return del([ PARCEL_SERVE ], { force: true });
});

gulp.task('clear-output:watch', function(){
	return del([ PARCEL_WATCH ], { force: true });
});

gulp.task('clear-output:build', function(){
	return del([ PARCEL_BUILD ], { force: true });
});
