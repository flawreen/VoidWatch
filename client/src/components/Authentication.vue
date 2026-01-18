<template>
	<v-container class="fill-height">
		<v-row align="center" justify="center">
			<v-col cols="12" sm="8" md="6" lg="4">
				<v-card class="elevation-12">
					<v-toolbar color="primary" dark flat>
						<v-toolbar-title>Autentificare</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<div id="firebaseui-auth-container"></div>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import { onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import * as firebaseui from 'firebaseui';
import { onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';

const auth = inject('auth');
const router = useRouter();

let ui = null;

onMounted(() => {
	ui = new firebaseui.auth.AuthUI(auth);

	const uiConfig = {
		signInSuccessUrl: '/',
		signInOptions: [
			GoogleAuthProvider.PROVIDER_ID,
		],
	};

	ui.start('#firebaseui-auth-container', uiConfig);
});

onAuthStateChanged(auth, async (user) => {
	if (user) {
		const idToken = await user.getIdToken();

		console.log('ID TOKEN:', idToken);

		await fetch('http://localhost:3000/verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ idToken }),
			credentials: 'include',
		});
	}
});
</script>

<style scoped>
.fill-height {
	min-height: 100vh;
}
</style>
