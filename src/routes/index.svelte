<script lang="ts">
	import { onMount } from 'svelte';
	import FileDrop from '../components/FileDrop.svelte';
	import Tree from '../components/Tree.svelte';
	import { createTree, type Branch } from '../lib/createTree';
	import { exampleText } from '../lib/exampleText';
	import { readFile } from '../lib/readFile';
	let branches: Branch[] = [];

	async function handleDrop(e: CustomEvent<File>) {
		const file = e.detail;
		const text = await readFile(file);
		console.log({ text });
		branches = createTree(text as string, 110);
	}
</script>

<div class="container">
	<div class="tree-container">
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
		height: 100%;
		width: 100%;
		background-color: red;
		grid-row: span 2;
	}
</style>
