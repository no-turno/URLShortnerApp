import express from "express";
import db from "../db";
import { shortUrl } from "./utils/url";
import { Page, html } from "./utils/html";

const app = express();

app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.get("/", async (_, res) => {
	res.send(
		await Page({
			meta: {
				lang: "en",
				title: "URL Shortener",
				description: "URL Shortener",
			},
			children: html`
		<h1>URL Shortener</h1>
		<form action="/shorten" method="post">
		  <input type="text" name="longUrl" placeholder="Enter a long URL">
		  <button type="submit">Shorten</button>
		</form>
	  `,
		}).text(),
	);
});

app.post("/shorten", async (req, res) => {
	try {
		const { longUrl } = req.body;
		const url = new URL(longUrl);
		const id = shortUrl();
		const ur = `http://localhost:${process.env.PORT}/${id}`;

		db.query("INSERT INTO urls (short_url, long_url) VALUES (?,?)").all(
			ur,
			url.toString(),
		);

		db.query("SELECT * FROM urls WHERE short_url = ?").get(ur);

		res.send(
			await Page({
				meta: {
					lang: "en",
					title: "URL Shortened",
				},
				children: html`<h1>URL Shortened</h1>
			<p>Short URL: <a href="/${id}">${req.headers.host}/${id}</a></p>
			<p>Long URL: ${longUrl}</p>`,
			}).text(),
		);
	} catch (error) {
		res.send(
			await Page({
				meta: {
					lang: "en",
					title: "Error",
				},
				children: html`
						<h1>Error</h1>

						<pre>
							${error.code}
						</pre>
					`,
			}).text(),
		);
	}
});

app.get("/urls", (_, res) => {
	res.send(db.query("SELECT * FROM urls").all());
});

app.get("/:id", (req, res) => {
	const data = db
		.query("SELECT * FROM urls WHERE short_url = ? ")
		.all(`http://${req.headers.host}/${req.params.id}`);

	res.redirect(data[0].long_url);
});

app.get("/isDatabaseAsExpected", async (_, res) => {
	const result = await new Promise((resolve, reject) => {
		try {
			const data = db
				.query(
					'SELECT name FROM sqlite_master WHERE type="table" AND name="urls"',
				)
				.get();
			resolve(data);
		} catch (error) {
			reject(error);
		}
	});

	res.status(200).send(result);
});

app.listen(process.env.PORT, () => {
	console.log(`http://localhost:${process.env.PORT}`);
});
