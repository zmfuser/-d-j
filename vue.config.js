const webpack = require('webpack')
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/webnode/' : '/',
    runtimeCompiler: true,
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
    devServer: {
        proxy: {
            '/party/*': {
                target: 'http://139.9.44.85:8098',
                ws: true,
                changeOrigin: true
            }
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                "window.jQuery": 'jquery'
            })
        ]
    }
}