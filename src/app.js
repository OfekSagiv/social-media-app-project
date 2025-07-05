const express = require('express');
const path = require('path');
const viewRoutes = require('./routes/view.routes');
const apiRoutes = require('./routes/api.routes');
const { sessionMiddleware } = require('./middleware/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionMiddleware);
app.use(express.json());

app.use('/', viewRoutes);
app.use('/api', apiRoutes);

module.exports = app;
