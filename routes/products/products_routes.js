const express = require('express');
const validator = require('express-validator/check');
//const { check, validationResult } = require('express-validator/check');
const product = require('../../models/products/product_model');


const router = express.Router();

/*Routes defined below*/

/*GET*/

/*get and display all products*/
router.get('/', (req, res) =>{
    
    product.find()
    .sort({manufacturer:"1"})
    .then((record) =>{
        let message = "No products to display";
        res.render('./products/products', {product:record, empty:message});
    })
    .catch((error) => res.json(error));   
});

/*get and display one product*/
router.get('/item/:id', (req, res) =>{
     
    const {id} = req.params;

    product.findOne({_id:id})
    .then((record) =>{
         res.render('./products/single-product',{product:record})
    })
    .catch(error => res.json(error)); 
});

/*edit products*/
router.get('/edit', (req, res) =>{
    product.find()
    .then((record) =>{
        let message = "No products to display";
         res.render('./products/edit-products',{product:record, message:message})
    })
    .catch(error => res.json(error));
  
});

/*add new item*/
router.get('/add', (req, res) =>{
    res.render('./products/add-products');
});

/*POST*/
router.post('/', [
   validator.check('name', 'Please enter a product').not().isEmpty(),
   validator. check('name', 'Product must be @least 2 characters').isLength({min:2}),
   validator.check('price', 'Please enter the price').not().isEmpty(),
   validator.check('price', 'Price must be a numeric value').isNumeric(),
   validator.check('manufacturer', 'verify manufacturer name').isLength({min:2}),
   validator.check('code', 'Please enter product code').not().isEmpty()
], (req, res) =>{

    //get validation result
    const errors = validator.validationResult(req);
    
    if(!errors.isEmpty()) /*errors are present*/
    {  
        req.flash('fail', errors.array());
        res.redirect('/products/add');
    }
    else if(errors.isEmpty())
    {
         //extract data from req body
         const {name, price, manufacturer, code} = req.body;

         let newProduct = new product({
            name:name,
            price:price,
            manufacturer:manufacturer,
            code:code
       });
       
       //save to database
       newProduct.save()
       .then((message) => {
           req.flash('success', 'Product successfully added');
           res.redirect('/products/');
       })
       .catch((error) => res.json(error));
    }    
});

/*PUT*/
router.put('/:id', [
    validator.check('name', 'Please enter a product').not().isEmpty(),
   validator. check('name', 'Product must be @least 2 characters').isLength({min:2}),
   validator.check('price', 'Please enter the price').not().isEmpty(),
   validator.check('price', 'Price must be a numeric value').isNumeric(),
   validator.check('manufacturer', 'verify manufacturer name').isLength({min:2}),
   validator.check('code', 'Please enter product code').not().isEmpty()
], (req, res) =>{

    const errors = validator.validationResult(req);

    if(!errors.isEmpty())
    {
        req.flash('fail', errors.array());
        res.redirect('/products/edit');
        
    }
    else if(errors.isEmpty())
    {
        const {id} = req.params;
        const {name, price, manufacturer, code} = req.body;

        product.update({_id:id}, {$set:{name:name, price:price, manufacturer:manufacturer, code:code}})
        .then((record) =>{
        req.flash('success', 'Products updated successfully');
           res.redirect('/products/edit');
        })
        .catch(error => res.json(error));
    }

});


/*DELETE*/
router.delete('/:id', (req, res) =>{
     const {id} = req.params;
     product.remove({_id:id})
     .then((record) => {
         //res.json(record)
         req.flash('success', 'Product successfully removed');
         res.redirect('/products/');
     })
     .catch(errors => res.json(errors));
});

//export product routes
module.exports = router;