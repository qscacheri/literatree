import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
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
	color: { h: number; s: number; l: number };
};

interface CreateBranchArgs {
	words: string[];
	word: number;
	branches: { value: Branch[] };
	x: number;
	y: number;
	angle: number;
	fontSize: number;
	branchLevel: number;
}

export const createTree = (
	text: string,
	width: number,
	height: number,
	maxBranchLevel: number
): Branch[] => {
	const words = text.split(/\s+/);
	const branches = { value: [] as Branch[] };
	const level = 0;
	let wordCounter = 0;
	const createBranch = ({
		words,
		word,
		branches,
		x,
		y,
		angle,
		fontSize,
		branchLevel
	}: CreateBranchArgs): void => {
		const glyphSize = 18;

		if (branchLevel > maxBranchLevel || wordCounter > words.length - 1) return;

		const currentWord = words[wordCounter];
		const branchLength = glyphSize * currentWord.length * (fontSize / 30);
		const leftAngle = angle - (22 - branchLevel * 1.1);
		const rightAngle = angle + (22 - branchLevel * 1.1);
		const { x: nextX, y: nextY } = getXYFromDistWithAngle(x, y, angle, branchLength);

		wordCounter++;

		branches.value.push({
			index: word,
			x,
			y,
			angle,
			length: branchLength,
			fontSize,
			branchLevel,
			word: currentWord,
			color: { h: Math.random(), s: Math.random(), l: Math.random() }
		});

		createBranch({
			words,
			word: word + 1,
			branches,
			x: nextX,
			y: nextY,
			angle: leftAngle,
			fontSize: fontSize - 1,
			branchLevel: branchLevel + 1
		});

		createBranch({
			words,
			word: word + 2,
			branches,
			x: nextX,
			y: nextY,
			angle: rightAngle,
			fontSize: fontSize - 1,
			branchLevel: branchLevel + 1
		});
	};
	createBranch({
		words,
		branches,
		word: 0,
		x: width / 2,
		y: height,
		angle: 90,
		fontSize: 30,
		branchLevel: level
	});
	return branches.value;
};

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

export function getColor(
	centralHue: number,
	drawGreyScale: boolean,
	index: number,
	h: number,
	s: number,
	l: number
): string {
	const hueScale = scaleLinear()
		.domain([0, 1])
		.range([centralHue - (30 % 360), centralHue + (30 % 360)]);

	const satScale = scaleLinear().domain([0, 1]).range([70, 90]);

	const lightScale = scaleLinear().domain([0, 1]).range([10, 90]); // 90

	const hScaled = hueScale(h);
	const sScaled = drawGreyScale ? 0 : satScale(s);
	const lScaled = lightScale(l);
	const c = color(`hsl(${hScaled}, ${sScaled}%, ${lScaled}%)`)?.formatHex() || '#ffffff';
	const interpolator = interpolateRgb('#6A4B28', c);
	return drawGreyScale ? c : interpolator(index / 12);
}
