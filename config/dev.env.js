'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"'
// })
// dev.env.js
module.exports = {
    NODE_ENV: '"development"',
    // BASE_API: '"http://192.168.3.181/cms"'
    BASE_API: '"https://demo.magicreal.net/cms"' 
}
