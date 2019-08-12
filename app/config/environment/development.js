'use strict';

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
          uri: 'mongodb://192.168.1.106:27017/common'
        //uri: 'mongodb://31.154.176.203:27017/cantina'
    },
    ip: process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            "0.0.0.0",
    // Server port 
    port: process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            9090,
    seedDB: true
};
