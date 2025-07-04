const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const groupRoutes = require('./routes/group.routes');
const notificationRoutes = require('./routes/notification.routes');
const authRoutes = require('./routes/auth.routes');
const viewRoutes = require('./routes/view.routes');
const { sessionMiddleware } = require('./middleware/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionMiddleware);
app.use(express.json());

app.use('/', viewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);

module.exports = app;


