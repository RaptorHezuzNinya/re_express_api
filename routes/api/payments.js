const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const User = mongoose.model('User');
const Tenant = mongoose.model('Tenant');
const Payment = mongoose.model('Payment');

router.post('/payments/user', auth.required, async (req, res, next) => {
	try {
		const user = await getUser(req.payload.id);
		const payments = await insertPayments(req.body, user);
		res.json(req.body);
	} catch (error) {
		console.error('ERROR! ->', error);
	}
});

const getUser = id => {
	return User.findById(id).then(user => {
		return user;
	});
};

const insertPayments = (payments, user) => {
	const insertedDocs = tenants.map(newTenant => {
		// const tenant = new Tenant();
		// tenant.email = newTenant.email;
		// tenant.accountHolder = newTenant.accountHolder;
		// tenant.firstName = newTenant.firstName;
		// tenant.lastName = newTenant.lastName;
		// tenant.iban = newTenant.iban;
		// tenant.rent = newTenant.rent;
		// tenant.phone = newTenant.phone;
		// tenant.userRef = user._id;
		// tenant.uuId = uid.randomUUID(9);
		// tenant.save();
		// return { ...tenant.tenantToJSON() };
	});
	return insertedDocs;
};

module.exports = router;
