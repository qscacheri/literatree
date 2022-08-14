<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Spacer from './Spacer.svelte';
	import Switch from './Switch.svelte';
	export let drawGreyScale: boolean;
	export let centralHue: number;
	export let maxLevels: number;
	let dispatch = createEventDispatcher();
</script>

<div class="controls">
	<div class="control-group">
		<label for="central-hue">Color</label>
		<Spacer />
		<input
			disabled={drawGreyScale}
			name="central-hue"
			bind:value={centralHue}
			type="range"
			min={0}
			max={360}
			step={1}
		/>
	</div>
	<div class="control-group">
		<label for="max-levels">Max Levels</label>
		<Spacer />
		<input
			disabled={drawGreyScale}
			name="max-levels"
			bind:value={maxLevels}
			type="range"
			min={1}
			max={10}
			step={1}
		/>
	</div>
	<div class="control-group">
		<label for="">Draw Grey Scale</label>
		<Spacer />
		<Switch bind:on={drawGreyScale} {centralHue} />
	</div>
	<div class="control-group">
		<button
			on:click={() => {
				dispatch('randomize');
			}}
		>
			Randomize</button
		>

		<button
			on:click={() => {
				dispatch('export');
			}}>Export</button
		>
	</div>
</div>

<style>
	.controls {
		margin: 2rem;
		align-items: center;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 999;
	}
	.control-group {
		gap: 0.5rem;
		margin: 1rem 0;
		display: flex;
		align-items: center;
	}
</style>
