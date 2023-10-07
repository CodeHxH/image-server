const express = require('express');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const path = require('path');
const multer = require('multer');
const { v4 } = require('uuid');

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, v4() + path.extname(file.originalname).toLocaleLowerCase());
    },
});

// Inicializations
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine(
    '.hbs',
    exphbs({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        extname: '.hbs',
        handlebars: handlebars,
    })
);
app.set('view engine', '.hbs');

// Middlewares
app.use(
    multer({
        storage,
        dest: path.join(__dirname, 'public/uploads'),
        limits: { fileSize: 2000000 },
        fileFilter: (req, file, cb) => {
            const filetypes = /jpeg|jpg|png|gif/;
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(path.extname(file.originalname));
            if (mimetype && extname) {
                return cb(null, true);
            }
            cb('Error: Archivo debe ser una imagen valida');
        },
    }).single('image')
);

// Routes
app.use(require('./routes/index.routes'));

// Statics files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
