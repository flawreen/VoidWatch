<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import {del} from "@/services/http-service.js";

const props = defineProps({
	title: String,
	created_at: String,
	body: String,
	rating: Number,
	username: String,
	editRoute: String,
	reviewId: String,
	movieId: String
})

const expanded = ref(false)
const isTruncated = ref(false)
const bodyEl = ref(null)

const bodyClass = computed(() => (expanded.value ? '' : 'multiline-truncate'))

function toggleExpanded() {
	expanded.value = !expanded.value
}

const handleDelete = async () => {
	try {
		const payload = {
			movieId: props.movieId
		};
		console.log(payload);
		await del(`/reviews/${props.reviewId}`, payload);

	} catch (error) {
		console.error("Error deleting review", error);
	}
}

function checkTruncate() {
	if (bodyEl.value) {
		isTruncated.value = bodyEl.value.scrollHeight > bodyEl.value.clientHeight
	}
}

onMounted(() => {
	nextTick(() => {
		checkTruncate()
	})
})
</script>

<template>
	<v-card variant="tonal" class="mb-1">
		<v-card-text class="d-flex justify-center flex-column ga-5">
			<v-col cols="auto" class="d-flex flex-column ga-2">
				<v-row>
					<v-rating
						active-color="yellow-accent-4"
						color="white"
						size="18"
						:model-value="rating"
						half-increments
						hover
						readonly
					></v-rating>
				</v-row>

				<v-row>
					<p class="text-h5 font-weight-black">{{ title }}</p>
				</v-row>

				<v-row>
					<p
						class="text-body-1"
						:class="bodyClass"
						ref="bodyEl"
					>
						{{ body }}
					</p>
					<span
						v-if="isTruncated"
						class="read-more"
						@click="toggleExpanded"
					>
						{{ expanded ? 'Show less' : 'Read more' }}
					</span>
				</v-row>
			</v-col>

			<v-row class="mb-n1 d-flex flex-row ga-0" align="center">
				<v-col cols="auto">
					<v-chip prepend-icon="mdi-account" variant="outlined">
						{{ username }}
					</v-chip>
				</v-col>

				<v-col cols="auto">
					<v-chip prepend-icon="mdi-calendar" variant="outlined">
						{{ new Intl.DateTimeFormat("en-GB").format(new Date(created_at)) }}
					</v-chip>
				</v-col>

				<v-col cols="auto">
					<v-btn
						v-if="editRoute"
						icon="mdi-pencil"
						variant="text"
						color="primary"
						density="comfortable"
						:to="editRoute"
					></v-btn>
				</v-col>

				<v-col cols="auto">
					<v-btn
						icon="mdi-delete"
						variant="text"
						color="error"
						density="comfortable"
						@click="handleDelete"
					></v-btn>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<style scoped lang="sass">
.multiline-truncate
	display: -webkit-box
	-webkit-line-clamp: 3
	-webkit-box-orient: vertical
	overflow: hidden
	text-overflow: ellipsis

.read-more
	display: inline-block
	margin-top: 0.25em
	color: #1976d2
	cursor: pointer
	font-weight: 500
	user-select: none
</style>
