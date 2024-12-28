<script lang="ts">
	export type ExportFormatId = "jpg" | "png";

	export interface SendExport {
		time: string;
		from: string;
		until: string;
		custom?: string[];
		type: ExportFormatId;
	}

	export interface RecvSvg {
		str: string;
		name: string;
	}

	export function prepare_svg(r: string): string {
		const parser = new DOMParser();
		const svg_dom = parser.parseFromString(r, "image/svg+xml").documentElement;

		svg_dom.removeAttribute("width");
		svg_dom.removeAttribute("height");

		let svg_string = new XMLSerializer().serializeToString(svg_dom);

		svg_string = svg_string.replaceAll(
			Global.replacement_pattern.value,
			create_directory(Global.date_format.value)
		);

		return svg_string;
	}
</script>

<script setup lang="ts">
	import { api_call as ApiCall, create_directory, format_date, http } from "@/lib";
	import { faSliders, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
	import { faFloppyDisk, faFolderOpen } from "@fortawesome/free-regular-svg-icons";
	import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
	import { onMounted, ref } from "vue";
	import { Global, store_svg, WindowState } from "@/global";

	// const props = defineProps<{}>();

	// const emit = defineEmits<{}>();

	const time = ref<string>("10:00:00");
	const date_from = ref<string>("");
	const date_until = ref<string>("");
	const date_custom = ref<string>("");

	const date_custom_list = ref<string[]>([]);

	const export_format = ref<ExportFormatId>("jpg");
	const export_formats: Record<ExportFormatId, string> = {
		jpg: "JPEG (*.jpg)",
		png: "Portable Network Graphic (*.png)"
	};

	onMounted(() => {
		const today = new Date();
		const next_week = new Date();
		next_week.setDate(next_week.getDate() + 7);

		date_from.value = format_date(today);
		date_until.value = format_date(next_week);
	});

	const date_custom_validate = /^\d{1,4}-\d?\d-\d?\d$/;
	function add_date() {
		if (date_custom.value.match(date_custom_validate)) {
			date_custom_list.value.push(date_custom.value);
		}
	}

	function remove_date(ii: number) {
		date_custom_list.value.splice(ii, 1);
	}

	async function open_svg() {
		const response = await ApiCall<RecvSvg>("PATCH", "svg");

		if (response.status === http.StatusOK) {
			store_svg(response.data);
		}
	}

	async function call_export() {
		const body: SendExport = {
			/* eslint-disable @typescript-eslint/naming-convention */
			from: date_from.value,
			until: date_until.value,
			time: time.value,
			type: export_format.value,
			custom: date_custom_list.value
			/* eslint-enable @typescript-eslint/naming-convention */
		};

		Global.state.value = WindowState.Exporting;

		const response = await ApiCall("POST", "export", undefined, body);

		Global.state.value = WindowState.Main;

		if (response.status !== http.StatusOK) {
			alert("Export had errors\nPlease check manually");
		}
	}
</script>

<template>
	<div id="main-view">
		<div id="preview">
			<div id="header">
				<button class="plain" @click="open_svg"><FontAwesomeIcon :icon="faFolderOpen" /></button>
				<h2>{{ Global.svg.name }}</h2>
				<button class="plain" @click="Global.state.value = WindowState.Settings">
					<FontAwesomeIcon :icon="faSliders" />
				</button>
			</div>
			<div id="svg-container">
				<div id="svg-wrapper" v-html="prepare_svg(Global.svg.str.value)" />
			</div>
		</div>
		<div id="control">
			<div>
				<h3>Time</h3>
				<input v-model="time" type="time" step="1000" />
			</div>
			<div>
				<h3>From</h3>
				<input v-model="date_from" type="date" :max="date_until" />
			</div>
			<div>
				<h3>Until</h3>
				<input v-model="date_until" type="date" :min="date_from" />
			</div>
			<div id="custom-dates-wrapper">
				<h3>Custom</h3>
				<div class="flex-row">
					<button class="plain" @click="add_date">
						<FontAwesomeIcon :icon="faPlus" />
					</button>
					<input
						id="custom-date-input"
						v-model="date_custom"
						type="date"
						@keydown.enter="add_date()"
					/>
				</div>
				<div id="custom-date-list">
					<div
						v-for="(dt, ii) in date_custom_list"
						:key="`${dt}-${ii}`"
						tabindex="0"
						class="custom-date-list-element"
						@keydown.delete="remove_date(ii)"
					>
						<span>{{ dt }}</span>
						<FontAwesomeIcon :icon="faXmark" @click="remove_date(ii)" />
					</div>
				</div>
			</div>
			<div>
				<h3>Export</h3>
				<div id="export-control" class="flex-row">
					<select v-model="export_format">
						<option v-for="[id, name] in Object.entries(export_formats)" :key="id" :value="id">
							{{ name }}
						</option>
					</select>
					<button class="plain" @click="call_export">
						<FontAwesomeIcon :icon="faFloppyDisk" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	#main-view {
		width: 100%;
		height: 100%;

		padding: 1em;

		gap: 1em;

		display: flex;
	}

	#header {
		display: flex;

		gap: 0.25em;

		align-items: center;

		justify-content: space-between;
	}

	#preview {
		flex: 1;

		height: 100%;

		display: flex;
		flex-direction: column;
	}

	#svg-container {
		height: 100%;
		width: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
	}
	#control,
	#control > div {
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	#control h3 {
		text-align: center;
	}

	#control {
		gap: 1em;
	}

	#control > div {
		gap: 0.25em;
	}

	input[type="time"],
	input[type="date"] {
		text-align: center;
	}

	#custom-dates-wrapper {
		flex: 1;
	}

	.flex-row {
		display: flex;
		gap: 0.125em;
	}

	#custom-date-input {
		flex: 1;
	}

	#custom-date-list {
		overflow: auto;
	}

	.custom-date-list-element {
		display: flex;

		align-items: center;

		padding-inline: 0.125em;
	}

	.custom-date-list-element > span {
		flex: 1;
		text-align: center;
	}

	.custom-date-list-element > svg {
		cursor: pointer;
	}

	.custom-date-list-element:focus {
		outline: none;

		color: white;
		background-color: rgb(0, 120, 215);
	}
</style>

<style>
	#svg-wrapper {
		width: 80%;
		max-height: 80%;
	}
</style>
