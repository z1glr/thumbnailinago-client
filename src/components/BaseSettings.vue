<script lang="ts">
	export interface SendSettings {
		replacement_pattern: string;
		date_format: string;
		export_days: Record<Day, boolean>;
	}
</script>

<script setup lang="ts">
	import { Global, WindowState, type Day } from "@/global";
	import { api_call } from "@/lib";
	import { faClose } from "@fortawesome/free-solid-svg-icons";
	import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
	import { onUnmounted } from "vue";

	onUnmounted(async () => {
		const body: SendSettings = {
			date_format: Global.date_format.value,
			replacement_pattern: Global.replacement_pattern.value,
			export_days: Global.export_days.value
		};

		await api_call("POST", "settings", undefined, body);
	});
</script>

<template>
	<div id="main-view">
		<div id="close-settings" @click="Global.state.value = WindowState.Main">
			<FontAwesomeIcon :icon="faClose" />
		</div>
		<div>
			<h3>Replacement pattern</h3>
			<input v-model="Global.replacement_pattern.value" type="text" />
		</div>
		<div>
			<h3>Date format</h3>
			<input v-model="Global.date_format.value" type="text" />
		</div>
		<div>
			<h3>Export days</h3>
			<div class="days-list" v-for="day in Object.keys(Global.export_days.value)" :key="day">
				<input type="checkbox" v-model="Global.export_days.value[day as Day]" />
				<span>{{ day }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
	#close-settings {
		position: absolute;

		aspect-ratio: 1;
		min-height: 0;
		display: flex;
		align-items: center;

		right: 2em;
		top: 2em;

		cursor: pointer;
	}

	#main-view {
		width: 100%;
		height: 100%;

		padding: 1em;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1em;
	}

	.days-list {
		display: flex;

		gap: 0.25em;

		align-items: baseline;
	}

	.days-list > input {
		size: 2em;

		border: 1px solid red;
	}
</style>
