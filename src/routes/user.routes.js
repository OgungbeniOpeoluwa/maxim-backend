
const { Router } = require("express");
const UserController = require("../controller/user.controller");
const authenticate = require("../middlewares/middleware")

module.exports =  (authService,userService)=>{
const routes = Router();
const userController = new UserController(userService);

const PATHS = {
    profile: "/profile",
    

};


routes.get(PATHS.profile,authenticate(authService),userController.getUserProfile.bind(userController))
routes.put(PATHS.profile,authenticate(authService),userController.updateUser.bind(userController))
return routes;

};