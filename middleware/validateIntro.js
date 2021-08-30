const Joi = require('joi');

const IntroSchema = Joi.object({
    firstname: Joi.string().trim().required(),
    lastname: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    country: Joi.string().trim().required(),
    role: Joi.string().trim().required(),
})

const validateIntro = (req, res, next) => {
    const { error } = IntroSchema.validate(req.body);
    if (error) {
        console.log(error)
        req.flash("error","Incorrect credentials");
        return res.redirect("/new");
    }
    else {
        next();
    }
}

module.exports = validateIntro;