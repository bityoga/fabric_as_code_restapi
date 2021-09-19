# Rest API Usage Instructions

## Curl Examples

### 1) Get Authentication token

- **Api endpoint :** /jwt
- **Required Post Data :** Rest_Api_Admin_User_Name, Rest_Api_Admin_Password
- **Example curl command :**
  ```sh
  curl -k -H "Content-Type: application/json" --request POST -d '{"Rest_Api_Admin_User_Name":"rest_api_admin_user","Rest_Api_Admin_Password":"rest_api_admin_password"}' https://localhost:3001/jwt | jq '.'
  ```
- **Sample Success Response :**

  ```json
  {
    "status": "success",
    "response": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib2R5Ijoic3R1ZmYiLCJpYXQiOjE2MDQzNDExNzR9.Um_pFgR3-O9rRBeO7bqvQPQM1EpBWUh5V6ZXuVjqT-4"
  }
  ```

- **Sample Failure Response :**

  ```json
  {
    "status": "fail",
    "error": "Not Authorised - User Name and Password wrong"
  }
  ```

### 2) Register User

- **Api endpoint :** /register
- **Required Post Data :** User_Name, User_Password, User_Role
- **Example curl command :**

  ```sh
  curl -k -H "Content-Type: application/json" --request POST -d '{"User_Name":"7xyzzgtrtvyp","User_Password":"7xyzzgttrvyp","User_Role":"client"}' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib2R5Ijoic3R1ZmYiLCJpYXQiOjE2MDQzNDA3MTR9._F7oqjK7vooX1Tj-FCzHcnT7g7KkLrAaVPNXq3Y1IhM" https://localhost:3001/register |  jq '.
  ```

- **Sample Success Response :**

  ```json
  {
    "status": "success",
    "response": {
      "User_Name": "test_user2",
      "User_Password": "test_user2",
      "User_Role": "client",
      "User_Private_Key": "-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgSSjLV989TX6P8FfN\r\nNrMrymuIV+Wq8/hLFKs/bGTwld2hRANCAAQJbe24E8DAsC6mwKWdX/kNQwI8lO7u\r\npvFerU+FAvCSetJcHaEC3Rq5bcvD5gn6M2EX9CsyGY86PPiJvCJjBKV+\r\n-----END PRIVATE KEY-----\r\n",
      "User_Public_Key": "-----BEGIN PUBLIC KEY-----\r\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAECW3tuBPAwLAupsClnV/5DUMCPJTu\r\n7qbxXq1PhQLwknrSXB2hAt0auW3Lw+YJ+jNhF/QrMhmPOjz4ibwiYwSlfg==\r\n-----END PUBLIC KEY-----\r\n",
      "User_Enrollment_Certificate": "{\"name\":\"test_user2\",\"mspid\":\"hlfMSP\",\"roles\":null,\"affiliation\":\"\",\"enrollmentSecret\":\"\",\"enrollment\":{\"signingIdentity\":\"eb727214d511ce94a9d77ab11d3aad5ee3b1973d9b00ce3809423ab89ecd1a98\",\"identity\":{\"certificate\":\"-----BEGIN CERTIFICATE-----\\nMIICRjCCAeygAwIBAgIUP9hOKMbIETtIUeGp/V+xgG4eF7cwCgYIKoZIzj0EAwIw\\nXTELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMQ4wDAYDVQQDEwVvcmdjYTAe\\nFw0yMDExMDIxODQwMDBaFw0yMTExMDIxODQ1MDBaMCYxDzANBgNVBAsTBmNsaWVu\\ndDETMBEGA1UEAwwKdGVzdF91c2VyMjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IA\\nBAlt7bgTwMCwLqbApZ1f+Q1DAjyU7u6m8V6tT4UC8JJ60lwdoQLdGrlty8PmCfoz\\nYRf0KzIZjzo8+Im8ImMEpX6jgcAwgb0wDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB\\n/wQCMAAwHQYDVR0OBBYEFMcgiuXQoQS1EzYteMdC+CbZszzXMB8GA1UdIwQYMBaA\\nFFZt+fT49HhEQbD5w5nwhfpyyupCMF0GCCoDBAUGBwgBBFF7ImF0dHJzIjp7Imhm\\nLkFmZmlsaWF0aW9uIjoiIiwiaGYuRW5yb2xsbWVudElEIjoidGVzdF91c2VyMiIs\\nImhmLlR5cGUiOiJjbGllbnQifX0wCgYIKoZIzj0EAwIDSAAwRQIhAIo+NDygO5xj\\nCMIUEQDr/VyWFObpEIsN22eSq91QM6OnAiAOy1+WOWmPLjGs+NPbON+7kJyad68b\\n+DMfEidaTnbBVA==\\n-----END CERTIFICATE-----\\n\"}}}",
      "Registered_Timestamp": "2020-11-02T18:45:04.629Z",
      "registerStatus": "success"
    }
  }
  ```

