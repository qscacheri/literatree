<script lang="ts">
	import Branch from './Branch.svelte';
	import type { Branch as BranchType } from '../../lib/createTree';
	import { readAsDataUrl } from '../../lib/readAsDataUrl';
	import { onMount } from 'svelte';

	export let branches: BranchType[] = [];
	export let centralHue: number;
	export let drawGreyScale: boolean;
	export let maxLevels: number;

	export let svgRef: SVGSVGElement | null = null;
	let groupRef: SVGGElement | null = null;
	let transform = { scale: 1, x: 0, y: 0 };
	let transformString = '';

	let svgDefs = '<defs></defs>';
	$: console.log(svgDefs);
	$: viewBox = svgRef ? `0 0 ${svgRef.clientWidth} ${svgRef.clientHeight}` : '0 0 1 1';
	$: {
		// putting this here triggers svelte's reactivity. DO NOT REMOVE
		if (groupRef && svgRef && maxLevels) {
			const { width, height, x, y } = groupRef.getBBox();
			const scale = Math.min(svgRef.clientWidth / width, svgRef.clientHeight / height);
			const newWidth = width * scale;
			const newHeight = height * scale;
			const newX = (svgRef.clientWidth - newWidth) / 2;
			const newY = (svgRef.clientHeight - newHeight) / 2;

			transform.scale = scale;
			transformString = `translate(${newX}, ${newY}) scale(${scale}) translate(${-x}, ${-y})`;
		}
	}
</script>

<svg class="tree" {viewBox} bind:this={svgRef}>
	{#if branches.length > 0}
		<g bind:this={groupRef} transform={transformString}>
			{#each branches as branch}
				<Branch
					{drawGreyScale}
					{centralHue}
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

<style>
	.tree {
		width: 100%;
		height: 100%;
		background-color: #eee;
		position: relative;
	}
</style>
