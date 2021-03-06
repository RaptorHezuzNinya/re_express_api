const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const TenantSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, "can't be blank"],
			match: [/\S+@\S+\.\S+/, 'is invalid'],
			index: true
		},
		accountHolder: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, "can't be blank"]
		},
		firstName: {
			type: String,
			lowercase: true,
			required: [true, "can't be blank"]
		},
		lastName: {
			type: String,
			lowercase: true,
			required: [true, "can't be blank"]
		},
		iban: { type: String, unique: true, required: [true, "can't be blank"] },
		rent: { type: Number },
		phone: { type: Number },
		uuId: { type: String, lowercase: true, unique: true },
		userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		paymentRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }]
	},
	{ timestamps: true }
);

TenantSchema.plugin(uniqueValidator, { message: 'is already taken.' });

TenantSchema.methods.tenantToJSON = function() {
	return {
		_id: this.id,
		email: this.email,
		accountHolder: this.accountHolder,
		firstName: this.firstName,
		lastName: this.lastName,
		iban: this.iban,
		rent: this.rent,
		phone: this.phone,
		uuId: this.uuId,
		userRef: this.userRef,
		updatedAt: this.updatedAt,
		createdAt: this.createdAt
	};
};

module.exports = mongoose.model('Tenant', TenantSchema);
