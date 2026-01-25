/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import {registerPlugins} from '@/plugins';

// Components
import App from './App.vue';

// Composables
import {createApp} from 'vue';

// Styles
import 'unfonts.css'
import {getAuth} from "firebase/auth";
import {initializeApp} from 'firebase/app';
import firebaseConfig from '../firebase-config.json' with {type: 'json'};
import {createPinia} from "pinia";


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const pinia = createPinia()

const app = createApp(App);

registerPlugins(app);

app.use(pinia)
app.mount('#app');
app.provide('auth', auth);
