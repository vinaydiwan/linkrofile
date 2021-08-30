const Joi = require('joi');

const Schema = Joi.object({
    username: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
})

const validateUser = (req, res, next) => {
    const { error } = Schema.validate(req.body);
    if (error) {
        req.flash("error","Incorrect credentials");
        return res.redirect("/signup");
    }
    else {
        next();
    }
}

module.exports = validateUser;