<script lang="ts">
	import type { Branch } from '$lib/createTree';
	import P5Tree from './P5Tree.svelte';
	import SvgTree from './SVGTree.svelte';
	export let branches: Branch[];
	export let canvas = false;
	export let drawGreyScale: boolean;
	export let centralHue: number;
	export let maxLevels: number;
	export let svgRef: SVGSVGElement | null;
</script>

{#if canvas}
	<P5Tree {branches} />
{:else}
	<SvgTree {branches} {centralHue} {drawGreyScale} {maxLevels} bind:svgRef />
{/if}
