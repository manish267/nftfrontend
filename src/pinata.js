//require('dotenv').config();
// const key = '5f469b9244259a2ff92f';
// const secret ='d57d30d0868aed4b66e7f8008c97d3727a46a4fb14d0fbfb700cc5c456887fee';

// console.log(key)
// console.log(secret)

const axios = require('axios');
const FormData = require('form-data');

export const uploadJSONToBucket = async(JSONBody) => {
    // const url = `http://localhost:5000/uploadjson/`;
    const url = `http://mvpnftmarketplace.herokuapp.com/uploadjson/`;
    //making axios POST request to Pinata ⬇️
     console.log(JSONBody);
    return axios 
        .post(url, JSONBody,{headers:{
            "Access-Control-Allow-Origin":"*",
            "Content-Type": "application/json"
        }})
        .then(function (response) {
           return {
               success: true,
               data: response.data
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};

export const uploadFileToBucket = async(file) => {
    // const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    // const url = `http://localhost:5000/uploadimage`;
    const url = `https://mvpnftmarketplace.herokuapp.com/uploadimage`;
    //making axios POST request to Pinata ⬇️


    console.log(file);
    
    let data = new FormData();
    data.append('file', file);

    // const metadata = JSON.stringify({
    //     name: 'testname',
    //     keyvalues: {
    //         exampleKey: 'exampleValue'
    //     }
    // });
    // data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    // const pinataOptions = JSON.stringify({
    //     cidVersion: 0,
    //     customPinPolicy: {
    //         regions: [
    //             {
    //                 id: 'FRA1',
    //                 desiredReplicationCount: 1
    //             },
    //             {
    //                 id: 'NYC1',
    //                 desiredReplicationCount: 2
    //             }
    //         ]
    //     }
    // });
    // data.append('pinataOptions', pinataOptions);

    return axios 
        .post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                "Access-Control-Allow-Origin":"*",
                'Content-Type': `multipart/form-data`
                // pinata_api_key: key,
                // pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
            console.log("image uploaded", response.data)
            return {
               success: true,
               data: response.data
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};