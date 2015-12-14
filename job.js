'use strict'
const gulp = require('gulp')
const decompress = require('gulp-decompress')
const p = require('path')
const Promise = require('bluebird')

function Job() {
  if(!(this instanceof Job)) { return new Job() }
}

Job.prototype.setChannel = function(c) {
  this.channel = c
}

Job.prototype.decompress = function(user, paths) {
  let self = this

  Promise.map(paths, function(path) {
    let dest = p.dirname(path)

    return new Promise(function(resolve, reject) {
      gulp.src(path)
      .pipe(decompress())
      .pipe(gulp.dest(dest))
      .on('end', function() {
        return resolve({path: path, dest: dest})
      })
      .on('error', e => reject(e))
    })
  })
  .then(function(results) {
    let message

    if(results.length === 1)
      message = `${results[0].path} decompressed to ${results[0].dest}`
    else 
      message = `${results.length} files decompressed`

     self.channel.send('decompress:notify', user.username, {
       message: message
     }) 
  })
  .catch(function(error) {
     self.channel.send('decompress:notify', user.username, {
       message: error.message,
       error: true
     }) 
  })
}

module.exports = Job
