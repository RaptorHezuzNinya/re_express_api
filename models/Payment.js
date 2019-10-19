var mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator');

var PaymentSchema = new mongoose.Schema({
	name: { type: String, required: [true, "can't be blank"] },
	iban: { type: String, required: [true, "can't be blank"] },
	date: { type: String, required: [true, "can't be blank"] },
	credited: { type: Boolean, required: [true, "can't be blank"] },
	amount: { type: Number, required: [true, "can't be blank"] },
	memo: { type: String },
	userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	tenantRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' }
}, { timestamps: true });

PaymentSchema.methods.paymentToJSON = function () {
	return {
		_id: this.id,
		name: this.name,
		iban: this.iban,
		date: this.date,
		credited: this.credited,
		amount: this.amount,
		memo: this.memo,

		userRef: this.userRef,
		tenantRef: this.tenantRef,

		updatedAt: this.updatedAt,
		createdAt: this.createdAt
	};
};


mongoose.model('Payment', PaymentSchema);
