import { createTree } from './createTree';

onmessage = (message) => {
	const { words, width, height, maxLevels } = message.data;
	console.log(message.data);
	const branches = createTree(words, width, height, maxLevels);
	postMessage(branches);
};

export {};
