const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
   product:{type:mongoose.Schema.Types.ObjectId, ref: 'product', required:true},
   quantity:{type:Number, default: 1, required:true},
   date:{type:Date, default:Date.now}
});

const model = mongoose.model('orders', orderSchema);
module.exports = model;
