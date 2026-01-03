### 1. Create the `.env.example` File

1. In VS Code, right-click in the empty space of your sidebar (ensure you are in the root directory).
2. Select **New File** and name it `.env.example`.
3. Paste this content:

```env
# Backend Configuration
PORT=5000
MONGO_URI=your_mongodb_connection_string_here

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password

```

---

### 2. Create the `README.md` File

1. Create another new file in the root directory and name it `README.md`.
2. Paste this professional content:

```markdown
# 🚀 TaskFlow: Real-Time Collaborative Task Manager

TaskFlow is a full-stack MERN application designed for high-performance team collaboration. It combines a real-time Kanban interface with automated background services to keep teams synchronized.

## 🌟 Key Features
- **Real-Time Board Updates**: Task movements and status changes reflect instantly for all users via **Socket.io**.
- **Multi-Assignee Support**: Assign group tasks to multiple team members simultaneously.
- **Automated Email Notifications**: Uses **Nodemailer** to send professional HTML alerts for assignments and comments.
- **Interactive Discussion**: Real-time comment threads on every task card.
- **Drag-and-Drop Workflow**: Smooth task management powered by `@hello-pangea/dnd`.

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Real-Time**: Socket.io
- **Mailing**: Nodemailer (SMTP)

## ⚙️ Setup Instructions

1. **Clone the Repo**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)

```

2. **Configure Backend**
* Go to `/backend`
* Create a `.env` file and copy keys from `.env.example`
* Run `npm install`
* Run `node server.js`


3. **Configure Frontend**
* Go to `/frontend`
* Run `npm install`
* Run `npm run dev`



## 📧 Note on Emails

To use the email notification system, you must generate a **Google App Password** from your Google Account Security settings.

```



---

### 3. How to Commit and Upload to GitHub
Now, use these terminal commands to save your work and push it to your repository.

**Step A: Add the files to the "Stage"**
```bash
git add README.md .env.example

```

**Step B: Commit the changes**

```bash
git commit -m "docs: add README and env template for team collaboration"

```

**Step C: Push to GitHub**

```bash
git push origin main

```

---

### 4. How to Verify it worked

1. Open your browser and go to your **GitHub Repository URL**.
2. **README:** You should see your formatted documentation (the text from the README) displayed automatically on the home page.
3. **Secrets:** Ensure you **do not** see a `.env` file in the file list. You should only see `.env.example`.
