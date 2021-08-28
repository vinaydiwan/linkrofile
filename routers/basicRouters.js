const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/catchAsync');
const Profile = require('../models/profiles');
const validateIntro = require('../middleware/validateIntro');

router.route('/')
    .get((req, res) => {
        res.render('profiles/home');
    })
router.route('/signin')
    .get((req, res) => {
        res.send("signin");
    })
    .post((req, res) => {
        res.send("signin");
    })
router.route('/signup')
    .get((req, res) => {
        res.redirect('/new');
    })
    .post((req, res) => {
        res.send("signup");
    })
router.get('/signout', (req, res) => {
    res.send("signout");
})
router.get('/search', CatchAsync(async (req, res, next) => {
    const search = req.query.search.trim();
    if (!search) {
        return res.redirect("/");
    }
    const profiles = await Profile.find({ fullname: { $regex: new RegExp(search), $options: 'i' } });
    res.render('profiles/search', { search, profiles });
}))
router.route('/new')
    .get((req, res) => {
        res.render('profiles/newprofile');
    })
    .post(validateIntro, CatchAsync(async (req, res, next) => {
        const { firstname, lastname } = req.body;
        const fullname = `${firstname} ${lastname}`;
        const profile = await new Profile({ fullname, ...req.body });
        await profile.save();
        req.flash("success","Done! Account Created");
        res.redirect(`/${profile._id}`);
    }))
router.get('/:id', CatchAsync(async (req, res, next) => {
    const profile = await Profile.findById(req.params.id);
    if(!profile){
        req.flash("error","User Not found!");
        return res.redirect("/");
    }
    res.render("profiles/profile", { profile });
}))
router.post("/:id/editIntro", CatchAsync(async (req, res) => {
    const { firstname, lastname } = req.body;
    const fullname = `${firstname} ${lastname}`;
    const profile = await Profile.findByIdAndUpdate(req.params.id, {fullname, ...req.body});
    res.redirect(`/${profile._id}`);
}))
router.post("/:id/addSummary", CatchAsync(async (req, res) => {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/${profile._id}`);
}))
router.post("/:id/delSummary", CatchAsync(async (req, res) => {
    const profile = await Profile.findById(req.params.id);
    profile.summary = "";
    profile.save();
    res.redirect(`/${profile._id}`);
}))
router.post("/:id/addLink", CatchAsync(async (req, res) => {
    const profile = await Profile.findById(req.params.id);
    await profile.links.push(req.body);
    await profile.save();
    res.redirect(`/${profile._id}`);
}))
router.post("/:id/editLink", CatchAsync(async (req, res) => {
    const link = req.body;
    const profile = await Profile.findById(req.params.id);
    profile.links = profile.links.map(function(l){
        if(l._id == link.id){
            l.title = link.title;
            l.url = link.url;
            l.description = link.description;
        }
        return l;
    })
    await profile.save();
    res.redirect(`/${profile._id}`);
}))
router.delete("/:id/delLists/:lid", CatchAsync(async (req, res) => {
    let profile = await Profile.findById(req.params.id);
    profile.links = profile.links.filter(function (l) {
        return l._id != req.params.lid;
    });
    await profile.save();
    res.redirect(`/${profile._id}`);
}))

module.exports = router;