const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const validatePostInput= require('./../../validation/post');
/**
 * @route Get  /api/posts/test
 * @desc Test interfact
 * @access Public
 */
router.get('/test', async ctx => {
    ctx.status = 200;
    ctx.body = `{message: post interface works...}`;
});
/**
 * @route Post  /api/posts
 * @desc Add a post
 * @access Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), async ctx => {
    //console.log(ctx.state.user);
    const {errors, isValid} = validatePostInput(ctx.request.body);
    if(!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }
    const newPost = new Post({
        text: ctx.request.body.text,
        name: ctx.request.body.name,
        avatar: ctx.request.body.avatar,
        user: ctx.state.user.id
    });
    await newPost.save().then(post => {
        ctx.body = post;
        ctx.status = 200;
    }).catch(err => console.error(err));
    
});
/**
 * @route GET  /api/posts
 * @desc fetch all posts
 * @access Pirvate
 */
router.get('/', passport.authenticate('jwt', { session: false }), async ctx => {
    const posts = await  Post.find({});
    if(posts.length >0) {
        ctx.status = 200;
        ctx.body = posts;
    } else {
        ctx.body = {message: 'There is no post for the user.'};
    }
});
/**
 * @route Post  /api/posts/like?id=xxxxxx
 * @desc like a post
 * @access Private
 */
router.post('/like', passport.authenticate('jwt', { session: false }), async ctx => { 
    const id = ctx.query.id;
    const profile = await Profile.find({user: ctx.state.user.id});
    //console.log(profile);
    if(profile.length > 0) {
        const post = await Post.findById(id);
        console.log(post);
        console.log('ctx.state.user.id: ',ctx.state.user.id);
        if(post) {
            const isLiked = post.likes.filter(item => item.user.toString() === ctx.state.user.id).length >0;
            console.log('isLiked', isLiked);
            if(isLiked) {
                ctx.status = 400;
                ctx.body = {alreadyLiked: 'Current is liked!'};
                return;
            }
            post.likes.unshift({user: ctx.state.user.id});
            const postUpdate = await Post.findByIdAndUpdate({_id: id}, {$set: post}, {new : true});
            ctx.body = postUpdate;
        } else {
            ctx.status = 404;
            ctx.body = {message: 'Post not found'};
        }
    } else {
        ctx.status = 400;
        ctx.body = {message: 'There is no profile'};
    }
    
});

/**
 * @route GET  /api/posts
 * @desc fetch all posts
 * @access Pirvate
 */
router.get('/', passport.authenticate('jwt', { session: false }), async ctx => {
    const posts = await  Post.find({});
    if(posts.length >0) {
        ctx.status = 200;
        ctx.body = posts;
    } else {
        ctx.body = {message: 'There is no post for the user.'};
    }
});
/**
 * @route Post  /api/posts/unlike?id=xxxxxx
 * @desc unlike a post
 * @access Private
 */
router.post('/unlike', passport.authenticate('jwt', { session: false }), async ctx => { 
    const id = ctx.query.id;
    const profile = await Profile.find({user: ctx.state.user.id});
    //console.log(profile);
    if(profile.length > 0) {
        const post = await Post.findById(id);
        //console.log(post);
        if(post) {
            const removeIndex = post.likes.findIndex(item => item.user.toString() === ctx.state.user.id);
            if(removeIndex > -1) {
                post.likes.splice(removeIndex, 1);
                const postUpdate = await Post.findByIdAndUpdate({_id: id}, {$set: post}, {new : true});
                ctx.body = postUpdate;
            } else {
                ctx.status = 400;
                ctx.body = {alreadyUnLiked: 'Current is unliked!'};
                return;
            }
        } else {
            ctx.status = 404;
            ctx.body = {message: 'Post not found'};
        }
    } else {
        ctx.status = 400;
        ctx.body = {message: 'There is no profile'};
    }
    
});

/**
 * @route Post  /api/posts/comments?post_id=xxxxxx
 * @desc Add a comments
 * @access Private
 */
router.post('/comments', passport.authenticate('jwt', { session: false }), async ctx => { 
    const post_id = ctx.query.post_id;
    const profile = await Profile.find({user: ctx.state.user.id});
    //console.log(profile);
    if(profile.length > 0) {
        const post = await Post.findById(post_id);
        //console.log('ctx.state.user.id: ',ctx.state.user.id);
        if(post) {
            const newComments = {
                user: ctx.state.user.id,
                text: ctx.request.body.text,
                name: ctx.request.body.name,
                avatar: ctx.request.body.avatar
            };
            post.comments.unshift(newComments);
            console.log(post);
            const postUpdate = await Post.findByIdAndUpdate({_id: post_id}, {$set: post}, {new : true});
            ctx.body = postUpdate;
        } else {
            ctx.status = 404;
            ctx.body = {message: 'Post not found'};
        }
    } else {
        ctx.status = 400;
        ctx.body = {message: 'There is no profile'};
    }
    
});

/**
 * @route Post  /api/posts/comments?post_id=xxxxxx&comments_id=xxx
 * @desc Delete a comments
 * @access Private
 */
router.delete('/comments', passport.authenticate('jwt', { session: false }), async ctx => { 
    const post_id = ctx.query.post_id;
    const comments_id = ctx.query.comments_id;
    const profile = await Profile.find({user: ctx.state.user.id});
    //console.log(profile);
    if(profile.length > 0) {
        const post = await Post.findById(post_id);
        //console.log('ctx.state.user.id: ',ctx.state.user.id);
        if(post) {
            const removeIndex = post.comments.findIndex(item => item.id.toString() === comments_id);
            if(removeIndex > -1) {
                post.comments.splice(removeIndex, 1);
                const postUpdate = await Post.findByIdAndUpdate({_id: post_id}, {$set: post}, {new : true});
                ctx.body = postUpdate;
            } else {
                ctx.status = 404;
                ctx.body = {message: 'Comments not found'};
            }
        } else {
            ctx.status = 404;
            ctx.body = {message: 'Post not found'};
        }
    } else {
        ctx.status = 400;
        ctx.body = {message: 'There is no profile'};
    }
    
});
module.exports = router.routes();