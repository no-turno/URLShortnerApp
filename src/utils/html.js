export const html = String.raw

/**
 *
 * @param {{ meta: Record<string, any>, children: any }} props
 * @returns
 */
export const Page = (props) => {
	const { meta, children } = props;
	const lang = "lang" in meta ? meta.lang : "en";
	const title = "title" in meta ? meta.title : process.env.APP_TITLE;
	const description = "description" in meta ? meta.description : "";
	const page = html`
	<!DOCTYPE html>
	<html lang="${lang}">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta name="description" content=""/>
			<title>${title}</title>
		</head>
		<body data-id="body"></body>
	</html>`;

	const transformer = new HTMLRewriter()
		.on("meta[name='description']", {
			element(element) {
				if (props.meta.description) {
					element.setAttribute("content", description);
				}
			},
		})
		.on('*[data-id="body"]', {
			element(element) {
				element.setInnerContent(children, {
					html: true,
				});
			},
		});

	return transformer.transform(new Response(page));
};
