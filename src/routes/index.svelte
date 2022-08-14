<script lang="ts">
	import { onMount } from 'svelte';
	import { saveSvgAsPng, svgAsDataUri } from 'save-svg-as-png';
	import Controls from '../components/Controls.svelte';
	import FileDrop from '../components/FileDrop.svelte';
	import Menu from '../components/Menu.svelte';
	import MenuOverlay from '../components/MenuOverlay.svelte';
	import Responsive from '../components/Responsive.svelte';
	import Spacer from '../components/Spacer.svelte';
	import Spinner from '../components/Spinner.svelte';
	import Tree from '../components/Tree/Tree.svelte';
	import type { Branch } from '../lib/createTree';
	import { readFile } from '../lib/readFile';

	let branches: Branch[] = [];

	let creating = false;

	let worker: Worker | undefined = undefined;

	const loadWorker = async () => {
		const Worker = await import('$lib/worker?worker');
		worker = new Worker.default();
		worker.onmessage = (e) => {
			creating = false;
			branches = e.data;
		};
	};

	let centralHue: number = 360;
	let drawGreyScale = false;

	let containerWidth = 0;
	let containerHeight = 0;

	let words = '';
	let maxLevels = 5;
	let showMenu = false;
	let svgRef: SVGSVGElement | null = null;

	function randomize() {
		if (words.length > 0) {
			branches = [];
			worker?.postMessage({
				words,
				width: containerWidth,
				height: containerHeight,
				maxLevels
			});
		}

		worker?.postMessage({
			words,
			width: containerWidth,
			height: containerHeight,
			maxLevels
		});
	}
	async function handleDrop(e: CustomEvent<File>) {
		branches = [];
		const file = e.detail;
		const text = await readFile(file);
		creating = true;
		words = text as string;
	}

	async function exportTree() {
		if (!svgRef) return;

		saveSvgAsPng(svgRef, 'tree.png', {
			fonts: [
				{
					url: 'https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_gPq_ROW4AJi8SJQt.woff2',
					text: `
@font-face {
  font-family: 'Roboto Mono';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_gPq_ROW4AJi8SJQt.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`
				}
			]
		});

		// var serializer = new XMLSerializer();
		// var svgString = serializer.serializeToString(svgRef);
		// console.log(svgString);
		// var canvas = document.createElement('canvas');
		// var ctx = canvas.getContext('2d');
		// canvas.width = 2000;
		// canvas.height = 2000;
		// var img = document.createElement('img');

		// const src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

		// img.setAttribute('src', src);

		// img.onload = function () {
		// 	ctx?.drawImage(img, 0, 0);

		// 	const a = document.createElement('a');
		// 	a.href = canvas.toDataURL('image/png');
		// 	a.download = 'tree.png';
		// 	a.click();
		// 	setTimeout(() => {
		// 		a.remove();
		// 	}, 1000);
		// };
	}

	$: {
		if (words.length > 0)
			worker?.postMessage({ words, width: containerWidth, height: containerHeight, maxLevels });
	}
	onMount(loadWorker);
</script>

<div class="container">
	<header>
		<h1>Literatree</h1>
		<Spacer />
		<Responsive>
			<Menu className="menu" slot="small" on:click={() => (showMenu = !showMenu)} />
		</Responsive>
	</header>
	<div class="tree-container" bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}>
		<Responsive>
			<Controls
				slot="large"
				bind:centralHue
				bind:drawGreyScale
				bind:maxLevels
				on:randomize={randomize}
				on:export={exportTree}
			/>
		</Responsive>

		{#if creating}
			<div class="overlay">
				<Spinner />
			</div>
		{/if}
		<Tree {branches} canvas={false} {centralHue} {drawGreyScale} {maxLevels} bind:svgRef />
	</div>
	<FileDrop on:drop={handleDrop} />
</div>

<MenuOverlay bind:visible={showMenu}>
	<Controls
		bind:centralHue
		bind:drawGreyScale
		bind:maxLevels
		on:randomize={randomize}
		on:export={exportTree}
	/>
</MenuOverlay>

<style>
	header {
		display: flex;
		align-items: center;
		padding-left: 1rem;
		color: white;
		height: 100%;
		width: 100%;
		background-color: black;
	}
	h1 {
		font-size: 4em;
		font-family: 'AppleTree';
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
