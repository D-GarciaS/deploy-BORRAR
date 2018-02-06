var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var s3 = new aws.S3();

var fileUpload = require('express-fileupload');
router.use(fileUpload());


router.get('/', function(req, res) {
  s3.listBuckets({},function(err,data) {
      if(err) {
          console.log(err);
          throw err;
      }
      res.render('listBuckets', { buckets: data.Buckets});
      console.log('end');
  });
});

router.get('/:bucket', function(req, res) {
    s3.listObjects({Bucket: req.params.bucket},function(err,data){
        if(err) {
            throw err;
        }
        console.log(data.Contents);

        res.render('listObjects', { bucket:req.params.bucket, objects: data.Contents});
    });
});


router.get('/:bucket/:key', function(req, res) {
    
    /*
     * @TODO - Programa la logica para obtener un objeto en especifico
     * es importante a la salida enviar el tipo de respuesta y el contenido
     * 
     * Ejemplo de esto:
     *     res.type(...) --> String de content-type
     *     res.send(...) --> Buffer con los datos.
     */    
    var param = {Bucket: req.params.bucket,Key:req.params.key};

    s3.getObject(param, function(err,data){
        if(err)
            throw err;
        console.log( data);
        console.log( data.Body);
        res.type(data.ContentType);
        
        res.send(data.Body);
    });
});


router.post('/', function(req,res) {
    /*
     * @TODO - Programa la logica para crear un Bucket.
    */
    console.log(req.body);

    var params = {
        Bucket: req.body.name,
        CreateBucketConfiguration:{
            LocationConstraint: 'us-west-2'
        }
    };
    
    s3.createBucket(params, function(err,data){
        if(err){
            if(err.code == 'BucketAlreadyOwnedByYou' 
                || err.code =='BucketAlreadyExists'){
                console.log("El bucket ya existe");

            }else{
                console.log(err,err.stack);
            }
        }else{
            console.log('bucket creado');
            res.render('bucketCreado', {});
        }
    });
});

router.post('/:bucket', function(req,res) {

    /*
     * @TODO - Programa la logica para crear un nuevo objeto.
     * TIPS:
     *  req.files contiene todo los archivos enviados mediante post.
     *  cada elemento de files contiene multiple información algunos campos
     *  importanets son:
     *      data -> Buffer con los datos del archivo.
     *      name -> Nombre del archivo original
     *      mimetype -> tipo de archivo.
     *  el conjunto files dentro del req es generado por el modulo 
     *  express-fileupload
     *  
    */

    var bucketName = req.params.bucket;

    console.log(req.files.file.mimetype);


    var params = {
        Bucket: bucketName,
        Key: req.files.file.name,
        Body: req.files.file.data,
        ContentType: req.files.file.mimetype
    };

    s3.putObject(params, function(err,data){
        if(err){
            console.log(err,err.stack);
            throw err;
        }
        else{
            console.log('Archivo agregado... ETag:' + data.ETag);
            res.render('archivoCreado', {bucket: bucketName});
        }
    });
});
   

module.exports = router;
