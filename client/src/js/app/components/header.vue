<template>
    <div id="vue-header" class="tw-flex tw-justify-between tw-items-center tw-h-10 tw-bg-header-background">
      <div class="">
        <router-link class="tw-mx-1 tw-inline md:tw-hidden hover:tw-text-header-hover-color" @click.native="showSidebar" to="/"><span class="fa fa-2x fa-bars"/></router-link>
        <router-link class="tw-mx-1 tw-text-header-color hover:tw-text-header-hover-color" to="/"><span class="fa fa-2x fa-home"/><p class="tw-hidden md:tw-inline"> Home </p></router-link>
        <router-link class="tw-mx-1 tw-text-header-color hover:tw-text-header-hover-color" v-if="isLoggedIn" to="/calendar"><span class="fa fa-2x fa-calendar"/><p class="tw-hidden md:tw-inline"> Calendar </p></router-link>
        <router-link class="tw-mx-1 tw-text-header-color hover:tw-text-header-hover-color" v-if="isLoggedIn" to="/current"><span class="fa fa-2x fa-calendar"/><p class="tw-hidden md:tw-inline"> Current </p></router-link>
        <a class="tw-mx-1 tw-text-header-color hover:tw-text-header-hover-color" v-if="isLoggedIn" href="#" v-on:click="logout"><span class="fa fa-2x fa-sign-out"/><p class="tw-hidden md:tw-inline"> Logout </p></a>
        <router-link class="tw-mx-1 tw-text-header-color hover:tw-text-header-hover-color" v-else :to="loginUrl"><span class="fa fa-2x fa-sign-in"/> <p class="tw-hidden md:tw-inline"> Login </p></router-link>
      </div>
      <div v-if="isLoggedIn" class="tw-flex">
        <div v-if="isStaff" class="tw-flex">
          <a v-for="(item, index) in staff_menus" 
            :key="index" 
            class="tw-mx-1 tw-text-header-color hover:tw-text-header-hover-color" 
            :href="item.link"
            :alt="item.name">
            <div class="tw-flex tw-flex-row tw-items-center">
              <i class="fa fa-2x" v-bind:class="item.icon"/>
              <p class="tw-text-xs tw-mx-1 tw-hidden md:tw-inline">{{item.name}}</p>
            </div>
            </a>
        </div>
      </div>
    </div>
</template>

<script>
import EventBus from './utils/event-bus.js'

export default {
    name: 'Header',
    props: {
      'prop': String,
      'staff_menus' : Array
    },
    data: function() {
      return {
        showHelp: true,
        showHelpMenu: false
      }
    },
    computed: {
        isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
        isStaff : function(){ return this.$store.getters.isStaff},
        currentProposal : function(){ return this.$store.getters.currentProposal},
        loginUrl: function() {
          return this.$store.sso ? this.$store.sso_url + '/cas/login?service=http://192.168.33.10:9000/current' : '/login'
        },
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          if (this.$store.sso) this.$router.replace(this.$store.sso_url+'/cas/logout')
          else this.$router.push('/')
        })
      },
      showSidebar: function() {
        EventBus.$emit('toggleSidebar')
      }
    }
}
</script>

<style scoped>
#vue-header {
  background-image: none;
}

@screen md {
  #vue-header {
    background-image: url('../../../css/images/diamond_gs_small.png');
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>