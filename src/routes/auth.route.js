const { Router } = require("express");
const AuthController = require("../controller/auth.controller");

module.exports =  (authService)=>{
const routes = Router();
const authController = new AuthController(authService);
const PATHS = {
    register_user: "/register",
    login:"/login"
};


routes.post(PATHS.register_user,authController.registerUser.bind(authController))
routes.post(PATHS.login,authController.login.bind(authController))
return routes;

};