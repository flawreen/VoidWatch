<template>
	<v-container class="fill-height" max-width="900">
		<div>
			<v-row>
				<v-col cols="12">
					<v-card
						class="py-4"
						color="surface-variant"
						image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
						prepend-icon="mdi-rocket-launch-outline"
						rounded="lg"
						variant="tonal"
					>

						<template #title>
							<h2 class="text-h2 font-weight-bold">
								VoidWatch
							</h2>
						</template>

						<template #subtitle>
							<h4 class="text-h4 font-weight-regular">
								{{ backendMessage }}
							</h4>
						</template>

					</v-card>
				</v-col>

			</v-row>
		</div>
	</v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get } from "@/services/http-service.js";

const backendMessage = ref("");

const fetchMessage = async () => {
	backendMessage.value = await get("/greet", { name: "VoidWatch" });
}

onMounted(fetchMessage);

</script>
