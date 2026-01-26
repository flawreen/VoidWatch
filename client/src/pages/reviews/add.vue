<script setup>
import {ref} from "vue";
import {post} from "@/services/http-service";
import {useRoute, useRouter} from "vue-router";

const titleRules = [
	(value) => {
		if (value) return true;
		return "Required!";
	},
	(value) => {
		if (value && value.length >= 3) return true;
		return "Min. 3 characters";
	},
	(value) => {
		if (value && value.length <= 200) return true;
		return "Max. 200 characters";
	}
]

const descriptionRules = [
	(value) => {
		if (value) return true;
		return "Required!";
	},
	(value) => {
		if (value && value.length >= 3) return true;
		return "Min. 3 characters";
	},
	(value) => {
		if (value && value.length <= 800) return true;
		return "Max. 800 characters";
	}
]

const router = useRouter();
const route = useRoute();
const valid = ref(false);
const title = ref("");
const description = ref("");
const rating = ref(0);
const movieId = route.query.movieId;

const onSubmit = async () => {
	if (rating.value === 0) {
		alert("Rating must be at least 1 star");
		return;
	}

	if (!valid.value) return;

	try {
		const payload = {
			movieId: movieId,
			title: title.value,
			description: description.value,
			rating: rating.value
		};
		console.log("payload", payload);
		await post('/reviews/', payload);

		await router.push('/movies');

	} catch (error) {
		console.error("Error sending review", error);
	}
}

</script>

<template>
	<v-form v-model="valid" @submit.prevent="onSubmit">
		<v-text-field class="mb-2"
					  v-model="title"
					  :rules="titleRules"
					  hint="review title"
					  label="Title"
					  hide-details="auto"
					  variant="outlined"
		></v-text-field>
		<v-text-field class="mb-2"
					  v-model="description"
					  :rules="descriptionRules"
					  hint="description"
					  label="Description"
					  hide-details="auto"
					  variant="outlined"
		></v-text-field>

		<v-rating class="mb-5"
				  active-color="yellow-accent-4"
				  color="white"
				  size="18"
				  v-model="rating"
				  half-increments
				  hover
		></v-rating>

		<br>

		<v-btn
			:disabled="!valid"
			color="success"
			size="large"
			type="submit"
			variant="outlined"
			block
		>
			Submit
		</v-btn>
	</v-form>
</template>

<style scoped lang="sass">

</style>
