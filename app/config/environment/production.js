'use strict';

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            "0.0.0.0",
    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            3051,
        //     8001,
    seedDB: true,
    // MongoDB connection options
    mongo: {
        //uri: 'mongodb://kantina:kantina@ds151207.mlab.com:51207/kantina'
          uri: 'mongodb://31.154.176.203:27017/cantina'
    }
};