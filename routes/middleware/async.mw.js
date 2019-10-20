// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
// useage
// router.post(
// 	'/tenants',
// 	auth.required,
// 	asyncMiddleware(async (req, res, next) => {
// 		const user = await getUser(req.payload.id);
// 		const tenants = await insertTenants(req.body, user);

// 		res.json(tenants);
// 	})
// );

const asyncMiddleware = fn => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncMiddleware;
