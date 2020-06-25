const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { stringify } = require('querystring');
const app = express();

app.use(express.json());

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'));

const generateCompliment = async () => {
	const body = await fetch('https://complimentr.com/api').then((res) =>
		res.json()
	);
	return body;
};

app.post('/subscribe', async (req, res) => {
	if (!req.body.captcha)
		return res.json({ success: false, msg: 'Please select captcha' });
	let compliment = await generateCompliment();
	console.log(compliment);
	// Secret key
	const secretKey = '6LdwA6YZAAAAAMmkDQkPT7O4kRSjLC11a6Yl9Mrx';

	// Verify URL
	const query = stringify({
		secret: secretKey,
		response: req.body.captcha,
		remoteip: req.connection.remoteAddress,
	});
	const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

	// Make a request to verifyURL
	const body = await fetch(verifyURL).then((res) => res.json());

	// If not successful
	if (body.success !== undefined && !body.success)
		return res.json({ success: false, msg: 'Failed captcha verification' });

	// If successful
	return res.json({
		success: true,
		msg: 'Captcha passed',
		compliment: compliment.compliment,
	});
});

app.listen(3000, () => console.log('Server started on port 3000'));
