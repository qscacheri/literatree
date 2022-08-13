<script lang="ts">
	import { onMount } from 'svelte';
	import FileDrop from '../components/FileDrop.svelte';
	import Spinner from '../components/Spinner.svelte';
	import Tree from '../components/Tree/Tree.svelte';
	import type { Branch } from '../lib/createTree';
	import { readFile } from '../lib/readFile';
	let branches: Branch[] = [];

	let creating = false;

	async function handleDrop(e: CustomEvent<File>) {
		branches = [];
		const file = e.detail;
		const text = await readFile(file);
		creating = true;
		worker?.postMessage({ text, width: containerWidth, height: containerHeight });
	}

	let worker: Worker | undefined = undefined;

	const loadWorker = async () => {
		const Worker = await import('$lib/worker?worker');
		worker = new Worker.default();
		worker.onmessage = (e) => {
			creating = false;
			branches = e.data;
		};
	};

	let centralHue: number = 110;

	let containerWidth = 0;
	let containerHeight = 0;

	onMount(loadWorker);
</script>

<div class="container">
	<header>Literatree</header>
	<div class="tree-container" bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}>
		<div class="controls">
			<label for="central-hue">Color</label>
			<input
				name="central-hue"
				class="central-hue"
				bind:value={centralHue}
				type="range"
				min={0}
				max={360}
				step={1}
			/>
		</div>
		{#if creating}
			<div class="overlay">
				<Spinner />
			</div>
		{/if}
		<Tree {branches} canvas={false} {centralHue} />
	</div>
	<FileDrop on:drop={handleDrop} />
</div>

<style>
	header {
		padding-left: 1rem;
		color: white;
		font-size: 4em;
		font-family: 'AppleTree';
		height: 100%;
		width: 100%;
		background-color: black;
	}
	.central-hue {
		-webkit-appearance: none;
		height: 4px;
		width: 24rem;
		margin-left: 1rem;
		background-color: black;
		border-radius: 2px;
	}
	.central-hue::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 25px;
		height: 25px;
		border-radius: 100%;
		background: white;
		cursor: pointer;
	}

	.central-hue::-moz-range-thumb {
		width: 25px;
		height: 25px;
		border-radius: 100%;
		background: white;
		cursor: pointer;
	}
	.controls {
		margin: 2rem;
		display: flex;
		align-items: center;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 999;
	}

	.container {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 4rem repeat(3, minmax(0, 1fr));
		flex-direction: column;
		background-color: #eee;
		width: 100vw;
		height: 100vh;
	}
	.tree-container {
		position: relative;
		height: 100%;
		width: 100%;
		background-color: #eee;
		grid-row: span 2;
	}
	.overlay {
		position: absolute;
		z-index: 999;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: none;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
