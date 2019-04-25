const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
     name:{type:String, required:true},
     price:{type:Number, required:true},
     manufacturer:{type:String, required:true},
     code:{type:String, required:true}
});

//create product model
const model = mongoose.model('product', productSchema);
module.exports = model;