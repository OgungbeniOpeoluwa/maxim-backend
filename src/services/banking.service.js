const axios = require("axios");
const constants = require("../util/constant.util");
const generateToken = require("../util/generateToken")
const errorMessage = require("../util/errormessage.util")





class BankingService {
    constructor(config, userService) {
        this.config = config;
        this.userService = userService;

        this.cachedAssertion = null;
        this.cachedAssertionExpiry = null;
        this.accessToken = null;
        this.IbsClientId = "";
        this.tokenPromise = null;
    }

    async generateClientAssertion() {

        const now = Math.floor(Date.now() / 1000);
        if (this.cachedAssertion && this.cachedAssertionExpiry > now + 60) {
            return this.cachedAssertion;
        }

        const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");

        const expiryDate = process.env.SAVE_HAVEN_EXPIRY_DATE
            ? new Date(process.env.SAVE_HAVEN_EXPIRY_DATE)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const epochSec = Math.floor(Date.now() / 1000);
        const data = {
            iss: this.config.CompanyUrl,
            sub: this.config.SafeHavenClientID,
            aud: this.config.SafeHavenBaseUrl,
            iat: epochSec,
            exp: Math.floor(expiryDate.getTime() / 1000),
        };

        const token = generateToken(data, privateKey);
        this.cachedAssertion = token;
        this.cachedAssertionExpiry = data.exp;
        return token;
    }

    async getToken() {
        const now = Math.floor(Date.now() / 1000);

        if (this.accessToken && this.tokenExpiry && this.tokenExpiry > now + 60) {
            return this.accessToken;
        }


        if (this.tokenPromise) {
            return this.tokenPromise;
        }


        this.tokenPromise = (async () => {
            const clientAssertion = await this.generateClientAssertion();
            console.log(clientAssertion)
            const data = {
                grant_type: this.config.SafeHavenGrantType,
                client_assertion_type: this.config.SafeHavenAssertionType,
                client_assertion: clientAssertion,
                client_id: this.config.SafeHavenClientID,
            };

            try {
                const response = await axios.post(
                    this.config.SafeHavenBaseUrl + constants.SAFE_HAVEN_REFRESH_GENERATE_TOKEN_URL,
                    data
                );

                this.accessToken = response.data.access_token;
                this.IbsClientId = response.data.ibs_client_id;

                this.tokenExpiry = now + (response.data.expires_in || 3600);
                return this.accessToken;
            } catch (err) {
                throw new Error(`failed to get token: ${
                    err.response?.data ? JSON.stringify(err.response.data) : err.message
                }`);
            } finally {
                this.tokenPromise = null; 
            }
        })();

        return this.tokenPromise;
    }



    async createVirtualAccount(id) {
        const token = await this.getToken();
        const user = await this.userService.getUserById(id)
        console.log(user)
        if (user && user.virtualAccountNumber){
            throw new Error(`virtual account ${errorMessage.ERROR_EXIST} for user`)
        }
        const data = {
            validFor: parseInt(this.config.AccountValidity, 10),
            settlementAccount: {
                accountNumber: this.config.SettlementAccountNumber,
                bankCode: this.config.SettlementBankCode,
            },
            amountControl: this.config.SafeHavenAmountControl,
            amount: constants.AMOUNT,
            callbackUrl: this.config.CallBackUrl,
        };
    
        try {
            const response = await axios.post(
                this.config.SafeHavenBaseUrl + constants.CREATE_VIRTUAL_ACCOUNT_URL,
                data,
                {
                    headers: {
                        ClientID: this.IbsClientId,
                        Authorization: `${constants.Bearer} ${token}`,
                    },
                }
            );
            const updateDto = await this.userService.updateUserWithVirtualAccountnumber(response.data.data.accountNumber,id);
    
            return updateDto.virtualAccountNumber;
        } catch (error) {
            console.error("CreateVirtualAccount Error:", error.response?.data || error.message);
            throw new Error(
                `failed to create virtual account: ${
                    error.response?.data ? JSON.stringify(error.response.data) : error.message
                }`
            );
        }
    }
    
}

module.exports = BankingService