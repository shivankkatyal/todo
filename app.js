const express = require('express');
// Path is require to get the location of our view folder 
const path = require('path');
const port = 8000;

// connecting database
const db = require('./config/mongoose');
const Task = require('./models/task');

// This is app variable will have all the functionality of above 2 lines of code
const app = express();

// It is require to set up our template engine
app.set('view engine','ejs');

// Using middleware to add the css folder in home.ejs file
app.use(express.static('views'));

// This step will give the path of our view page
//dirname make our folder dynamic and look out for folder name views
app.set('views',path.join(__dirname,'views')); 

//  Middleware 
app.use(express.urlencoded());


// creating an TODO List
// creating an controller for displaying are todo list
app.get('/', async (req, res) => {
  try {
    const todoList = await Task.find({});
    res.render('home', {
      title: "TODO App",
      todo_list: todoList,
    });
  } catch (err) {
    console.error('Error in fetching tasks from db:', err);
    // Handle the error appropriately, e.g., send an error response
    res.status(500).send('Error fetching tasks');
  }
});
// creating an Todo List Task 
app.post('/create-todoList', async (req, res) => {
    try {
      const newTask = await Task.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        date: req.body.date,
      });
  
      console.log('********', newTask);
      res.redirect('back');
    } catch (err) {
      console.error('Error creating task:', err);
      // Handle the error appropriately, e.g., send an error response
      res.status(500).send('Error creating task');
    }
});


// creating an delete
app.get('/delete-todoList',async (req,res) =>{
    try{
        const ids = Object.keys(req.query);

        // Iterate through IDs and delete tasks concurrently
        await Promise.all(
          ids.map(async (id) => {
            try {
              await Task.findByIdAndDelete(id);
            } catch (err) {
              console.error(`Error deleting task with ID ${id}:`, err);
              // Optionally handle individual errors here
            }
          })
        );
    
        res.redirect('back');
    } catch (err) {
    console.error('Error deleting tasks:', err);
    // Handle overall error, e.g., send an error response
    res.status(500).send('Error deleting tasks');
    }
});


app.listen(port, function (error) {
    if (error) {
        console.log("Error in running the server", error);
    }
    console.log("Yup!My Express Server is runnig on Port", port);
})