const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    eType : {
        type:String,
        required:true
    },
    hRate : {
        type:Number,
        required:true
    },
    tHour : {
        type:Number,
        required:true
    },
    total : {
        type:Number,
        required:true
    }
},{
    timestamps:true
});

const Employee = mongoose.model('Employee' , empSchema);
module.exports = Employee;