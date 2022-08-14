<script>
	import { slide } from 'svelte/transition';
	export let visible = false;
</script>

{#if visible}
	<div transition:slide class="menu-overlay">
		<div class="header">
			<button on:click={() => (visible = false)}>×</button>
		</div>
		<div class="content">
			<slot />
		</div>
	</div>
{/if}

<style>
	button {
		background: none;
		padding: 0;
		margin: 0;
		color: black;
		margin-right: 1rem;
		font-size: 2rem;
	}
	.menu-overlay {
		display: grid;
		grid-template-rows: 2rem auto;
		background-color: #eee;
		z-index: 999;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}
	.header {
		color: black;
		font-size: 2rem;
		display: flex;
		justify-content: flex-end;
	}
</style>
