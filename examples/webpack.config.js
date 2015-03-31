var webpack = require('webpack')


module.exports =
{ devtool: 'eval'
, entry:
  [ 'webpack-dev-server/client?http://localhost:3373'
  , 'webpack/hot/only-dev-server'
  , './index'
]
, output:
  { path: __dirname
  , filename: 'bundle.js'
  , publicPath: '/'
}
// , resolveLoader:
//   { modulesDirectories: [ 'node_modules' ]
//   }
, resolve:
  { extensions: ['', '.js', '.coffee', '.cjsx']
  }
, module: {
  loaders:
  [ { test: /\.json$/
    , loader: 'json'
    }
  , { test: /\.jsx?$/
    , loaders: ['react-hot', 'babel']
    , include: __dirname
    , exclude: /node_modules/
    }
  , { test: /\.cjsx$/
    , loaders: ['react-hot', 'coffee', 'cjsx']
    }
  , { test: /\.coffee$/
    , loader: 'coffee'
    }
  ]
}
, plugins:
  [ new webpack.NormalModuleReplacementPlugin(/^kronos$/, '../src/index')
  , new webpack.HotModuleReplacementPlugin()
  , new webpack.NoErrorsPlugin()
  ]
}
