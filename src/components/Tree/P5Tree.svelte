<script lang="ts">
	import type p5 from 'p5';
	import P5 from 'p5-svelte';
	import type { Branch } from '../../lib/createTree';

	export let branches: Branch[];

	let target: HTMLElement | undefined = undefined;
	let font: p5.Font | undefined = undefined;

	$: smallestY = branches.reduce((acc, curr) => {
		return Math.min(acc, curr.y);
	}, -100);

	$: console.log({ smallestY });

	const sketch = (p5: p5) => {
		p5.setup = () => {
			console.log('setup');
			p5.createCanvas(target?.clientWidth ?? 0, target?.clientHeight ?? 0);
			font = p5.loadFont('/fonts/RobotoMono-Light.ttf');
		};

		p5.draw = () => {
			p5.background(0, 0, 0);
			const scale = p5.height / (p5.height + Math.abs(smallestY));
			p5.translate(0, -smallestY * 0.5);
			p5.scale(scale);
			branches.forEach((branch) => {
				p5.push();
				if (font) p5.textFont(font);
				p5.textSize(branch.fontSize);
				p5.translate(branch.x, branch.y);
				p5.angleMode(p5.DEGREES);
				p5.rotate(360 - branch.angle);
				p5.fill(branch.color);
				p5.text(branch.word, 0, 0);
				p5.pop();
			});
		};
	};
</script>

<P5 {sketch} bind:target parentDivStyle={`width: 100%; height: 100%`} />
