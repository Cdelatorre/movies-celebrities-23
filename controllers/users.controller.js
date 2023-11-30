const User = require("../models/User.model");

module.exports.register = (req, res, next) => {
  res.render("users/register");
};

module.exports.login = (req, res, next) => {
  res.render("users/login", { errors: false });
};

module.exports.doRegister = (req, res, next) => {
  User.create(req.body)
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => next(err));
};

module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body;

  const renderWithErrors = () => {
    res.render("users/login", {
      email,
      errors: true,
    });
  };

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return user.checkPassword(password).then((match) => {
          if (match) {
            console.log("Te has logueado bien!!");
            res.redirect(`/profile/${user._id}`);
          } else {
            console.log("Email o contraseña incorrectos"); // contraseña incorrecta
            renderWithErrors();
          }
        });
      } else {
        console.log("Email o contraseña incorrectos"); // no existe usuario con ese email
        renderWithErrors();
      }
    })
    .catch((err) => next(err));
};

module.exports.profile = (req, res, next) => {
  const id = req.params.id;

  User.findById(id)
    .then((user) => {
      res.render("users/profile", { user });
    })
    .catch((err) => next(err));
};
