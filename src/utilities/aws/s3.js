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

import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

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

        this.uploadProfilePhoto = async () => {
            return new Promise(async(resolve, reject) => {
                let image = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [3, 3],
                });

                if (!image.cancelled) {
                    let filename = image.uri.split('/').pop();
                    let filter = {
                        uri: image.uri,
                        name: filename,
                        type: image.type+'/'+filename.split('.').pop()
                    }
                    RNS3.put(filter, {...this.options, keyPrefix: 'profile/'})
                        .then(response => {
                            //console.log('response',response);
                            if (response.status !== 201){
                                reject("Failed to upload image to S3");
                            } else {
                                resolve(response.body);
                            }
                        })
                        .catch(err => {
                            reject('RNS3 File upload error!');
                        })
                } else {
                    reject('ImagePicker Error!');
                }
            });
        }

        this.fileUpload = async () => {
            console.log('fileUpload called!');
            return new Promise(async(resolve, reject) => {
                let file = await DocumentPicker.getDocumentAsync({});
                //console.log('file',file);
                if (!file.cancelled) {
                    let filename = file.uri.split('/').pop();
                    let filter = {
                        uri: file.uri,
                        name: filename,
                        type: file.type+'/'+filename.split('.').pop()
                    }
                    RNS3.put(filter, {...this.options, keyPrefix: 'attachment/'})
                        .then(response => {
                            //console.log('response',response);
                            if (response.status !== 201){
                                reject("Failed to upload image to S3");
                            } else {
                                resolve(response.body);
                            }
                        })
                        .catch(err => {
                            reject('RNS3 File upload error!');
                        })
                } else {
                    reject('ImagePicker Error!');
                }
            });
        }
    }
}