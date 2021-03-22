var express = require('express');
const empSchema = require('../model/empModel');
var router = express.Router();
const employee = empSchema.find({});
/* GET home page. */
router.get('/', function(req, res, next) {
  employee.exec(function(err , data){
    if(err) throw err;  
    res.render('insertEmp', { title: 'Employee Form' ,data } );
  })
 
});

router.post('/' , (req , res , next ) => {
  empDetail = new empSchema({
    name:req.body.name,
    email:req.body.email,
    eType:req.body.eType,
    hRate:req.body.hRate,
    tHour:req.body.tHour,
    total:parseInt(req.body.hRate)*parseInt(req.body.tHour),
  });

  empDetail.save(function(err , response){
    employee.exec(function(err , data){
      if(err) throw err;  
      res.render('insertEmp', { title: 'Employee Form' ,data } );
    })
  })
  
  console.log(req.body);
  
});

router.post('/search/', function(req, res, next) {

  var flrtName = req.body.fltrname;
  var flrtEmail = req.body.fltremail;
  var fltremptype = req.body.fltremptype;
  
  if(flrtName !='' && flrtEmail !='' && fltremptype !='' ){

   var flterParameter={ $and:[{ name:flrtName},
  {$and:[{email:flrtEmail},{eType:fltremptype}]}
  ]
   }
  }else if(flrtName !='' && flrtEmail =='' && fltremptype !=''){
    var flterParameter={ $and:[{ name:flrtName},{eType:fltremptype}]
       }
  }else if(flrtName =='' && flrtEmail !='' && fltremptype !=''){

    var flterParameter={ $and:[{ email:flrtEmail},{eType:fltremptype}]
       }
  }else if(flrtName =='' && flrtEmail =='' && fltremptype !=''){

    var flterParameter={eType:fltremptype
       }
  }else{
    var flterParameter={}
  }
  var employeeFilter =empSchema.find(flterParameter);
  employeeFilter.exec(function(err,data){
      if(err) throw err;
      res.render('insertEmp', { title: 'Employee Form' ,data } );
        });
});

router.get('/edit/:id', function(req, res, next) {
  var Id = req.params.id;
  var editEmployee = empSchema.findById(Id);
  editEmployee.exec(function(err , data){
    if(err) throw err;  
    res.render('edit' ,{title :"Edit Employee Record" , data});
  })
});

router.post('/update', function(req, res, next) {
  var updateEmployee = empSchema.findByIdAndUpdate(req.body.id , {
    name:req.body.name,
    email:req.body.email,
    eType:req.body.eType,
    hRate:req.body.hRate,
    tHour:req.body.tHour,
    total:parseInt(req.body.hRate)*parseInt(req.body.tHour),

  })
  updateEmployee.exec(function(err){
    if(err) throw err;  
    res.redirect("/");
  })
});



router.get('/delete/:id', function(req, res, next) {
  var Id = req.params.id;
  var delEmployee = empSchema.findByIdAndDelete(Id);
  delEmployee.exec(function(err ){
    if(err) throw err;  
    res.redirect('/');
  })
});

module.exports = router;
