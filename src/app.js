const express = require('express');
const path = require('path');
const viewRoutes = require('./routes/view.routes');
const apiRoutes = require('./routes/api.routes');
const { sessionMiddleware, attachUser } = require('./middleware/auth');
const userRoutes = require('./routes/user.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


app.use(sessionMiddleware);
app.use(attachUser);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(express.json());

app.use('/', viewRoutes);
app.use('/api', apiRoutes);

module.exports = app;
