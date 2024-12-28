import { ref, type Ref } from "vue";
import { type RecvSvg } from "./components/BaseMain.vue";

export type Day =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

export enum WindowState {
	Main,
	Exporting,
	Settings
}

interface Globals {
	state: Ref<WindowState>;
	svg: {
		str: Ref<string>;
		name: Ref<string>;
	};
	replacement_pattern: Ref<string>;
	date_format: Ref<string>;
	export_days: Ref<Record<Day, boolean>>;
}

export function store_svg(svg: RecvSvg) {
	Global.svg.str.value = svg.str;
	Global.svg.name.value = svg.name.split(/[\\/]/).pop() ?? svg.name;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Global: Globals = {
	state: ref<WindowState>(WindowState.Main),
	svg: {
		str: ref<string>(""),
		name: ref<string>("")
	},
	replacement_pattern: ref<string>(""),
	date_format: ref<string>(""),
	export_days: ref<Record<Day, boolean>>({
		/* eslint-disable @typescript-eslint/naming-convention */
		Monday: false,
		Tuesday: false,
		Wednesday: false,
		Thursday: false,
		Friday: false,
		Saturday: false,
		Sunday: true
		/* eslint-enable @typescript-eslint/naming-convention */
	})
};
