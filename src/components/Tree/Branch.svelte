<script lang="ts">
	import { getColor } from '../../lib/createTree';

	export let index: number;
	export let angle: number;
	export let x: number;
	export let y: number;
	export let fontSize: number;
	export let word: string;
	export let color: { h: number; s: number; l: number };
	export let centralHue: number;
	export let delay = true;
	export let drawGreyScale: boolean;

	let hidden = delay;
	if (delay)
		setTimeout(() => {
			hidden = false;
		}, 300 * index);
</script>

<text
	class:hidden
	class="branch"
	style={`font-size: ${fontSize}`}
	{x}
	{y}
	transform={`rotate(${360 - angle}, ${x}, ${y})`}
	fill={getColor(centralHue, drawGreyScale, index, color.h, color.s, color.l)}
>
	{word}
</text>

<style>
	text {
		font-family: 'Roboto Mono', monospace;
	}
	.branch {
		opacity: 1;
	}
	.hidden {
		opacity: 0;
	}
</style>
