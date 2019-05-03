<template>
  <v-app>
    <v-toolbar app>
    <v-toolbar-side-icon @click.store="openSideMenu"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
       <span>My Address Book</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <SideNav/>
    <v-content>
     <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import SideNav from './components/SideNav'
export default {
  name: 'App',
  components:{
      SideNav
  },
  data () {
    return {
      //
    }
  },
  methods:{
        openSideMenu(){
            this.$store.dispatch('toggleSideMenu')
        }
    }
}
</script>
