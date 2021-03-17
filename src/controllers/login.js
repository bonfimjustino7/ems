const User = require("../models/user.models");

const user = new User({ login: "teste", password: "123" });

// User.objects.create(user, (err, usuario) => {
//   if (err) {
//     console.log(err);
//     return null;
//   }
//   console.log(usuario);
// });
User.objects.filter({ login: "teste" }, (err, result) => {
  console.log(result);
});

// User.findAll((error, result) => {
//   const resultados = JSON.parse(JSON.stringify(result));
//   console.log(resultados);
// });

// User.objects.

// // User.update(1, user, (err, result) => {
// //   const resultados = JSON.parse(JSON.stringify(result));
// //   console.log(resultados);
// // });

// // User.delete(1, (error, result) => {
// //   console.log(result);
// // });
