import "../src/assets/tailwind.css";
import { createWebHistory, createRouter } from "vue-router";
import { app } from "@storybook/vue3";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import UUID from "vue3-uuid";

const router = createRouter({
	history: createWebHistory(),
	routes: [],
});

app.component("fa-icon", FontAwesomeIcon);
app.use(router);
app.use(UUID);

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	layout: "fullscreen",
};
