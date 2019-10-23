var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, "can't be blank"],
			match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
			index: true
		},
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, "can't be blank"],
			match: [/\S+@\S+\.\S+/, 'is invalid'],
			index: true
		},
		hash: String,
		salt: String,
		tokens: [
			{
				token: {
					type: String,
					required: true
				}
			}
		],
		createdAt: {
			type: Date,
			default: Date.now
		}
	},
	{ timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
	return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.setToken = async function(token) {
	if (this.tokens.length === 10) {
		this.tokens.pop();
		this.tokens = this.tokens.concat({ token });

		return await this.save();
	}
	this.tokens = this.tokens.concat({ token });
	await this.save();
};

UserSchema.methods.generateJWT = function() {
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 60);
	var token = jwt.sign(
		{ id: this._id, email: this.email, uuId: this.uuId, exp: parseInt(exp.getTime() / 1000) },
		secret
	);
	return token;
};

UserSchema.methods.toAuthJSON = function() {
	return {
		username: this.username,
		email: this.email,
		token: this.generateJWT(),
		id: this._id
	};
};

UserSchema.methods.toProfileJSONFor = function(user) {
	return {
		username: this.username
		// bio: this.bio,
		// image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
		// following: user ? user.isFollowing(this._id) : false
	};
};

UserSchema.methods.favorite = function(id) {
	if (this.favorites.indexOf(id) === -1) {
		this.favorites.push(id);
	}

	return this.save();
};

UserSchema.methods.unfavorite = function(id) {
	this.favorites.remove(id);
	return this.save();
};

UserSchema.methods.isFavorite = function(id) {
	return this.favorites.some(function(favoriteId) {
		return favoriteId.toString() === id.toString();
	});
};

UserSchema.methods.follow = function(id) {
	if (this.following.indexOf(id) === -1) {
		this.following.push(id);
	}

	return this.save();
};

UserSchema.methods.unfollow = function(id) {
	this.following.remove(id);
	return this.save();
};

UserSchema.methods.isFollowing = function(id) {
	return this.following.some(function(followId) {
		return followId.toString() === id.toString();
	});
};

export const User = mongoose.model('User', UserSchema);
