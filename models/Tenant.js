var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var TenantSchema = new mongoose.Schema({
	email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
	accountHolder: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"] },
	firstName: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'] },
	lastName: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'] },
	iban: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"] },
	rent: Number,
	phone: { type: Number },
	uuId: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"] },
	userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

TenantSchema.plugin(uniqueValidator, { message: 'is already taken.' });


TenantSchema.methods.tenantToJSON = function () {
	return {
		id: this.id,
		email: this.email,
		accountHolder: this.accountHolder,
		firstName: this.firstName,
		lastName: this.lastName,
		iban: this.iban,
		rent: this.rent,
		phone: this.phone,
		uuId: this.uuId,
		userId: this.userId
	};
};


mongoose.model('Tenant', TenantSchema);
