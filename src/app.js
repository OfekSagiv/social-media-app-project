const express = require('express');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const groupRoutes = require('./routes/group.routes');
const notificationRoutes = require('./routes/notification.routes');
const authRoutes = require('./routes/auth.routes');
const { sessionMiddleware } = require('./middleware/auth');

const app = express();
app.use(sessionMiddleware);
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;


