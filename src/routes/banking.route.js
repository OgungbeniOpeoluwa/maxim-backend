
const { Router } = require("express");
const BankingController = require("../controller/banking.controller");
const authenticate = require("../middlewares/middleware")

module.exports =  (bankingService,authService)=>{
const routes = Router();
const bankingController = new BankingController(bankingService);

const PATHS = {
    createVirtualAccount: "/virtual-account",
    

};


routes.post(PATHS.createVirtualAccount,authenticate(authService),bankingController.createVirtualAccount.bind(bankingController))
return routes;

};