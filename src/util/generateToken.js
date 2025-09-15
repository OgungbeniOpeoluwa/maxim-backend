const jwa = require("jwa");
const fs = require("fs");


function generateToken(payload,privateKey){
    const sign = jwa("RS256");
    const header = { alg: "RS256", typ: "JWT" };
    const encodedHeader = base64url(header);
    const encodedPayload = base64url(payload);
    const signature = sign.sign(encodedHeader + "." + encodedPayload, privateKey);

    const token = `${encodedHeader}.${encodedPayload}.${signature}`;
    return token;

}

function base64url(obj) {
    return Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }
  
module.exports=generateToken
