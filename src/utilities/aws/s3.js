// import {v4 as uuid} from "uuid";
// //uuid.v4();
// // const AWS = require("aws-sdk");
// class S3 {
//     constructor() {
//         this.bucketName = 'my-mobile-learning-bucket';

//         this.s3 = new AWS.S3({
//             accessKeyId: awsConfig.awsaccessKeyId,
//             secretAccessKey: awsConfig.awssecretAccessKey,
//             Bucket: this.bucketName,
//             signatureVersion: 'v4'
//         });
        
//         // this.uploadFile = (file) => {
//         //     return new Promise((resolve, reject) => {
//         //         let key = uuid.v4();
//         //         let params = {
//         //             Bucket: this.bucketName,
//         //             Key: key,
//         //             Body: file
//         //         }
//         //         this.s3.upload(params, (err, data) => {
//         //             if(err){
//         //                 reject(err);
//         //             } else {
//         //                 resolve(data);
//         //             }
//         //         });
//         //     });
//         // }
//     }
// }

// export default S3;
// // export { Options };


import { RNS3 } from 'react-native-aws3';
const awsConfig = require('../../../config.js');

export default class s3 {
    constructor(){
        this.options = {
            keyPrefix: "upload/",
            bucket: 'my-mobile-learning-bucket',
            region: awsConfig.awsregion,
            accessKey: awsConfig.awsaccessKeyId,
            secretKey: awsConfig.awssecretAccessKey,
            successActionStatus: 201
        }
        this.uploadFile = async (expoFileUriObject) => {
            return new Promise((resolve, reject) => {
                RNS3.put(expoFileUriObject, this.options)
                    .then(response => {
                        console.log('response',response);
                        if (response.status !== 201){
                            reject("Failed to upload image to S3");
                        } else {
                            console.log('File is successfull uploaded!');
                            console.log(response.body);
                            resolve(response.body);
                        }
                    });
            });            
        }
    }
}