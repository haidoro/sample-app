import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'

Vue.config.productionTip = false

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyC1IGn2mKjnBUTjLHOyjKu5yGujAFmFs8o",
        authDomain: "my-address-book-e6b44.firebaseapp.com",
        databaseURL: "https://my-address-book-e6b44.firebaseio.com",
        projectId: "my-address-book-e6b44",
        storageBucket: "my-address-book-e6b44.appspot.com",
        messagingSenderId: "99776770053",
        appId: "1:99776770053:web:db22fcb44e0b2a95"
    };
// Initialize Firebase
firebase.initializeApp(firebaseConfig); 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
