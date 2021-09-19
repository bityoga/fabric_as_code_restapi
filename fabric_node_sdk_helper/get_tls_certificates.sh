#!/bin/bash
set -x #echo on

IP_ADDRESS="164.90.186.112"
REMOTE_MACHINE_ORDERER_TLS_CERT_FILE="/root/hlft-store/orgca/orderer/msp/tls/ca.crt"
REMOTE_MACHINE_PEER2_TLS_CERT_FILE="/root/hlft-store/orgca/peer2/msp/tls/ca.crt"
LOCAL_ORDER_TLS_CERT_FILE="./hlft-store/orderer/tls-msp/tlscacerts/ca.crt"
LOCAL_ORDER_PEER2_CERT_FILE="./hlft-store/peer2/tls-msp/tlscacerts/ca.crt"

scp -r root@$IP_ADDRESS:$REMOTE_MACHINE_ORDERER_TLS_CERT_FILE $LOCAL_ORDER_TLS_CERT_FILE &&
scp -r root@$IP_ADDRESS:$REMOTE_MACHINE_PEER2_TLS_CERT_FILE $LOCAL_ORDER_PEER2_CERT_FILE &&


# Certificates for https support
REMOTE_MACHINE_ORG_ADMIN_CA_CERT_FILE="/root/hlft-store/orgca/admin1/msp/cacerts/orgca-7054.pem"
REMOTE_MACHINE_ORG_ADMIN_CERT_FILE="/root/hlft-store/orgca/admin1/msp/signcerts/cert.pem"
REMOTE_MACHINE_ORG_ADMIN_KEY_FILE="/root/hlft-store/orgca/admin1/msp/keystore/*"

LOCAL_MACHINE_ORG_ADMIN_CA_CERT_FILE="./hlft-store/orgca/admin1/msp/cacerts/orgca-7054.pem"
LOCAL_MACHINE_ORG_ADMIN_CERT_FILE="./hlft-store/orgca/admin1/msp/signcerts/cert.pem"
LOCAL_MACHINE_ORG_ADMIN_KEY_FILE="./hlft-store/orgca/admin1/msp/keystore/server.key"

scp -r root@$IP_ADDRESS:$REMOTE_MACHINE_ORG_ADMIN_CA_CERT_FILE $LOCAL_MACHINE_ORG_ADMIN_CA_CERT_FILE &&
scp -r root@$IP_ADDRESS:$REMOTE_MACHINE_ORG_ADMIN_CERT_FILE $LOCAL_MACHINE_ORG_ADMIN_CERT_FILE &&
# scp the most recent file from the remote machine 
scp -r root@$IP_ADDRESS:$(ssh root@$IP_ADDRESS ls -dtr1 $REMOTE_MACHINE_ORG_ADMIN_KEY_FILE | tail -1) $LOCAL_MACHINE_ORG_ADMIN_KEY_FILE
