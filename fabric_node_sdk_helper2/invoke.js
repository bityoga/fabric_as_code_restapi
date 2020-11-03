/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { FileSystemWallet, Gateway } = require("fabric-network");
const fs = require("fs");
const path = require("path");

const ccpPath = path.resolve(__dirname, ".", "network_profile.json");

async function invokechaincode(
  USER_NAME,
  CHANNEL_NAME,
  CHAIN_CODE_NAME,
  CHAIN_CODE_FUNCTION_NAME,
  ...ARGS
) {
  let jsonResponse = {};
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(USER_NAME);
    if (!userExists) {
      jsonResponse["invokeStatus"] = "fail";
      jsonResponse["invokeError"] =
        "An identity for the user " +
        USER_NAME +
        " does not exist in the wallet.";
    } else {
      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccpPath, {
        wallet,
        identity: USER_NAME,
        discovery: { enabled: false, asLocalhost: false },
      });
      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork(CHANNEL_NAME);

      // Get the contract from the network.
      const contract = network.getContract(CHAIN_CODE_NAME);

      // Submit the specified transaction.
      let invokeResponse = await contract.submitTransaction(
        CHAIN_CODE_FUNCTION_NAME,
        ...ARGS
      );
      jsonResponse["invokeStatus"] = "success";
      jsonResponse["invokeResponse"] = invokeResponse.toString();
      console.log("Transaction has been submitted");

      // Disconnect from the gateway.
      await gateway.disconnect();
    }
  } catch (error) {
    jsonResponse["invokeStatus"] = "fail";
    jsonResponse["invokeError"] = `Failed to evaluate transaction: ${error}`;
  } finally {
    console.log("####### Invoke Status ########");
    console.log(
      `Transaction Invoke has been evaluated, result is: ${JSON.stringify(
        jsonResponse
      )}`
    );
    return JSON.stringify(jsonResponse);
  }
}

module.exports = invokechaincode;
