<script lang="ts">
	import { onMount } from 'svelte';

	import Branch from '../components/Branch.svelte';
	import { createTree, type Branch as BranchType } from '../lib/createTree';
	import { exampleText } from '../lib/exampleText';
	let branches: BranchType[] = [];
	let calculatingSize = true;
	let container: SVGGElement | null = null;
	let transform = { scale: 1, x: 0, y: 0 };
	let transformString = '';
	$: {
		if (container) {
			// scale group to fit inside svg
			const { width, height, x, y } = container.getBoundingClientRect();
			console.log(width, height, { x, y });
			const scale = Math.min(800 / width, 800 / height);
			console.log({ scale });
			transform.scale = scale;
			const newWidth = width * scale;
			const newHeight = height * scale;

			transformString = `translate(${-x - width / 2} ${
				-y - height / 2
			}) scale(${scale}) translate(${800 - newWidth} ${800 - newHeight})`;
			// transform.x = (container.clientWidth - container.scrollWidth * scale) / 2;
			// transform.y = (container.clientHeight - container.scrollHeight * scale) / 2;
		}
	}

	// onMount(() => {
	// 	const resizeObserver = new ResizeObserver((entries) => {
	// 		// We're only watching one element
	// 		const entry = entries.at(0);

	// 		//Get the block size
	// 		const { x, y, width, height } = (entry?.target as SVGGElement).getBoundingClientRect();

	// 		if (width > height) {
	// 			const scale = 800 / width;
	// 			const newWidth = width * scale;
	// 			const newHeight = height * scale;
	// 			const targetX = 0 - x;
	// 			const targetY = 400 - y;
	// 			transform = {
	// 				scale: newWidth / width,
	// 				x: targetX,
	// 				y: targetY - newHeight / 2
	// 			};
	// 		} else {
	// 			const scale = 800 / height;
	// 			const newWidth = width * scale;
	// 			const newHeight = height * scale;
	// 			const targetX = 400 - x;
	// 			const targetY = 400 - y;
	// 			transform = {
	// 				scale: newWidth / width,
	// 				x: targetX,
	// 				y: targetY - newHeight / 2
	// 			};
	// 		}
	// 	});

	// 	resizeObserver.observe(container!);

	// 	// This callback cleans up the observer
	// 	return () => resizeObserver.unobserve(container!);
	// });
</script>

<div class="container">
	<button
		on:click={() => {
			branches = createTree(exampleText, 110);
		}}>Create</button
	>

	<input type="range" min="0" max="300" bind:value={transform.x} />
	<div>{transform.x}</div>
	<input type="range" min="-100" max="100" bind:value={transform.y} />
	<svg class="tree" viewBox="0 0 800 800">
		{#if branches.length > 0}
			<g bind:this={container} transform={transformString}>
				x={0}
				y={0}
				>
				{#each branches as branch}
					<Branch
						delay={false}
						index={branch.index}
						color={branch.color}
						x={branch.x}
						y={branch.y}
						angle={branch.angle}
						fontSize={branch.fontSize}
						word={branch.word}
					/>
				{/each}
			</g>
		{/if}
	</svg>

	<!-- {#if calculatingSize}
	<svg class="tree size-calculator" viewBox="0 0 800 800">
		<g bind:this={container} fill="pink" style="background: red;" x={0} y={0}>
			{#each branches as branch}
				<Branch
					delay={false}
					index={branch.index}
					color={branch.color}
					x={branch.x}
					y={branch.y}
					angle={branch.angle}
					fontSize={branch.fontSize}
					word={branch.word}
				/>
			{/each}
		</g>
	</svg>
{/if} -->
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	.size-calculator {
		/* visibility: hidden; */
	}
	g {
		/* transform-origin: 50% 50%; */
		outline: solid 3px blue;
		outline-offset: 5px;
	}
	.tree {
		width: 800px;
		height: 800px;
		background-color: #eee;
		position: relative;
	}
</style>
