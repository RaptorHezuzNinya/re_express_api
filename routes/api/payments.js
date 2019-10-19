var mongoose = require('mongoose');
var router = require('express').Router();
var auth = require('../auth');
var Tenant = mongoose.model('Tenant');
var User = mongoose.model('User');
var User = mongoose.model('Payment');

// get tenants by user ref
router.post('/payments/user', function (req, res, next) {
    return console.log(req.body);
    User.findById(req.body.id).then(function (user) {
        var payment = new Payment();



        tenant.userRef = user._id;
        tenant.uuId = uid.randomUUID(9);
        tenant.save().then(function () {
            user.setTenantRef(tenant);
            user.save().then(function () {
                return res.json({ tenant: tenant.tenantToJSON() });
            })
        }).catch(next);
    }).catch(next);

});

module.exports = router;


