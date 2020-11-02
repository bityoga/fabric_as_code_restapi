// import required node js libraries
const fs = require("fs");
const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
var crypto = require("crypto");

// import fabric node sdk helper functions
const enrollAdmin = require("./fabric_node_sdk_helper/enrollAdmin");
const registerUser = require("./fabric_node_sdk_helper/registerUser");
const querychaincode = require("./fabric_node_sdk_helper/query");
const invokechaincode = require("./fabric_node_sdk_helper/invoke");
const { load_certificates_from_wallet } = require("./fileread");
const { sqlite_json_insert } = require("./db_query");

// Global variables;

const API_CONFIG_FILE = "api_config.json";
const DB_NAME = "rest_api_db.sqlite";
// Global variable to store the api config from file
let apiConfigJson;

// Load api config from json file
try {
  const apiConfigFilePath = path.resolve(__dirname, ".", API_CONFIG_FILE);
  const apiConfigFileContent = fs.readFileSync(apiConfigFilePath, "utf8");
  apiConfigJson = JSON.parse(apiConfigFileContent);
  console.log(apiConfigJson);
} catch (e) {
  console.log(e);
  throw Error("API Start Error - Error while reading API config", e);
}

// Declare a express app object
const app = express();
// Body-parser - to support JSON-encoded bodies
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.get("/", (req, res) => res.send("tic Restful Api"));

app.post("/jwt", (req, res) => {
  let jsonResponse = {};
  let postRequestData;
  try {
    postRequestData = req.body;
    console.log("postRequestData");
    if (
      postRequestData["Rest_Api_Admin_User_Name"] ===
        apiConfigJson["rest_api_admin_user_name"] &&
      postRequestData["Rest_Api_Admin_Password"] ===
        apiConfigJson["rest_api_admin_password"]
    ) {
      console.log("inside if");
      let privateKey =
        apiConfigJson["rest_api_admin_user_name"] +
        apiConfigJson["rest_api_admin_password"];
      let privateKeyHash = crypto
        .createHash("md5")
        .update(privateKey)
        .digest("hex");
      console.log(privateKeyHash);
      let token = jwt.sign({ body: "stuff" }, privateKeyHash, {
        algorithm: "HS256",
      });
      jsonResponse["status"] = "success";
      jsonResponse["response"] = token;
    } else {
      jsonResponse["status"] = "fail";
      jsonResponse["error"] = "Not Authorised - User Name and Password wrong";
    }
  } catch (error) {
    jsonResponse["status"] = "fail";
    jsonResponse["error"] = error;
  } finally {
    console.log("########### jwt Response #################");
    console.log(jsonResponse);
    res.json(jsonResponse);
  }
});

app.post("/register", isAuthorized, async (req, res) => {
  console.log("inside register");
  let postRequestData;
  let registerStatus = "success";
  let registeredUserInfo;
  let fabricRegisterStatus;
  let jsonResponse = {};
  try {
    postRequestData = req.body;
    console.log(postRequestData);
    fabricRegisterStatus = JSON.parse(
      await registerUser(
        postRequestData["User_Name"],
        postRequestData["User_Password"],
        postRequestData["User_Role"]
      )
    );
    console.log(fabricRegisterStatus);
    if (fabricRegisterStatus["registerStatus"].includes("success")) {
      let userCertificatesJson = await load_certificates_from_wallet(
        postRequestData["User_Name"]
      );
      let currentTimestamp = { Registered_Timestamp: new Date() };
      registeredUserInfo = {
        ...postRequestData,
        ...userCertificatesJson,
        ...currentTimestamp,
      };
      let insertStatus = await sqlite_json_insert(
        DB_NAME,
        registeredUserInfo,
        "User"
      );
      registerStatus = insertStatus;
      jsonResponse["status"] = registerStatus;
      registeredUserInfo["registerStatus"] =
        fabricRegisterStatus["registerStatus"];
      jsonResponse["response"] = registeredUserInfo;
    } else {
      jsonResponse["status"] = "fail";
      jsonResponse["response"] = fabricRegisterStatus;
    }
  } catch (e) {
    console.log(e);
    registerStatus = e;
    jsonResponse["status"] = "fail";
    jsonResponse["error"] = e;
  } finally {
    res.json(jsonResponse);
  }
});

