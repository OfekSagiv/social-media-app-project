const express = require('express');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const groupRoutes = require('./routes/group.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();


app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);
app.use(express.static('src/public'));

app.get('/signup', (req, res) => {
  res.render('signup'); 
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;


