export const shortUrl = () => {
	const [head] = crypto.randomUUID().split("-");
	const id = btoa(head);
	return id;
};