app.post("/query", isAuthorized, async (req, res) => {
  let jsonResponse = {};
  let postRequestData;
  try {
    postRequestData = req.body;
    console.log(postRequestData);
    let args = postRequestData["Chaincode_Function_Json_Arguments"].split(",");
    args.unshift(postRequestData["Chaincode_Function_Name"]);
    args.unshift(postRequestData["Chaincode_Name"]);
    args.unshift(postRequestData["Channel_Name"]);
    args.unshift(apiConfigJson["rest_api_admin_user_name"]);
    let fabricQueryResult = await querychaincode.apply(this, args);
    jsonResponse["status"] = "success";
    jsonResponse["response"] = JSON.parse(fabricQueryResult);
  } catch (e) {
    console.log(e);
    jsonResponse["status"] = "fail";
    jsonResponse["error"] = e;
  } finally {
    res.json(jsonResponse);
  }
});

app.post("/invoke", isAuthorized, async (req, res) => {
  let jsonResponse = {};
  let postRequestData;
  try {
    postRequestData = req.body;
    console.log(postRequestData);
    console.log(
      postRequestData["Chaincode_Function_Json_Arguments"].split(",")
    );
    let args = postRequestData["Chaincode_Function_Json_Arguments"].split(",");
    args.unshift(postRequestData["Chaincode_Function_Name"]);
    args.unshift(postRequestData["Chaincode_Name"]);
    args.unshift(postRequestData["Channel_Name"]);
    args.unshift(apiConfigJson["rest_api_admin_user_name"]);
    let fabricInvokeResult = await invokechaincode.apply(this, args);
    jsonResponse["status"] = "success";
    jsonResponse["response"] = fabricInvokeResult;
  } catch (e) {
    console.log(e);
    jsonResponse["status"] = "fail";
    jsonResponse["error"] = e;
  } finally {
    res.json(jsonResponse);
  }
});

function isAuthorized(req, res, next) {
  if (typeof req.headers.authorization !== "undefined") {
    // retrieve the authorization header and parse out the
    // JWT using the split function
    let token = req.headers.authorization.split(" ")[1];

    // Generate rest api privateKeyHash to generate token
    let privateKey =
      apiConfigJson["rest_api_admin_user_name"] +
      apiConfigJson["rest_api_admin_password"];
    let privateKeyHash = crypto
      .createHash("md5")
      .update(privateKey)
      .digest("hex");
    console.log(privateKeyHash);

    // Here we validate that the JSON Web Token is valid and has been
    // created using the same private pass phrase
    jwt.verify(token, privateKeyHash, { algorithm: "HS256" }, (err, user) => {
      // if there has been an error...
      if (err) {
        // shut them out!
        res.status(500).json({ error: "Not Authorized" });
      }
      // if the JWT is valid, allow them to hit
      // the intended endpoint
      return next();
    });
  } else {
    // No authorization header exists on the incoming
    // request, return not authorized
    res.status(500).json({ error: "Not Authorized" });
  }
}

async function main() {
  try {
    const admin_enroll_status = await enrollAdmin(
      apiConfigJson["fabric_ca_admin_user_name"],
      apiConfigJson["fabric_ca_admin_password"],
      apiConfigJson["fabric_organisation_msp_name"],
      apiConfigJson["fabric_ca_organisation_name"]
    );
    console.log(admin_enroll_status);
    const apiAdminUserRegisterStatus = await registerUser(
      apiConfigJson["rest_api_admin_user_name"],
      apiConfigJson["rest_api_admin_password"],
      apiConfigJson["rest_api_admin_user_role"]
    );
    console.log(apiAdminUserRegisterStatus);
  } catch (error) {
    throw Error("API Start Error - Error while enrolling admin", e);
  } finally {
    const port = apiConfigJson["rest_api_port"];
    app.listen(port, () => console.log(`Rest Api listening on port ${port}!`));
  }
}

main();
