
const { Router } = require("express");
const WebhookController = require("../controller/webhook.controller");

module.exports =  (webhookService)=>{
const routes = Router();
const webhookController = new WebhookController(webhookService);

const PATHS = {
    webhook: "/safehaven",
    

};
routes.post(PATHS.webhook,webhookController.getWebhook.bind(webhookController))
return routes;

};