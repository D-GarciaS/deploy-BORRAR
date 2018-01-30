var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var s3 = new aws.S3();

var fileUpload = require('express-fileupload');
router.use(fileUpload());

/* GET /. */
router.get('/', function(req, res) {
  /*
   * @TODO Add code to display all buckets;
   */
  
  s3.listBuckets({},function(err,data) {
      if(err) {
          throw err;
      }
      console.log(data);
      res.render('listBuckets', { buckets: data.Buckets});
  });
});

router.get('/:bucket/', function(req, res) {
    var params = {
      Bucket: req.params.bucket  
    };
    s3.listObjects(params, function (err, data) {
        if (err) {
            console.log(err);
        } else {
           console.log(req.params.bucket);
           console.log(data);
           res.render('listObjects', {bucket: req.params.bucket,objects:data.Contents});
        }
    });
});

router.get('/:bucket/:key', function(req, res) {
    var params = {
      Bucket: req.params.bucket,
      Key: req.params.key
    };    
    s3.getObject(params, function(err, data){
        if(err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
            res.type(data.ContentType);
            res.send(data.Body);
        }
            
    });
});

router.post('/', function(req,res) {
    var params = {
        Bucket: req.body.Bucket,
        CreateBucketConfiguration: {
            LocationConstraint: req.body.Region
        }
    };
    
    s3.createBucket(params, function(err,data) {
        if(err) {
            if(err = 'BucketAlreadyOwnedByYou') {
                res.send("Bucket ya existe");
            } else {
                console.log(err, err.stack);
            }
        } else {
            console.log(err);
            res.send("Bucket Creado");
        }
    });
});

router.post('/:bucket', function(req,res) {
    
    if(!req.files) {
        res.send("No files in post");
    }
    
    console.log(req.files);
    
    var base64data = new Buffer(req.files.file.data, 'binary');
    
    var params = {
        Bucket: req.params.bucket,
        Key: req.files.file.name,
        Body: base64data
    };
    
    s3.putObject(params,function(err,data){
        if(err) {
            console.log(err, err.stack);
            res.send(err);
        }  else {
            res.send(data.ETag);
        }
    });
    
});

module.exports = router;
