<script lang="ts">
	export let on = true;
	export let centralHue = 360;
	function getOnColor(centralHue: number) {
		return `hsl(${centralHue}, 100%, 50%)`;
	}
	$: onColor = getOnColor(centralHue);
</script>

<div class="container" on:click={() => (on = !on)}>
	<div class="thumb" style={`--on-color: ${onColor};`} class:on />
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		width: 4rem;
		height: 2rem;
		background-color: white;
		padding: 2px;
		border-radius: 4rem;
		cursor: pointer;
		transform: translate3d(0, 0, 0);
	}
	.thumb.on {
		transform: translate3d(calc((2rem + 0.75rem) - 8px), 0, 0);
		background-color: black;
	}
	.thumb {
		background-color: var(--on-color);
		outline-color: var(--on-color);
		transition: transform 0.2s;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 100%;
	}
</style>
