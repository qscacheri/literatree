import { color } from 'd3-color';
import { scaleLinear } from 'd3-scale';
export type Branch = {
	index: number;
	x: number;
	y: number;
	angle: number;
	length: number;
	fontSize: number;
	branchLevel: number;
	word: string;
	color: string;
};

interface CreateBranchArgs {
	measuringEl: HTMLDivElement;
	words: string[];
	word: number;
	branches: { value: Branch[] };
	x: number;
	y: number;
	angle: number;
	fontSize: number;
	branchLevel: number;
	centralHue: number;
}

export const createTree = (text: string, centralHue: number): Branch[] => {
	const measuringEl = document.createElement('div');
	const words = text.split(/\s+/);
	const branches = { value: [] as Branch[] };
	createBranch({
		words,
		branches,
		word: 0,
		x: 400,
		y: 600,
		angle: 90,
		fontSize: 30,
		measuringEl,
		branchLevel: 0,
		centralHue
	});
	return branches.value;
};

const createBranch = ({
	measuringEl,
	words,
	word,
	branches,
	x,
	y,
	angle,
	fontSize,
	centralHue,
	branchLevel = 0
}: CreateBranchArgs): void => {
	const currentWord = words[word];
	// const branchLength = 56;
	const branchLength = getTextWidth(currentWord, fontSize);
	const leftAngle = angle - (22 - branchLevel * 1.1);
	const rightAngle = angle + (22 - branchLevel * 1.1);
	const { x: nextX, y: nextY } = getXYFromDistWithAngle(x, y, angle, branchLength);
	if (branchLevel === 12) return;

	branches.value.push({
		index: word,
		x,
		y,
		angle,
		length: branchLength,
		fontSize,
		branchLevel,
		word: currentWord,
		color: getColor(centralHue)
	});
	createBranch({
		measuringEl,
		words,
		word: word + 1,
		branches,
		x: nextX,
		y: nextY,
		angle: leftAngle,
		fontSize: fontSize - 1,
		branchLevel: branchLevel + 1,
		centralHue
	});
	createBranch({
		measuringEl,
		words,
		word: word + 2,
		branches,
		x: nextX,
		y: nextY,
		angle: rightAngle,
		fontSize: fontSize - 1,
		branchLevel: branchLevel + 1,
		centralHue
	});
	return;
};

function getTextWidth(text: string, fontSize: number) {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	if (!context) return 0;
	context.font = `${fontSize}px sans-serif`;

	return context.measureText(text).width;
}

export const degToRad = (deg: number) => {
	return deg * (Math.PI / 180);
};

function getXYFromDistWithAngle(
	x: number,
	y: number,
	angle: number,
	distance: number
): { x: number; y: number } {
	const targetX = x + Math.cos(degToRad(angle)) * distance;
	const targetY = y + -Math.sin(degToRad(angle)) * distance;
	return { x: targetX, y: targetY };
}

function getColor(centralHue: number) {
	const hueScale = scaleLinear()
		.domain([0, 1])
		.range([centralHue - (30 % 360), centralHue + (30 % 360)]);

	const satScale = scaleLinear().domain([0, 1]).range([70, 90]);

	const lightScale = scaleLinear().domain([0, 1]).range([10, 90]); // 90

	const h = hueScale(Math.random());
	const s = satScale(Math.random());
	const l = lightScale(Math.random());
	return color(`hsl(${h}, ${s}%, ${l}%)`)?.formatHex() || '#ff0000';
}
