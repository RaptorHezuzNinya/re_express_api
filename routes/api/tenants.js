const asyncMiddleware = require('../middleware/async.mw.js');
const mongoose = require('mongoose');
const router = require('express').Router();
const Tenant = mongoose.model('Tenant');
const User = mongoose.model('User');
const auth = require('../auth');

const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();

// get tenants by user ref
router.get('/tenants', auth.required, function(req, res, next) {
	Tenant.find({ userRef: req.payload.id })
		.then(function(tenants) {
			return res.json({ tenants: tenants });
		})
		.catch(next);
});

router.post('/tenant', auth.required, function(req, res, next) {
	User.findById(req.payload.id).then(function(user) {
		const tenant = new Tenant();

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
				// user.setTenantRef(tenant);
				user.save().then(function() {
					return res.json({ tenant: tenant.tenantToJSON() });
				});
			})
			.catch(next);
	});
});

router.post('/tenants', auth.required, async (req, res, next) => {
	try {
		const user = await getUser(req.payload.id);
		const tenants = await insertTenants(req.body, user);

		res.json(tenants);
	} catch (error) {
		console.error('ERROR! -> ', error);
		req.json(error);
	}
});

const getUser = id => {
	return User.findById(id).then(user => {
		return user;
	});
};

const insertTenants = (tenants, user) => {
	const insertedDocs = tenants.map(newTenant => {
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
		tenant.save();
		return { ...tenant.tenantToJSON() };
	});
	return insertedDocs;
};

module.exports = router;
