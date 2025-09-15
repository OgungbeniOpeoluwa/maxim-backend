require("dotenv").config();
const authRoutes = require("./routes/auth.route")
const userRoutes = require("./routes/user.routes")
const UserService = require("./services/user.service")
const AuthService = require("./services/auth.service")
const BankingService = require("./services/banking.service")
const WebhookService = require("./services/webhook.service")
const config = require("./config/config")

const express = require("express")
const connectDB = require("./config/db");
const bankingRoute = require("./routes/banking.route");
const webhookRoute = require("./routes/webhook.routes");

const userService = new UserService();
const authService = new AuthService(userService,config);
const bankingService = new BankingService(config,userService)
const webhookService = new WebhookService(userService)


var app = express();
app.use(express.json());

// Connect to db
connectDB()
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); 
  });


// Routes 
app.use("/api/auth",authRoutes(authService));
app.use("/api/user",userRoutes(authService,userService));
app.use("/api/banking",bankingRoute(bankingService,authService));
app.use("/api/webhooks",webhookRoute(webhookService))


app.listen(5050, "0.0.0.0",()=>{
    console.log("Server listening on 5050")
})