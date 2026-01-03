const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// CREATE TASK (Group Assignment + Multiple Emails)
router.post('/', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();

    // 1. If users are assigned, fetch their details to send emails
    if (req.body.assignedTo && req.body.assignedTo.length > 0) {
      const users = await User.find({ _id: { $in: req.body.assignedTo } });

      users.forEach(async (user) => {
        const htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #4f46e5; padding: 20px; text-align: center; color: white;">
              <h1 style="margin: 0;">Group Task Assigned!</h1>
            </div>
            <div style="padding: 20px;">
              <p>Hi <strong>${user.name}</strong>,</p>
              <p>You have been assigned to a new group task: <strong>"${savedTask.title}"</strong>.</p>
              <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #4f46e5;">
                <p><strong>Priority:</strong> ${savedTask.priority}</p>
                <p><strong>Due Date:</strong> ${savedTask.dueDate || 'No deadline'}</p>
              </div>
              <a href="http://localhost:5173" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; margin-top: 20px;">Open Task Board</a>
            </div>
          </div>`;
        await sendEmail(user.email, `🎯 New Task: ${savedTask.title}`, "New task assigned", htmlContent);
      });
    }

    // 2. Real-time update via Socket.io
    const io = req.app.get('io');
    io.to(req.body.project.toString()).emit('taskUpdated', savedTask);

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET TASKS FOR PROJECT
router.get('/project/:projectId', async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD COMMENT & NOTIFY ASSIGNEES
router.post('/:id/comments', async (req, res) => {
  try {
    const { text, userName } = req.body;
    const task = await Task.findById(req.params.id).populate('assignedTo');
    
    task.comments.push({ text, userName });
    await task.save();

    // Notify all assigned users about the comment
    task.assignedTo.forEach(async (user) => {
      const html = `<p><strong>${userName}</strong> commented on "${task.title}": <em>"${text}"</em></p>`;
      await sendEmail(user.email, `💬 New Comment: ${task.title}`, "New comment added", html);
    });

    const io = req.app.get('io');
    io.emit('taskUpdated', task);
    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;