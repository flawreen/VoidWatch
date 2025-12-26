<script setup>
</script>

<template>
	<v-app>
		<v-app-bar app dark>
			<v-toolbar-title>Movie App</v-toolbar-title>
		</v-app-bar>

		<v-navigation-drawer
			expand-on-hover
			permanent
			rail
		>
			<v-list>
				<v-list-item
					prepend-avatar="https://randomuser.me/api/portraits/women/70.jpg"
					subtitle="sandra_a88@gmailcom"
					title="Sandra Adams"
				></v-list-item>
			</v-list>

			<v-divider></v-divider>

			<v-list density="compact" nav>
				<v-list-item prepend-icon="mdi-home" title="Home" value="" to="/"></v-list-item>
				<v-list-item prepend-icon="mdi-folder" title="Shared with me" value="shared" to="/"></v-list-item>
				<v-list-item prepend-icon="mdi-star" title="Starred" value="starred" to="/"></v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-main>
			<v-container>
				<router-view />
			</v-container>
		</v-main>
	</v-app>
</template>
