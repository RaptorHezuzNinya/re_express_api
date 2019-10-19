var mongoose = require('mongoose');
var router = require('express').Router();
var auth = require('../auth');
var Tenant = mongoose.model('Tenant');
var User = mongoose.model('User');
var Payment = mongoose.model('Payment');

var BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var bs64 = require('base-x')(BASE64);

// get tenants by user ref
router.post('/payments/user', function (req, res, next) {
    const x = "ward";
    return console.log(x);
    var solution = req.body.file.fileData.split("base64,")[1];
    var decoded = bs64.decode(solution);
    return console.log(decoded);

    // User.findById(req.body.id).then(function (user) {
    //     var payment = new Payment();
    //     tenant.userRef = user._id;
    //     tenant.uuId = uid.randomUUID(9);
    //     tenant.save().then(function () {
    //         user.setTenantRef(tenant);
    //         user.save().then(function () {
    //             return res.json({ tenant: tenant.tenantToJSON() });
    //         })
    //     }).catch(next);
    // }).catch(next);

});

module.exports = router;


