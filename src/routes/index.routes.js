const fs = require('fs');
const path = require('path');
const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
	const images = fs.readdirSync(path.join(__dirname, '../public/uploads'));
	console.log(images);
	res.render('index', { images });
});

router.post('/upload', (req, res) => {
	res.redirect('/');
});

module.exports = router;
