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
	centralHue: number;
}

export const createTree = (
	text: string,
	centralHue: number,
	width: number,
	height: number
): Branch[] => {
	const words = text.split(/\s+/);
	const branches = { value: [] as Branch[] };
	const level = 10;
	let wordCounter = 0;
	const createBranch = ({
		words,
		word,
		branches,
		x,
		y,
		angle,
		fontSize,
		centralHue,
		branchLevel
	}: CreateBranchArgs): void => {
		if (fontSize < 20 || wordCounter >= words.length - 1) return;
		const currentWord = words[wordCounter];
		const branchLength = glyphSize * currentWord.length * (fontSize / 30);
		const leftAngle = angle - (22 - branchLevel * 1.1);
		const rightAngle = angle + (22 - branchLevel * 1.1);
		const { x: nextX, y: nextY } = getXYFromDistWithAngle(x, y, angle, branchLength);

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

		wordCounter++;

		createBranch({
			words,
			word: word + 1,
			branches,
			x: nextX,
			y: nextY,
			angle: leftAngle,
			fontSize: fontSize - 1,
			branchLevel: branchLevel - 1,
			centralHue
		});
		createBranch({
			words,
			word: word + 2,
			branches,
			x: nextX,
			y: nextY,
			angle: rightAngle,
			fontSize: fontSize - 1,
			branchLevel: branchLevel - 1,
			centralHue
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
		branchLevel: level,
		centralHue
	});
	return branches.value;
};

const glyphSize = 14;

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
	const sScaled = satScale(s);
	const lScaled = lightScale(l);
	const interpolator = interpolateRgb(
		'#6A4B28',
		color(`hsl(${hScaled}, ${sScaled}%, ${lScaled}%)`)?.formatHex() || '#ffffff'
	);
	return interpolator(index / 12);
}
