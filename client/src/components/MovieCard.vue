<script setup>
defineProps({
	title: String,
	year: String,
	description: String,
	to: String,
})
</script>

<template>
	<v-card
		:title="title"
		:subtitle="year"
		:text="description"
		variant="tonal"
	>
		<v-card-actions>
			<v-btn :to="to" router>Details</v-btn>
		</v-card-actions>
	</v-card>

</template>

<style scoped lang="sass">


</style>
