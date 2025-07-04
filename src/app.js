const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const groupRoutes = require('./routes/group.routes');
const notificationRoutes = require('./routes/notification.routes');
const authRoutes = require('./routes/auth.routes');
const { sessionMiddleware } = require('./middleware/auth');
const { isLoggedIn } = require('./middleware/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionMiddleware);
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);
app.use(express.static('src/public'));

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    const user = req.session?.user;
    if (user) {
        return res.redirect('/home');
    }
    res.redirect('/login');
});

app.get('/home', isLoggedIn, (req, res) => {
    const user = req.session.user;
    res.render('home', {
        fullName: user.fullName,
        user
    });
});

module.exports = app;


