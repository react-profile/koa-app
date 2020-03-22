const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport');
// 引入 proile
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');
/**
*  @route GET /api/profile/test
*  @desc test interface
*  @access Public
*/
router.get('/test', async (ctx) => {
	ctx.status = 200;
	ctx.body = `{mesg: users works ...} `;
});

/**
*  @route GET /api/profile
*  @desc profile validation
*  @access Private
*/
router.get('/', passport.authenticate('jwt', { session: false }), async ctx => {
	// console.log(ctx.state.user);
	const profile = await Profile.find({ user: ctx.state.user.id }).populate("users", ['name', 'avatar']);
	// console.log(profile);
	if (profile.length > 0) {
		ctx.status = 200;
		ctx.body = profile;
	} else {
		ctx.status = 404;
		ctx.body = { noprofile: 'There is no profile for this user!' };
		return;
	}
});


/**
*  @route POST /api/profile
*  @desc profile add update
*  @access Private
*/
router.post('/', passport.authenticate('jwt', { session: false }), async ctx => {
	// console.log(ctx.state.user);
	let { errors, isValid } = validateProfileInput(ctx.request.body);
	if (!isValid) {
		ctx.status = 400;
		ctx.body = errors;
		return;
	}
	let profileFields = {};
	profileFields.user = ctx.state.user.id;
	if (ctx.request.body.handle) profileFields.handle = ctx.request.body.handle;
	if (ctx.request.body.company) profileFields.company = ctx.request.body.company;
	if (ctx.request.body.website) profileFields.website = ctx.request.body.website;
	if (ctx.request.body.location) profileFields.location = ctx.request.body.location;
	if (ctx.request.body.status) profileFields.status = ctx.request.body.status;
	// skills
	if (typeof ctx.request.body.skills !== 'undefined') {
		profileFields.skills = ctx.request.body.skills.split(',');
	}
	if (ctx.request.body.bio) profileFields.bio = ctx.request.body.bio;
	if (ctx.request.body.githubusername) profileFields.githubusername = ctx.request.body.githubusername;
	profileFields.social = {};
	if (ctx.request.body.wechat) profileFields.social.wechat = ctx.request.body.wechat;
	if (ctx.request.body.QQ) profileFields.social.QQ = ctx.request.body.QQ;
	if (ctx.request.body.tengxunkt) profileFields.social.tengxunkt = ctx.request.body.tengxunkt;
	if (ctx.request.body.wangyiyunkt) profileFields.social.wangyiyunkt = ctx.request.body.wangyiyunkt;


	const profile = await Profile.find({ user: ctx.state.user.id });
	console.log(profile);
	if (profile.length > 0) {
		// update
		const profileUpdate = await Profile.findOneAndUpdate({ user: ctx.state.user.id }, { $set: profileFields }, { new: true });
		ctx.body = profileUpdate;
	} else {
		// insert
		await new Profile(profileFields).save().then(profile => {
			ctx.status = 200;
			ctx.body = profile;
		})
			.catch(err => console.log(err));
	}
});

/**
*  @route GET /api/profile/handle?handle=xxx
*  @desc get profile by handle
*  @access Public
*/
router.get('/handle', async (ctx) => {
	const errors = {};
	const handle = ctx.query.handle;
	const profile = await Profile.find({ handle: handle }).populate("users", ['name', 'avatar']);
	if (profile.length === 0) {
		ctx.status = 404;
		errors.noprofile = 'There is not profile for the user.';
		ctx.body = errors;
	} else {
		ctx.body = profile;
	}
});

/**
*  @route GET /api/profile/user?user_id=xxx
*  @desc get profile by user id
*  @access Public
*/
router.get('/user', async (ctx) => {
	const errors = {};
	const user_id = ctx.query.user_id;
	const profile = await Profile.find({ user: user_id }).populate("users", ['name', 'avatar']);
	if (profile.length === 0) {
		ctx.status = 404;
		errors.noprofile = 'There is not profile for the user.';
		ctx.body = errors;
	} else {
		ctx.body = profile;
	}
});

/**
*  @route GET /api/profile/user?user_id=xxx
*  @desc get profile by user id
*  @access Public
*/
router.get('/user', async (ctx) => {
	const errors = {};
	const user_id = ctx.query.user_id;
	const profile = await Profile.find({ user: user_id }).populate("users", ['name', 'avatar']);
	if (profile.length === 0) {
		ctx.status = 404;
		errors.noprofile = 'There is not profile for the user.';
		ctx.body = errors;
	} else {
		ctx.body = profile;
	}
});

/**
*  @route GET /api/profile/all
*  @desc get all profiles
*  @access Public
*/
router.get('/all', async (ctx) => {
	const errors = {};
	const profiles = await Profile.find({}).populate("users", ['name', 'avatar']);
	if (profiles.length === 0) {
		ctx.status = 404;
		errors.noprofile = 'There is not profile for the user.';
		ctx.body = errors;
	} else {
		ctx.body = profiles;
	}
});

