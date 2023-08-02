const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TodoListSchema = new Schema({
    title: String,
    description: String,
    todotime: String
})

module.exports = mongoose.model('TodoList', TodoListSchema);