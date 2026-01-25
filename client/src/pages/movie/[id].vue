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
					<v-infinite-scroll>
						<template v-for="review in reviews" :key="review">
							<ReviewCard :title="review.title" :created_at="review.createdAt" :body="review.description" :rating="review.rating" :username="review.userName"></ReviewCard>
						</template>
					</v-infinite-scroll>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<style scoped lang="sass">

</style>
