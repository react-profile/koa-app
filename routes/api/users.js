const Router = require('koa-router');
const router = new Router();
const gravatar = require('gravatar');
const tools = require('../../config/tools');
// 引入 User
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('koa-passport')
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
/**
*  @route GET /api/users/test
*  @desc test interface
*  @access Public
*/
router.get('/test', async (ctx) => {
	ctx.status = 200;
	ctx.body = `{mesg: users works ...} `;
});

/**
*  @route POST /api/users/register
*  @desc regiter interface
*  @access Public
*/
router.post('/register', async (ctx) => {
	//console.log('/register ~ctx.request.body: ', ctx.request.body);
	let { errors, isValid } = validateRegisterInput(ctx.request.body);
	if (!isValid) {
		ctx.status = 400;
		ctx.body = errors;
		return;
	}
	let findResult = await User.find({ email: ctx.request.body.email });
	if (findResult.length > 0) {
		ctx.status = 500;
		ctx.body = { email: 'Email was used!' }
	} else {
		let avatar = gravatar.url(ctx.request.body.email, { s: '200', r: 'pg', d: 'mm' });
		//console.log(ctx.request.body);
		const newUser = new User({
			name: ctx.request.body.name,
			email: ctx.request.body.email,
			avatar,
			password: tools.enbcrypt(ctx.request.body.password),
		});

		await newUser.save().then(user => {
			ctx.body = user;
		})
			.catch(err => console.log(err));
		ctx.body = newUser;
	}
});

router.post('/login', async (ctx) => {
	let { errors, isValid } = validateLoginInput(ctx.request.body);
	if (!isValid) {
		ctx.status = 400;
		ctx.body = errors;
		return;
	}
	let findResult = await User.find({ email: ctx.request.body.email });
	if (findResult.length === 0) {
		ctx.status = 400;
		ctx.body = { email: 'User does not exist!' };
	} else {
		let user = findResult[0];
		let password = ctx.request.body.password;
		let res = await bcrypt.compareSync(password, user.password);
		if (res) {
			// token
			let payload = { id: user.id, name: user.name, avatar: user.avatar };
			let token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 60 * 60 });
			ctx.status = 200;
			ctx.body = { message: 'success!', token: 'Bearer ' + token };
		} else {
			ctx.status = 400;
			ctx.body = { message: 'password is not correct!' };
		}
	}
});

/**
*  @route GET /api/users/current
*  @desc user infor validation
*  @access Private
*/
router.get('/all', passport.authenticate('jwt', { session: false }), async ctx => {
	const users = await User.find({});
	if (users.length > 0) {
		ctx.body = users;
	} else {
		ctx.body = { message: 'There is no users!' };
	}
});

/**
*  @route GET /api/users/all
*  @desc user infor validation
*  @access Private
*/
router.get('/current', passport.authenticate('jwt', { session: false }), async ctx => {
	ctx.body = {
		id: ctx.state.user.id,
		name: ctx.state.user.name,
		email: ctx.state.user.email,
		avatar: ctx.state.user.avatar
	}
});
module.exports = router.routes();