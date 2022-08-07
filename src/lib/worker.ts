import { createTree } from './createTree';

onmessage = (message) => {
	const text = message.data;
	const branches = createTree(text, 110);
	console.log({ branches });
	postMessage(branches);
};

export {};
