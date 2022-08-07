<script lang="ts">
	export let index: number;
	export let angle: number;
	export let x: number;
	export let y: number;
	export let fontSize: number;
	export let word: string;
	export let color: string;
	export let delay = true;

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
	fill={color}
>
	{word}
</text>

<!-- <circle r="5" cx={x} cy={y} fill={color} /> -->
<style>
	text {
		font-family: 'Roboto Mono', monospace;
	}
	.branch {
		opacity: 1;
		transition: all 1s linear;
	}
	.hidden {
		opacity: 0;
	}
</style>
