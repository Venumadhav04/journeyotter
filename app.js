const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const TodoList = require('./models/todolist')
const methodOverride = require('method-override');


// Mongoose setup
const dbURI = 'mongodb://localhost:27017/my_database';

mongoose.connect(dbURI, {
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to local MongoDB');
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Middleware
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Parse form data
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/todolist', async (req, res) => {
    try {
        const todos = await TodoList.find(); // Fetch all documents from the 'Todo' collection
        res.render('todos', { todos });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data' });
    }
})

app.get('/todolist/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const todos = await TodoList.findById(id); // Fetch all documents from the 'Todo' collection
        console.log(todos);
        res.render('todoDetails', { todos });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data' });
    }
})

app.post('/todolist', async (req, res) => {
    const { title, description, todotime } = req.body;
    const newTodo = await TodoList.create({ title, description, todotime });
    await newTodo.save();
    res.status(201).redirect('/todolist');
});

// PUT route to handle form submission and update the todo in the database
app.put('/todolist/:id', async (req, res) => {
    const todoId = req.params.id;
    const { title, description, todotime } = req.body;

    try {
        // Find the todo by ID and update it
        const updatedTodo = await TodoList.findByIdAndUpdate(
            todoId,
            { title, description, todotime }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.redirect('/todolist');
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo' });
    }
});

// DELETE route to remove data
app.delete('/todolist/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Find the document by ID and delete it
        const deletedTodo = await TodoList.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        console.log(deletedTodo);
        res.redirect('/todolist');
    } catch (error) {
        res.status(500).json({ message: 'Error deleting data' });
    }
});

app.listen(3000, () => {
    console.log(`Server started on http://localhost:3000`);
});