/**
*  @route POST /api/profile/experence
*  @desc profile add &experence
*  @access Private
*/
router.post('/experence', passport.authenticate('jwt', { session: false }), async ctx => {
	//console.log(ctx.state.user);
	let { errors, isValid } = validateExperienceInput(ctx.request.body);
	if (!isValid) {
		ctx.status = 400;
		ctx.body = errors;
		return;
	}
	const profileFields = {};
	profileFields.experence = [];
	profileFields.user = ctx.state.user.id;
	const profile = await Profile.find({ user: ctx.state.user.id });
	//console.log(profile);
	if (profile.length > 0) {
		// add experience
		const newExp = {
			current: ctx.request.body.current,
			title: ctx.request.body.title,
			company: ctx.request.body.company,
			location: ctx.request.body.location,
			from: ctx.request.body.from,
			to: ctx.request.body.to,
			description: ctx.request.body.description
		};
		profileFields.experence.unshift(newExp);
		const profileUpdate = await Profile.update({ user: ctx.state.user.id }, { $push: { experence: profileFields.experence } }, { $sort: 1 });

		if (profileUpdate.ok === 1) {
			const profile = await Profile.find({ user: ctx.state.user.id });
			ctx.body = profile;
		}
	} else {
		ctx.status = 404;
		errors.noprofile = 'There is not profile for the user.';
		ctx.body = errors;
	}
});
/**
*  @route POST /api/profile/education
*  @desc profile add education
*  @access Private
*/
router.post('/education', passport.authenticate('jwt', { session: false }), async ctx => {
	//console.log(ctx.state.user);
	let { errors, isValid } = validateEducationInput(ctx.request.body);
	if (!isValid) {
		ctx.status = 400;
		ctx.body = errors;
		return;
	}
	const profileFields = {};
	profileFields.education = [];
	profileFields.user = ctx.state.user.id;
	const profile = await Profile.find({ user: ctx.state.user.id });
	//console.log(profile);
	if (profile.length > 0) {
		// add experience
		const newEdu = {
			current: ctx.request.body.current,
			school: ctx.request.body.school,
			degree: ctx.request.body.degree,
			fieldofstudy: ctx.request.body.fieldofstudy,
			from: ctx.request.body.from,
			to: ctx.request.body.to,
			description: ctx.request.body.description
		};
		profileFields.education.unshift(newEdu);
		const profileUpdate = await Profile.update({ user: ctx.state.user.id }, { $push: { education: profileFields.education } }, { $sort: 1 });
		if (profileUpdate.ok === 1) {
			const profile = await Profile.find({ user: ctx.state.user.id });
			ctx.body = profile;
		}
	} else {
		ctx.status = 404;
		errors.noprofile = 'There is not profile for the user.';
		ctx.body = errors;
	}
});


/**
*  @route DELETE /api/profile/education?edu_id=xxx
*  @desc profile delete education
*  @access Private
*/
router.delete('/education', passport.authenticate('jwt', { session: false }), async ctx => {
	//console.log(ctx.state.user);
	let errors = {};
	const edu_id = ctx.query.edu_id;
	const profile = await Profile.find({ user: ctx.state.user.id });
	console.log(edu_id);
	if (profile[0].education.length > 0) {
		// delete experience
		//console.log(profile[0].education);
		const removeIndex = profile[0].education.findIndex(item => item.id === edu_id);
		console.log(removeIndex);
		if (removeIndex > -1) {
			profile[0].education.splice(removeIndex, 1);
			const profileUpdate = await Profile.findOneAndUpdate({ user: ctx.state.user.id }, { $set: profile[0] }, { new: true });
			ctx.body = profileUpdate;
		} else {
			ctx.status = 404;
			errors.noprofile = 'There is not education id.';
			ctx.body = errors;
		}
	} else {
		ctx.status = 404;
		errors.noprofile = 'There is not education to delete.';
		ctx.body = errors;
	}
});

/**
*  @route DELETE /api/profile/experence?exp_id=xxx
*  @desc profile delete experence
*  @access Private
*/
router.delete('/experence', passport.authenticate('jwt', { session: false }), async ctx => {
	//console.log(ctx.state.user);
	let errors = {};
	const exp_id = ctx.query.exp_id;
	const profile = await Profile.find({ user: ctx.state.user.id });
	// console.log(profile);
	if (profile[0].experence.length > 0) {
		// delete experience
		const removeIndex = profile[0].experence.findIndex(item => item.id === exp_id);
		//console.log(removeIndex);
		//console.log(profile[0].experence);
		if (removeIndex > -1) {
			profile[0].experence.splice(removeIndex, 1);
			//console.log(profile[0].experence);
			const profileUpdate = await Profile.findOneAndUpdate({ user: ctx.state.user.id }, { $set: profile[0] }, { new: true });
			ctx.body = profileUpdate;
		} else {
			ctx.status = 404;
			errors.noprofile = 'There is not experence id.';
			ctx.body = errors;
		}
	} else {
		ctx.status = 404;
		errors.noprofile = 'There is not experence to delete.';
		ctx.body = errors;
	}
});

/**
*  @route DELETE /api/profile
*  @desc profile delete profile
*  @access Private
*/
router.delete('/', passport.authenticate('jwt', { session: false }), async ctx => {
	//console.log(ctx.state.user);
	let errors = {};
	const exp_id = ctx.query.exp_id;
	const profile = await Profile.deleteOne({ user: ctx.state.user.id });

	if (profile.ok === 1) {
		const user = await User.deleteOne({ _id: ctx.state.user.id });
		if (user.ok === 1) {
			ctx.status = 200;
			ctx.body = { success: true };
		}
	} else {
		ctx.status = 404;
		errors.noprofile = 'There is no profile to delete.';
		ctx.body = errors;
	}
});
module.exports = router.routes();
