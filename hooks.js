'use strict'
const p = require('path')
const ext = ['.zip', '.bz2', '.gz', '.tar']

/**
 * registerHooks
 * @see Plugins
 * @return string
 */
function registerHooks(config, user, utils) {
  return {
    element: function(element) {
      if(!~ext.indexOf(element.ext))
        return ''

      return '<a href="/p/decompress/?path='+element.path+'" title="Decompress"><i class="icon-upload"></i></a>' 
    },
    action: function(tree) {
      let l = tree.length
      let found = false

      while(l-- && !found) {
        let e = tree[l]

        if(!e) 
          continue; 

        if(~ext.indexOf(e.ext))
          found = true
      }

      if(found === false)
        return '' 
      
      return '<option value="decompress.decompress">Decompress</option>'
    }
  }
}

module.exports = registerHooks
