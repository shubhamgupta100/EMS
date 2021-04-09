const mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://shubham:q5dbyxGMI8syIP5p@cluster0.8reo2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb://localhost/Employees');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We are connected")
});