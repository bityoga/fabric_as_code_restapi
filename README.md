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

   - git clone https://github.com/bityoga/fabric_as_code_restapi.git

2. ## Run npm install

   - cd fabric_as_code_restapi/
   - #### Set node version
     - nvm use node v11.0.0 (using nvm)
   - **Execute Command :** npm install

3. ## Update fabric ip address in 'smart_energy_app/fabric_node_sdk_helper/network_profile.json'

   - (For other New App Developers) fabric_node_sdk_helper is available in git repository : https://github.com/bityoga/fabric_node_sdk_helper.git
   - **update the url ip addresses of orderer, peer2, orgca, tlsca (4 places)**.
   - update it with your prime manager's ip address

4. ## Retrieve hyperledger fabric tls certificates of 'orderer' and 'peer2'
   #### Through shell script - needs ssh permission
   - cd smart_energy_app/fabric_node_sdk_helper
   - In 'smart_energy_app/fabric_node_sdk_helper/get_tls_certificates.sh' Replace **IP_ADDRESS="178.62.207.235"** with your fabric prime manager's ip address
   - **Execute Command :** bash get_tls_certificates.sh
   #### (OR) Through Manual scp commands - needs ssh permission
   - Replace ipaddress in the below scp commands with your fabric prime manager's ip address.
   - scp -r root@178.62.207.235:/root/hlft-store/orgca/orderer/msp/tls/ca.crt .smart_energy_app/fabric_node_sdk_helper/hlft-store/orderer/tls-msp/tlscacerts/ca.crt
   - scp -r root@178.62.207.235:/root/hlft-store/orgca/peer2/msp/tls/ca.crt .smart_energy_app/fabric_node_sdk_helper/hlft-store/peer2/tls-msp/tlscacerts/ca.crt
   #### (OR) Manually edit the following two files - no need of ssh permission
   - smart_energy_app/fabric_node_sdk_helper/hlft-store/orderer/tls-msp/tlscacerts/ca.crt
   - smart_energy_app/fabric_node_sdk_helper/hlft-store/peer2/tls-msp/tlscacerts/ca.crt
5. ## Start App

   **## Using node ##**

   - cd fabric_as_code_restapi/
   - **Execute Command :** node rest_api.js
   - app will be running in 'localhost' at port 3001
   - open in browser: http://localhost:3001/

   **## Using "nodemon" (Live reload app on save - No need to restart app everytime - Just refresh browser after every save) ##**

   -**Install Nodemon (if not installed)** - npm install -g nodemon

   - cd smart_energy_app/
   - **Execute Command :** nodemon rest_api.js
   - app will be running in 'localhost' at port 3001
   - open in browser: http://localhost:3001/
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
