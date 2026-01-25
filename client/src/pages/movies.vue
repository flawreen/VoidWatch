<template>
	<v-container class="fill-height">
		<div>
			<v-row>
				<v-col cols="auto">
					<v-card
						class="py-4"
						color="surface-variant"
						rounded="lg"
						variant="tonal"
					>
						<v-virtual-scroll :items="movies">
							<template  v-slot:default="{ item }">
								<MovieCard :title="item.title" :year="item.year.toString()" :description="truncate(item.description)" :to="movieRoute(item.id)"></MovieCard>
							</template>
						</v-virtual-scroll>

					</v-card>
				</v-col>

			</v-row>
		</div>
	</v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { get } from "@/services/http-service.js";
import MovieCard from "@/components/MovieCard.vue";

const movieRoute = (id) => "/movie/" + id;
const truncate = (text) => {
	if (text.length >= 300) {
		return text.substring(0, 300) + "...";
	}
}

const movies = ref([]);
const fetchMessage = async () => {
	movies.value = await get("/movies/");
}
onMounted(fetchMessage);

</script>
