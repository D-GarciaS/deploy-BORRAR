var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var s3 = new aws.S3();

var fileUpload = require('express-fileupload');
router.use(fileUpload());


router.get('/', function(req, res) {
  s3.listBuckets({},function(err,data) {
      if(err) {
          throw err;
      }
      console.log(data);
      res.render('listBuckets', { buckets: data.Buckets});
  });
});

router.get('/:bucket/', function(req, res) {

    /*
     * @TODO - Programa la logica para obtener los objetos de un bucket.
     *         Se debe tambien generar una nueblo templade en jade para presentar
     *         esta información. Similar al que lista los Buckets.
     */
    
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
});


router.post('/', function(req,res) {
    /*
     * @TODO - Programa la logica para crear un Bucket.
    */
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
     
});

module.exports = router;
