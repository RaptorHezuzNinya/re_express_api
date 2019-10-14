var mongoose = require('mongoose');
var router = require('express').Router();
var Tenant = mongoose.model('Tenant');
var User = mongoose.model('User');
var auth = require('../auth');

var ShortUniqueId = require('short-unique-id');
var uid = new ShortUniqueId();

// should be somethingl ike get articles comments
// router.get('/tenants', auth.required, function (req, res, next) {
//     User.findById(req.payload.id).then(function (user) {
//         ObjectId("4ecc05e55dd98a436ddcc47c"
//     });
// });

// router.get('/tenants', auth.required, function (req, res, next) {
//     Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function (user) {
//         return req.article.populate({
//             path: 'comments',
//             populate: {
//                 path: 'author'
//             },
//             options: {
//                 sort: {
//                     createdAt: 'desc'
//                 }
//             }
//         }).execPopulate().then(function (article) {
//             return res.json({
//                 comments: req.article.comments.map(function (comment) {
//                     return comment.toJSONFor(user);
//                 })
//             });
//         });
//     }).catch(next);
// });

router.post('/tenants', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        var tenant = new Tenant();

        tenant.email = req.body.tenant.email;
        tenant.accountHolder = req.body.tenant.accountHolder;
        tenant.firstName = req.body.tenant.firstName;
        tenant.lastName = req.body.tenant.lastName;
        tenant.iban = req.body.tenant.iban;
        tenant.rent = req.body.tenant.rent;
        tenant.phone = req.body.tenant.phone;
        tenant.userId = user;
        tenant.uuId = uid.randomUUID(9);
        tenant.save().then(function () {
            return res.json({ tenant: tenant.tenantToJSON() });
        }).catch(next);
    })

});


module.exports = router;
