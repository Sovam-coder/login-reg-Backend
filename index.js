const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const userRouter = require('./routes/user.routes');

require('./config/db').dbConnection();

const PORT = process.env.PORT || 3000;

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== 'production') {
    app.use(logger('dev'));
}

app.use('/api/user', userRouter);

app.use((err, req, res, next) => {
    return res.status(500).json({
        message: err.message
    });
});

app.listen(PORT, console.log('Server is running'));