<div class="small">
	<slot name="small" />
</div>
<div class="large">
	<slot name="large" />
</div>

<style>
	.small {
		display: block;
	}

	.large {
		display: none;
	}

	@media (min-width: 1024px) {
		.large {
			display: block;
		}
		.small {
			display: none;
		}
	}
</style>
