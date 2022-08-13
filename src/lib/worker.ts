import { createTree } from './createTree';

onmessage = (message) => {
	const { text, width, height } = message.data;
	const branches = createTree(text, 110, width, height);
	console.log({ branches });
	postMessage(branches);
};

export {};