- **Sample Failure Response :**

  ```json
  {
    "status": "fail",
    "response": {
      "registerStatus": "fail",
      "registerError": "An identity for the user \"test_user\" already exists in the wallet"
    }
  }
  ```

### 3) Query Chaincode

- **Api endpoint :** /query
- **Required Post Data :** Channel_Name, Chaincode_Name, Chaincode_Function_Name, Chaincode_Function_Json_Arguments
- **Example curl command :**
  ```sh
  curl -k -H "Content-Type: application/json" --request POST -d '{"Channel_Name":"appchannel","Chaincode_Name":"energy","Chaincode_Function_Name":"ReadAsset","Chaincode_Function_Json_Arguments":["[\"ark\"]"]}' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib2R5Ijoic3R1ZmYiLCJpYXQiOjE2MDQzNDA3MTR9._F7oqjK7vooX1Tj-FCzHcnT7g7KkLrAaVPNXq3Y1IhM" https://localhost:3001/query |  jq '.'
  ```
- **Sample Success Response :**

  ```json
  {
    "status": "success",
    "response": {
      "queryStatus": "success",
      "queryResponse": {
        "Balance": "1000",
        "ID": "ark",
        "Type": "Initial Credit"
      }
    }
  }
  ```

- **Sample Failure Response :**

  ```json
  {
    "status": "success",
    "response": {
      "queryStatus": "fail",
      "queryError": "Failed to evaluate transaction: Error: error in simulation: transaction returned with failure: Error: The user arkk does not exist"
    }
  }
  ```

### 4) Invoke Chaincode

- **Api endpoint :** /invoke
- **Required Post Data :** Channel_Name, Chaincode_Name, Chaincode_Function_Name, Chaincode_Function_Json_Arguments
- **Example curl command :**
  ```sh
  curl -k -H "Content-Type: application/json" --request POST -d '{"Channel_Name":"appchannel","Chaincode_Name":"energy","Chaincode_Function_Name":"TransferBalance","Chaincode_Function_Json_Arguments":["[\"ark\",\"ark2\",\"10\",\"Buy Energy\"]"]}' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib2R5Ijoic3R1ZmYiLCJpYXQiOjE2MDQzNDA3MTR9._F7oqjK7vooX1Tj-FCzHcnT7g7KkLrAaVPNXq3Y1IhM" https://localhost:3001/invoke |  jq '.'
  ```
- **Sample Success Response :**

  ```json
  {
    "status": "success",
    "response": "{\"invokeStatus\":\"success\",\"invokeResponse\":\"\"}"
  }
  ```

- **Sample Failure Response :**

  ```json
  {
    "status": "success",
    "response": "{\"invokeStatus\":\"fail\",\"invokeError\":\"Failed to evaluate transaction: Error: No valid responses from any peers. 1 peer error responses:\\n    peer=peer2, status=500, message=error in simulation: transaction returned with failure: Error: The user ark22 does not exist\"}"
  }
  ```
