<script setup lang="ts">
	import { onMounted } from "vue";
	import BaseMain, { type RecvSvg } from "./components/BaseMain.vue";
	import BaseSettings, { type SendSettings } from "./components/BaseSettings.vue";
	import { WindowState, Global, store_svg } from "./global";
	import { api_call, http } from "./lib";
	import BaseExporting from "./components/BaseExporting.vue";

	window.addEventListener("beforeunload", () => {
		navigator.sendBeacon(window.origin + "/api/exit");
	});

	onMounted(async () => {
		await Promise.allSettled([
			(async () => {
				const response = await api_call<RecvSvg>("GET", "svg");

				if (response.status === http.StatusOK) {
					store_svg(response.data);
				}
			})(),
			(async () => {
				const response = await api_call<SendSettings>("GET", "settings");

				if (response.status === http.StatusOK) {
					Global.date_format.value = response.data.date_format;
					Global.replacement_pattern.value = response.data.replacement_pattern;
					Global.export_days.value = response.data.export_days;
				}
			})()
		]);
	});
</script>

<template>
	<BaseSettings v-if="Global.state.value === WindowState.Settings" />
	<BaseMain v-else />
	<Transition>
		<BaseExporting v-if="Global.state.value === WindowState.Exporting" />
	</Transition>
</template>

<style scoped>
	.v-enter-active,
	.v-leave-active {
		transition: opacity 0.5s ease;
	}

	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}
</style>
