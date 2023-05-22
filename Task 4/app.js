const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/todo_list', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define a schema and model for the ToDoItem
const todoItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const ToDoItem = mongoose.model('ToDoItem', todoItemSchema);

// Create the Express app
const app = express();
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define the API routes
app.get('/api/todo', async (req, res) => {
  try {
    const todoItems = await ToDoItem.find();
    res.json(todoItems);
  } catch (error) {
    console.error('Error fetching todo items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/todo', async (req, res) => {
  try {
    const { title } = req.body;
    const todoItem = new ToDoItem({ title });
    await todoItem.save();
    res.status(201).json(todoItem);
  } catch (error) {
    console.error('Error creating todo item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/todo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const todoItem = await ToDoItem.findByIdAndUpdate(id, { completed }, { new: true });
    res.json(todoItem);
  } catch (error) {
    console.error('Error updating todo item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/todo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ToDoItem.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting todo item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
