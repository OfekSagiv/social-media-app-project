const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user.routes');
const groupRoutes = require('./routes/group.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

app.get('/login', (req, res) => {
  res.render('login');  // מציג את ה-login.ejs
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;



