const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  // Array of ObjectIds to support Group Tasks
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  dueDate: Date,
  comments: [{
    text: String,
    userName: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);