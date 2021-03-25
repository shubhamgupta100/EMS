var express = require('express');
const empSchema = require('../model/empModel');
const uploadSchema = require('../model/upload');
const passport = require('passport')
const User = require('../model/user');
var router = express.Router();
var multer = require('multer');
const path = require('path');
const { extname } = require('path');
const employee = empSchema.find({});
const imageData = uploadSchema.find({});

router.use(express.static(__dirname + "./public/"));
var storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})
var upload = multer({
  storage: storage,
}).single('avatar')
/* GET home page. */
router.post('/upload', upload, function (req, res, next) {
  var imageName = req.file.filename;
  success = req.file.filename + " Uploaded Successfully !";
  var imageDetail = new uploadSchema({
    imageName: imageName
  });
  imageDetail.save(function (err, doc) {
    if (err) throw err;
    imageData.exec(function (err, data) {
      if (err) throw err;
      res.render('upload-file', { title: 'Upload File', success: success, data: data });
    })
  })
});

router.use('/users', require('./users'));

router.get('/upload',passport.checkAuthentication, function (req, res, next) {
  employee.exec(function (err) {
    if (err) throw err;
    imageData.exec(function (err, data) {
      if (err) throw err;
      res.render('upload-file', { title: 'Upload File', success: '', data: data });
    });
  })
});



router.get('/',passport.checkAuthentication, function (req, res) {
  employee.exec(function (err, data) {
    if (err) throw err;
    res.render('insertEmp', { title: 'Employee Form', data, success: '' });
  })
});

router.post('/', upload, (req, res, next) => {
  empDetail = new empSchema({
    name: req.body.name,
    email: req.body.email,
    eType: req.body.eType,
    hRate: req.body.hRate,
    tHour: req.body.tHour,
    total: parseInt(req.body.hRate) * parseInt(req.body.tHour),
    image: req.file.filename,
  });

  empDetail.save(function (err, response) {
    employee.exec(function (err, data) {
      if (err) throw err;
      res.render('insertEmp', { title: 'Employee Form', data, success: "Data Inserted !" });
    })
  })

  console.log(req.body);

});

router.post('/search/', function (req, res, next) {

  var flrtName = req.body.fltrname;
  var flrtEmail = req.body.fltremail;
  var fltremptype = req.body.fltremptype;

  if (flrtName != '' && flrtEmail != '' && fltremptype != '') {

    var flterParameter = {
      $and: [{ name: flrtName },
      { $and: [{ email: flrtEmail }, { eType: fltremptype }] }
      ]
    }
  } else if (flrtName != '' && flrtEmail == '' && fltremptype != '') {
    var flterParameter = {
      $and: [{ name: flrtName }, { eType: fltremptype }]
    }
  } else if (flrtName == '' && flrtEmail != '' && fltremptype != '') {

    var flterParameter = {
      $and: [{ email: flrtEmail }, { eType: fltremptype }]
    }
  } else if (flrtName == '' && flrtEmail == '' && fltremptype != '') {

    var flterParameter = {
      eType: fltremptype
    }
  } else {
    var flterParameter = {}
  }
  var employeeFilter = empSchema.find(flterParameter);
  employeeFilter.exec(function (err, data) {
    if (err) throw err;
    res.render('insertEmp', { title: 'Employee Form', data, success: '' });
  });
});

router.get('/edit/:id',passport.checkAuthentication, function (req, res, next) {
  var Id = req.params.id;
  var editEmployee = empSchema.findById(Id);
  editEmployee.exec(function (err, data) {
    if (err) throw err;
    res.render('edit', { title: "Edit Employee Record", data });
  })
});

router.post('/update', upload, function (req, res, next) {
  if (req.file) {
    var dataRecord = {
      name: req.body.name,
      email: req.body.email,
      eType: req.body.eType,
      hRate: req.body.hRate,
      tHour: req.body.tHour,
      image: req.file.filename,
      total: parseInt(req.body.hRate) * parseInt(req.body.tHour),

    }
  } else {
    var dataRecord = {
      name: req.body.name,
      email: req.body.email,
      eType: req.body.eType,
      hRate: req.body.hRate,
      tHour: req.body.tHour,
      total: parseInt(req.body.hRate) * parseInt(req.body.tHour),

    }
  }
  var updateEmployee = empSchema.findByIdAndUpdate(req.body.id, dataRecord)
  updateEmployee.exec(function (err) {
    if (err) throw err;
    employee.exec(function (err, data) {
      if (err) throw err;
      // res.redirect('/' )
      res.render('insertEmp', { title: 'Employee Form', data, success: 'Record Updated !' });
    })
  })
});



router.get('/delete/:id', function (req, res, next) {
  var Id = req.params.id;
  var delEmployee = empSchema.findByIdAndDelete(Id);
  delEmployee.exec(function (err) {
    if (err) throw err;
    employee.exec(function (err, data) {
      if (err) throw err;
      res.render('insertEmp', { title: 'Employee Form', data, success: 'Record Deleted !' });
    })
  })
});

module.exports = router;
