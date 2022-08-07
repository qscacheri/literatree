<script lang="ts">
	import { onMount } from 'svelte';
	import FileDrop from '../components/FileDrop.svelte';
	import Spinner from '../components/Spinner.svelte';
	import Tree from '../components/Tree.svelte';
	import type { Branch } from '../lib/createTree';
	import { readFile } from '../lib/readFile';
	let branches: Branch[] = [];

	let creating = false;

	async function handleDrop(e: CustomEvent<File>) {
		const file = e.detail;
		const text = await readFile(file);
		creating = true;
		worker?.postMessage(text);
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

	onMount(loadWorker);
</script>

<div class="container">
	<div class="tree-container">
		{#if creating}
			<div class="overlay">
				<Spinner />
			</div>
		{/if}
		<Tree {branches} />
	</div>
	<FileDrop on:drop={handleDrop} />
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(3, minmax(0, 1fr));
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
