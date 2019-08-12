//console.log(process.env);

//'use strict';
//
//// Test Password 
//var crypto = require('crypto');
//
//var salt = crypto.randomBytes(16).toString('base64');
//var pwd = crypto.pbkdf2Sync("alpha123", salt, 10000, 64).toString('base64');
//console.log("Salt : " + salt);
//console.log("Password : " + pwd);


/*
 * Salt : 65B8uciUHNU/STeJ77b/jw==
 Password : OvBiKSAdhj7J17Xv4QTY1nD/pmmGO4YDxfm71qELcrzVTV0rgXm0OcExT4fArrKF93gYcf+oDvDFdhR4rhYeBA==
 (node:9084) DeprecationWarning: crypto.pbkdf2 without specifying a digest is dep
 * 
 */


// var regex = new RegExp("^http(s)?:\/\/(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$", 'im');
// console.log(regex.test('https://dl.dropboxusercontent.com/s/cphuufkz9y4zoyj/107_front.jpg?dl=0'));
// if (regex.test('https://dl.dropboxusercontent.com/s/cphuufkz9y4zoyj/107_front.jpg?dl=0') === true) {
//     console.log("1 - Valid");
// } else {
//     console.log("1 - InValid");
// }

// if (regex.test('https://dl.dropboxusercontent.com/s/cphuufkz9y4zoyj/107_front.jpg?dl=0')) {
//     console.log("2 - Valid");
// } else {
//     console.log("2 - InValid");
// }



//
//var format = require('string-format');
//
//var poformat = "{num}/{yyyy}-{+yy}/{+yyyy}-{yyyy}";
//var json = {
//    num: 10
//};
//var dt = new Date();
//if (dt.getMonth() <= 3) {
//    json.yyyy = parseInt(dt.getFullYear()) - 1;
//    json['+yy'] = dt.getYear() - 100;
////    json['yy'] = dt.getYear() - 100 - 1;
////    json['+yyyy'] = dt.getFullYear() - 100;
//} else {
//    json.yyyy = dt.getFullYear();
//    json['+yy'] = dt.getYear() + 1 - 100;
////    json['yy'] = dt.getYear() - 100;
////    json['+yyyy'] = dt.getFullYear() + 1;
//}
//console.log(dt.getYear());
//var ptr = format(poformat, json);
//console.log(ptr);
//
//function pad(num, size) {
//    var s = num + "";
//    while (s.length < size)
//        s = "0" + s;
//    return s;
//}
//
//
//console.log(pad(100, 4));



