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
						<v-infinite-scroll>
							<template v-for="movie in movies" :key="movie">
								<MovieCard :title="movie.title" :year="movie.year.toString()" :description="truncate(movie.description)" :to="movieRoute(movie.id)"></MovieCard>
							</template>
						</v-infinite-scroll>

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
