const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const User = mongoose.model('User');
const Tenant = mongoose.model('Tenant');
const Payment = mongoose.model('Payment');

router.post('/payments/user', auth.required, async (req, res, next) => {
	try {
		const user = await getUser(req.payload.id);
		await insertPayments(req.body, user);
		// so far works
		let holder;
		Promise.resolve(user ? Payment.find({ userRef: user._id }) : null)
			.then(payments => {
				const payload = payments.map(payment => {
					return { ...payment.paymentToJSON() };
				});
				return res.json(payload);
			})
			.catch(next);
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
	payments.forEach(payment => {
		Tenant.findOne({ iban: payment.iban }).then(tenant => {
			const newPayment = new Payment();

			newPayment.name = payment.name;
			newPayment.iban = payment.iban;
			newPayment.date = payment.date;
			newPayment.credited = payment.credited;
			newPayment.amount = payment.amount;
			newPayment.memo = payment.memo;
			newPayment.userRef = user._id;
			newPayment.tenantRef = tenant._id;
			newPayment.save((err, newPayment) => {
				// console.log(newPayment);
				if (err) {
					console.log(err);
				}
			});
		});
	});
};

module.exports = router;

// const insertedDocs = payments.map(payment => {
// 	Tenant.findOne({ iban: payment.iban }).then(tenant => {
// 		const newPayment = new Payment();

// 		newPayment.name = payment.name;
// 		newPayment.iban = payment.iban;
// 		newPayment.date = payment.date;
// 		newPayment.credited = payment.credited;
// 		newPayment.amount = payment.amount;
// 		newPayment.memo = payment.memo;
// 		newPayment.userRef = user._id;
// 		newPayment.tenantRef = tenant._id;
// 		newPayment.save();
// 		return { ...newPayment.paymentToJSON() };
// 	});
// });
// return insertedDocs;
