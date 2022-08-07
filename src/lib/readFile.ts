export const readFile = async (file: File) => {
	return new Promise((resolve) => {
		const reader = new FileReader();

		reader.addEventListener('load', () => {
			resolve(reader.result);
		});
		reader.readAsText(file);
	});
};
