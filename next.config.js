const webpack = require('webpack')

module.exports = {
    webpack: (config, { dev }) => {
        config.plugins.push(
            new webpack.ProvidePlugin({
                '$': 'jquery',
                'jQuery': 'jquery',
            })
        )
        return config
    },
    env: {
        AIR_TABLE_API_KEY: process.env.AIR_TABLE_API_KEY,
        AIR_TABLE_BASE_ID_STATION: process.env.AIR_TABLE_BASE_ID_STATION,
        AIR_TABLE_API_KEY_STATION: process.env.AIR_TABLE_API_KEY_STATION,
        AIR_TABLE_BASE_ID_FEED: process.env.AIR_TABLE_BASE_ID_FEED,
        AIR_TABLE_API_KEY_FEED: process.env.AIR_TABLE_API_KEY_FEED,
        AIR_TABLE_BASE_ID_USER: process.env.AIR_TABLE_BASE_ID_USER,
        AIR_TABLE_BASE_ID_SOPERATION: process.env.AIR_TABLE_BASE_ID_SOPERATION,
        
    }
}