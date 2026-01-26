<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {get} from "@/services/http-service.js";

const {id} = useRoute().params;
const movie = ref();
const reviews = ref([]);
const fetchMessage = async () => {
	movie.value = await get("/movies/" + id);
	reviews.value = await get("/reviews/" + id);
}

const getEditRoute = (reviewId, title, descr, rating) => {
	return `/reviews/edit/${reviewId}?movieId=${id}&title=${title}&description=${descr}&rating=${rating}`;
}

const getMovieId = () => {
	return id.toString();
}
onMounted(fetchMessage);
</script>

<template>
	<v-container class="fill-height">
		<div v-if="!movie && !reviews.value">
			<v-progress-circular indeterminate color="primary"></v-progress-circular>
		</div>
		<div v-else>
			<v-row>
				<v-col cols="auto">
					<v-card
						class="py-4 ma-3"
						color="surface-variant"
						rounded="lg"
						variant="tonal"
					>
						<template #title>
							<h2 class="text-h2 font-weight-bold">
								{{movie.title}}
							</h2>
						</template>

						<template #subtitle>
							<h4 class="text-h4 font-weight-regular">
								{{ movie.year }}
							</h4>
						</template>

						<p class="ma-8">{{movie.description}}</p>
					</v-card>
					<v-virtual-scroll :items="reviews">
						<template v-slot:default="{ item }">
							<ReviewCard :title="item.title" :created_at="item.createdAt" :body="item.description" :rating="item.rating" :username="item.userName" :editRoute="getEditRoute(item.id, item.title, item.description, item.rating)" :movieId="getMovieId()" :reviewId="item.id"></ReviewCard>
						</template>
					</v-virtual-scroll>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<style scoped lang="sass">

</style>
