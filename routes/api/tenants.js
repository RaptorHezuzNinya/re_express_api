var mongoose = require('mongoose');
var router = require('express').Router();
var Tenant = mongoose.model('Tenant');
var User = mongoose.model('User');
var auth = require('../auth');

var ShortUniqueId = require('short-unique-id');
var uid = new ShortUniqueId();

// get tenants by user ref
router.get('/tenants/:userRef', function(req, res, next) {
	Tenant.find({ userRef: req.params.userRef })
		.then(function(tenants) {
			return res.json({ tenants: tenants });
		})
		.catch(next);
});

router.post('/tenant', auth.required, function(req, res, next) {
	User.findById(req.payload.id).then(function(user) {
		var tenant = new Tenant();

		tenant.email = req.body.tenant.email;
		tenant.accountHolder = req.body.tenant.accountHolder;
		tenant.firstName = req.body.tenant.firstName;
		tenant.lastName = req.body.tenant.lastName;
		tenant.iban = req.body.tenant.iban;
		tenant.rent = req.body.tenant.rent;
		tenant.phone = req.body.tenant.phone;
		tenant.userRef = user._id;
		tenant.uuId = uid.randomUUID(9);
		tenant
			.save()
			.then(function() {
				user.setTenantRef(tenant);
				user.save().then(function() {
					return res.json({ tenant: tenant.tenantToJSON() });
				});
			})
			.catch(next);
	});
});

router.post('/tenants', auth.required, (req, res, next) => {
	Promise.all([User.findById(req.payload.id)])
		.then(results => {
			const user = results[0];
			const createdDocuments = [];
			for (let index = 0; index < req.body.length; index++) {
				const newTenant = req.body[index];

				const tenant = new Tenant();

				tenant.email = newTenant.email;
				tenant.accountHolder = newTenant.accountHolder;
				tenant.firstName = newTenant.firstName;
				tenant.lastName = newTenant.lastName;
				tenant.iban = newTenant.iban;
				tenant.rent = newTenant.rent;
				tenant.phone = newTenant.phone;
				tenant.userRef = user._id;
				tenant.uuId = uid.randomUUID(9);
				tenant.save().then(() => {
					createdDocuments.push({ ...tenant.tenantToJSON() });
				});
			}
			return res.sendStatus(200).res.json({ tenants: createdDocuments });
		})
		.catch(next);
});

module.exports = router;
