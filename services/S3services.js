const AWS = require('aws-sdk');
const uploadToS3 = (data, filename) => 
{
  //to upload file to s3 install a package by "npm i aws-sdk"
  
  const accessKey = process.env.IAM_USER_KEY;
  const secretKey = process.env.IAM_USER_SECRET;
  const bucketName = process.env.BUCKET_NAME;
  let s3bucket = new AWS.S3({
    accessKeyId : accessKey,
    secretAccessKey : secretKey
  })
  
    var params = {
      Bucket : bucketName,
      Key : filename,
      Body : data,
      ACL : 'public-read'
    }
    return new Promise((resolve,reject) => {
      s3bucket.upload(params, (err,s3response) => {
        if(err){
          console.log('Something went wrong',err);
          reject(err);
        }
        else{
         // console.log('Success',s3response);
           resolve(s3response.Location);
        }
      })
    })
     
}

module.exports = {
    uploadToS3
}