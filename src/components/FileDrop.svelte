<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuid } from 'uuid';

	const dispatch = createEventDispatcher<{ drop: File }>();

	let isDragging = false;

	function handleDrop(
		e: DragEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) {
		isDragging = false;
		if (e.dataTransfer?.items) {
			for (let i = 0; i < e.dataTransfer.items.length; i++) {
				const item = e.dataTransfer.items[i];
				if (item.kind === 'file') {
					const file = item.getAsFile();
					if (file) {
						return dispatch('drop', file);
					}
				}
			}
		}
	}

	const id = uuid();
</script>

<div
	class="drop-area"
	class:dragging={isDragging}
	on:drop|preventDefault={handleDrop}
	on:dragover|preventDefault={() => (isDragging = true)}
	on:dragleave|preventDefault={() => (isDragging = false)}
>
	<input
		{id}
		type="file"
		on:change={(e) => {
			const file = e.currentTarget.files?.[0];
			if (file) {
				dispatch('drop', file);
			}
		}}
	/>
	<label for={id}>Drop a text file or click to select a file!</label>
</div>

<style>
	input {
		display: none;
	}
	.drop-area {
		background: white;
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		transition: background-color 0.2s ease-in-out;
	}
	.dragging {
		background: #f0f0f0;
	}
	label {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
	}
</style>
