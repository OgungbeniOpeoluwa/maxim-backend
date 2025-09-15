require("dotenv").config();
const constants = require("../util/constant.util")

let DB_URL = process.env.MONGO_URI;

if (process.env.NODE_ENV === constants.TEST) {
  DB_URL = process.env.MONGO_URI_TEST;
}

const Config = {
  DB_URL,
  PORT: process.env.PORT,
  SafeHavenBaseUrl:process.env.SAVE_HAVEN_BASE_URL,
  AccessTokenSecret:process.env.ACCESS_TOKEN_SECRET,
  SafeHavenClientID:process.env.CLIENT_ID,
  SafeHavenGrantType:process.env.GRANT_TYPE,
  SafeHavenAssertionType:process.env.CLIENT_ASSERTION_TYPE,
  SafeCompanyUrl:process.env.COMPANY_URL,
  SafeHaveExpiryDate:process.env.EXPIRY,
  CompanyUrl:process.env.COMPANY_URL,
  SettlementAccountNumber:process.env.SETTLEMENT_ACCOUNT_NUMBER,
  SettlementBankCode:process.env.SETTLEMENT_BANK_CODE,
  SafeHavenAmountControl:process.env.AMOUNT_CONTROL,
  CallBackUrl:process.env.CALL_BACK_URL,
  AccountValidity:process.env.ACCOUNT_VALIDITY

};



module.exports = Config;
