'use strict'
const p = require('path')
const ext = ['.zip', '.bz2', '.gz', '.tar']

function Router(router, job, utils, config) {

  router.get('/', utils.prepareTree, function(req, res, next) {
    if(!~ext.indexOf(p.extname(req.options.path)))
      return res.handle('back', {error: `${req.options.path} is not one of ${ext.join(', ')}`}) 

    job.call('decompress', req.user, [req.options.path])

    return res.handle('back', {info: 'Decompression launched'}, 201) 
  })

  router.post('/action/decompress', function(req, res, next) {

    let paths = req.options.files.filter(f => ~ext.indexOf(p.extname(f)))

    if(paths.length === 0)
      return res.handle('back', {error: `None of the files provided is an archive`}) 

    job.call('decompress', req.user, req.options.files)

    return res.handle('back', {info: 'Decompression launched'}, 201) 
  })

  return router
}

module.exports = Router
