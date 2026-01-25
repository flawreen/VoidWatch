<script setup>
import {onMounted, inject} from 'vue';
import {onIdTokenChanged, signOut} from 'firebase/auth';
import {useUserStore} from './stores/user-store.js';
import router from "@/router/index.js";

const auth = inject('auth');
const userStore = useUserStore();

const handleLogout = async () => {
	await signOut(auth);
	await router.push('/login');
}

onMounted(() => {
	onIdTokenChanged(auth, async (user) => {
		if (user) {
			const token = await user.getIdToken();
			userStore.token = token;
			userStore.userData = user;
			sessionStorage.setItem('token', token);
		} else {
			userStore.token = null;
			userStore.userData = null;
			sessionStorage.removeItem('token');
		}
	})
});
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
				<v-list-item v-if="userStore.userData"
							 :subtitle="userStore.userData.email"
							 :title="userStore.userData.displayName"
							 prepend-icon="mdi-account-circle"
				></v-list-item>
				<v-list-item v-else
							 subtitle="Log in to use the app"
							 title="Logged out"
							 prepend-icon="mdi-account-off"
							 to="/login"
				></v-list-item>
			</v-list>

			<v-divider></v-divider>

			<v-list density="compact" nav>
				<v-list-item prepend-icon="mdi-home" title="Home" value="" to="/"></v-list-item>
				<v-list-item prepend-icon="mdi-folder" title="Shared with me" value="shared" to="/"></v-list-item>
				<v-list-item prepend-icon="mdi-star" title="Starred" value="starred" to="/"></v-list-item>
			</v-list>

			<v-divider></v-divider>
			<template v-slot:append v-if="userStore.userData">
				<v-divider></v-divider>
				<v-list density="compact" nav>
					<v-list-item
						prepend-icon="mdi-logout"
						title="Logout"
						value="logout"
						color="error"
						@click="handleLogout"
					></v-list-item>
				</v-list>
			</template>
		</v-navigation-drawer>

		<v-main>
			<v-container>
				<router-view/>
			</v-container>
		</v-main>
	</v-app>
</template>
