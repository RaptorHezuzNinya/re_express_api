var mongoose = require('mongoose');
var router = require('express').Router();
var Tenant = mongoose.model('Tenant');

var auth = require('../auth');

var ShortUniqueId = require('short-unique-id');
var uid = new ShortUniqueId();





router.post('/tenants', auth.required, function (req, res, next) {

    var tenant = new Tenant();

    tenant.email = req.body.tenant.email;
    tenant.accountHolder = req.body.tenant.accountHolder;
    tenant.firstName = req.body.tenant.firstName;
    tenant.lastName = req.body.tenant.lastName;
    tenant.iban = req.body.tenant.iban;
    tenant.rent = req.body.tenant.rent;
    tenant.phone = req.body.tenant.phone;
    tenant.uuId = uid.randomUUID(9);
    tenant.save().then(function () {
        return res.json({ tenant: tenant.tenantToJSON() });
    }).catch(next);
});


module.exports = router;
