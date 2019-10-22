const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const User = mongoose.model('User');
const Tenant = mongoose.model('Tenant');
const Payment = mongoose.model('Payment');

router.post('/payments', auth.required, (req, res, next) => {
	User.findById(req.payload.id) // query return promise
		.then(user => {
			for (let index = 0; index < req.body.length; index++) {
				const payment = req.body[index];
				Tenant.findOne({ iban: payment.iban }).then(tenant => {
					const newPayment = new Payment();
					newPayment.name = payment.name;
					newPayment.iban = payment.iban;
					newPayment.date = payment.date;
					newPayment.credited = payment.credited === 'Bij' ? true : false;
					newPayment.amount = payment.amount;
					newPayment.memo = payment.memo;
					newPayment.userRef = user._id;
					newPayment.tenantRef = tenant._id;
					newPayment.save();
				});
			}
		})
		.then(() => {
			User.findById(req.payload.id).then(user => {
				Payment.find({ userRef: user._id }).then(payments => {
					return res.json(payments);
				});
			});
		})
		.catch(next);
});

module.exports = router;
