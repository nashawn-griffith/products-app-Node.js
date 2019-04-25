const express = require('express');
const order = require('../../models/orders/order_model');
const product = require('../../models/products/product_model');
const validator = require('express-validator/check');
const router = express.Router();

/*Routes defined below*/

/*GET*/

/*get and display all orders*/
router.get('/', (req, res) =>{ 
    order.find()
    .populate('product', {'_id':0, 'name':1, 'price': 1, 'manufacturer': 1})
    .then((record) =>{
        let message = "No orders to display"
        res.render('./orders/view-orders', {order:record, empty:message});    
    })
    .catch((error) => res.json(error));
});

router.get('/order/:id', (req, res) =>{
     //display form to make order
     const {id} = req.params;

     product.findOne({_id:id})
     .then((record)=>{
        res.render('./orders/add-orders', {record:record});
     })
     .catch(error => res.json(error));  
});

/*POST*/
router.post('/', [
    validator.check('quantity', 'Quantity should be a numeric value').isNumeric()
], (req, res) =>{
    
    const errors = validator.validationResult(req);

    if(!errors.isEmpty())
    {
        let id = req.body.product;

        //res.json(errors.array());
        req.flash('fail', errors.array());
        res.redirect(`/orders/order/${id}`);
    }
    else if(errors.isEmpty())
    {
        const {product,quantity} = req.body;

        if(quantity <= 0)
        {
            let id = req.body.product;
            req.flash('fail_msg', 'Qauntity MUST be greater than zero (0)');
            res.redirect(`/orders/order/${id}`);
        }
        else
        {
            let newOrder = new order({
                product:product,
                quantity:quantity
           });
           
           newOrder.save()
           .then((record) =>{
               req.flash('success', 'Order made successfully');
               res.redirect('/orders');
           })
           .catch(error => res.json(error));
        }

        
    }
});

/*Delete*/
router.delete('/:id', (req, res) =>{

    const {id} = req.params;
    order.remove({_id:id})
    .then((record) =>{
        req.flash('success', 'Order removed');
        res.redirect('/orders/');
    })
    .catch(error => res.json(error));
})





//export order routes
module.exports = router;