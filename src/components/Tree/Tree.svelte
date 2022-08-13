<script lang="ts">
	import type { Branch } from '$lib/createTree';
	import P5Tree from './P5Tree.svelte';
	import SvgTree from './SVGTree.svelte';
	export let branches: Branch[];
	export let canvas = false;
	export let centralHue: number;
</script>

{#if canvas}
	<P5Tree {branches} />
{:else}
	<SvgTree {branches} {centralHue} />
{/if}
