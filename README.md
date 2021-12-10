# fabric_as_code_restapi

# Rest API Usage Instructions

[Rest API Usage Instructions with curl examples](curl_instructions/README.md)

# Requirements

1. Bityoga fabric should be up and running
2. Node version
   - Supports node version >=v11.0.0
   - Tested with v11.0.0

# Run Instructions

1. ## Clone this repository

   ```git clone https://github.com/bityoga/fabric_as_code_restapi.git```

2. ## Run npm install

   - cd fabric_as_code_restapi/
   - **Set node version:** nvm use node v11.0.0 (using nvm)
   - **Execute Command :** npm install

3. ## Configure rest_api prameters (Only if necessary)
   - Open [api_config.json](api_config.json)
   - Configure parameters like ***"rest_api_admin_user_name", "rest_api_admin_password","enable_https"***
3. ## Update fabric ip address in 'fabric_as_code_restapi/fabric_node_sdk_helper/network_profile.json'

   - (For other New App Developers) fabric_node_sdk_helper is available in git repository : https://github.com/bityoga/fabric_node_sdk_helper.git
   - **update the url ip addresses of orderer, peer2, orgca, tlsca (4 places)**.
   - update it with your prime manager's ip address

4. ## Retrieve hyperledger fabric tls certificates of 'orderer' and 'peer2'
   #### Through shell script - needs ssh permission
   - ```cd fabric_as_code_restapi/fabric_node_sdk_helper```
   - In 'fabric_as_code_restapi/fabric_node_sdk_helper/get_tls_certificates.sh' Replace **IP_ADDRESS="LOCALHOST_OR_YOUR_MASTER_MACHINE_IP_ADDRESS"** with your fabric prime manager's ip address
   - **Execute Command :** ```bash get_tls_certificates.sh```
   #### (OR) Through Manual scp commands - needs ssh permission
   ##### (Replace ipaddress in the below scp commands with your fabric prime manager's ip address.)
   ```
   scp -r root@LOCALHOST_OR_YOUR_MASTER_MACHINE_IP_ADDRESS:/root/hlft-store/orgca/orderer/msp/tls/ca.crt .fabric_as_code_restapi/fabric_node_sdk_helper/hlft-store/orderer/tls-msp/tlscacerts/ca.crt
   ```
   ```
   scp -r root@LOCALHOST_OR_YOUR_MASTER_MACHINE_IP_ADDRESS:/root/hlft-store/orgca/peer2/msp/tls/ca.crt .fabric_as_code_restapi/fabric_node_sdk_helper/hlft-store/peer2/tls-msp/tlscacerts/ca.crt
   ```
   
   ##### For Https support
     ```
     scp -r root@LOCALHOST_OR_YOUR_MASTER_MACHINE_IP_ADDRESS:/root/hlft-store/orgca/admin1/msp/cacerts/orgca-7054.pem .fabric_as_code_restapi/fabric_node_sdk_helper/hlft-store/orgca/admin1/msp/cacerts/orgca-7054.pem
     ```
     ```
     scp -r root@LOCALHOST_OR_YOUR_MASTER_MACHINE_IP_ADDRESS:/root/hlft-store/orgca/admin1/msp/signcerts/cert.pem .fabric_as_code_restapi/fabric_node_sdk_helper/hlft-store/orgca/admin1/msp/signcerts/cert.pem
     ```
     ```
     scp -r root@$LOCALHOST_OR_YOUR_MASTER_MACHINE_IP_ADDRESS:$(ssh root@$LOCALHOST_OR_YOUR_MASTER_MACHINE_IP_ADDRESS ls -dtr1 /root/hlft-store/orgca/admin1/msp/keystore/* | tail -1) .fabric_as_code_restapi/fabric_node_sdk_helper/hlft-store/orgca/admin1/msp/keystore/server.key
     ```

   #### (OR) Manually edit the following two files - no need of ssh permission
   - fabric_as_code_restapi/fabric_node_sdk_helper/hlft-store/orderer/tls-msp/tlscacerts/ca.crt
   - fabric_as_code_restapi/fabric_node_sdk_helper/hlft-store/peer2/tls-msp/tlscacerts/ca.crt

   ##### For https support
   - fabric_as_code_restapi/fabric_node_sdk_helper/hlft-store/orgca/admin1/msp/cacerts/orgca-7054.pem
   - fabric_as_code_restapi/fabric_node_sdk_helper/hlft-store/orgca/admin1/msp/signcerts/cert.pem
   - fabric_as_code_restapi/fabric_node_sdk_helper/hlft-store/orgca/admin1/msp/keystore/server.key
5. ## Start App

   ### Using node

   - ```cd fabric_as_code_restapi/```
   - **Execute Command :** ```node rest_api.js```
   - app will be running in 'LOCALHOST_OR_YOUR_MASTER_MACHINE_IP_ADDRESS' at port **3001**
   - open in browser: http://LOCALHOST_OR_YOUR_MASTER_MACHINE_IP_ADDRESS:3001/

   ### Using "nodemon" (Live reload app on save - No need to restart app everytime - Just refresh browser after every save)

   - **Install Nodemon (if not installed)** - ```npm install -g nodemon```
   - ```cd fabric_as_code_restapi/```
   - **Execute Command :** ```nodemon rest_api.js```
   - app will be running in 'LOCALHOST_OR_YOUR_MASTER_MACHINE_IP_ADDRESS' at port **3001**
   - open in browser: http://LOCALHOST_OR_YOUR_MASTER_MACHINE_IP_ADDRESS:3001/
   - Now everytime you make some changes to file and save it, the app will automatically reload again. We need to refresh the browser to see the changes.

## Dockerisation

### 1) Build Docker Image

```sh
$ git clone https://github.com/bityoga/fabric_as_code_restapi.git
$ cd fabric_as_code_restapi
```

Do step 3 & 4 as said above

```sh
$ docker build --tag rest-api .
```

### 2a) Run as a docker container

```sh
$ docker run -d --name rest-api -p 3001:3001 rest-api:latest
```

### 2b) Run as a docker service with replicas

```sh
$ docker service create --name rest-api-service --replicas 1 -p 3001:3001 rest-api:latest
```
