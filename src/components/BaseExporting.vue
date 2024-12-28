<script setup lang="ts">
	import { faHourglass } from "@fortawesome/free-regular-svg-icons";
	import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

	// const props = defineProps<{}>();

	// const emit = defineEmits<{}>();
</script>

<template>
	<div id="main-exporting" class="active">
		Export in progress
		<FontAwesomeIcon id="spinner" :icon="faHourglass" />
	</div>
</template>

<style scoped>
	#main-exporting {
		position: fixed;
		inset: 0;

		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1em;

		font-size: 2em;

		color: white;

		/* text-shadow: 0.0625em 0.0625em 0.0625em black; */
		filter: drop-shadow(0.0625em 0.0625em 0.03125em black);
	}

	#main-exporting.active {
		backdrop-filter: blur(0.25em);
	}

	#spinner {
		animation: 2s infinite ease rot;
	}

	@keyframes rot {
		from {
			rotate: 0deg;
		}

		to {
			rotate: 180deg;
		}
	}
</style>
