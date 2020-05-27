<template>
    <div id="vue-header" class="tw-flex tw-justify-between tw-items-center tw-h-10">
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
        <!-- If we want to add help/feedback to header menu -->
        <!-- <a class="tw-mx-1 tw-text-header-color hover:tw-text-header-hover-color" href="/feedback">
          <div class="tw-flex tw-flex-row tw-items-center">
            <i class="fa fa-2x fa-comment"/>
            <p class="tw-text-xs tw-mx-1 tw-hidden md:tw-inline">Feedback</p>
          </div>
        </a>
        <a class="tw-mx-1 tw-text-header-color hover:tw-text-header-hover-color" href="/help"  @mouseover="showHelpMenu = true" @mouseleave="showHelpMenu=false">
          <div class="tw-flex tw-flex-row tw-items-center">
            <i class="fa fa-2x fa-question"/>
            <p class="tw-text-xs tw-mx-1 tw-hidden md:tw-inline">Help</p>
            <div v-if="showHelpMenu">
              <div class="tw-absolute tw-z-10 tw-right-0 tw-top-0 tw-mt-8 tw-py-2 tw-w-48 tw-border-2 tw-bg-white hover:tw-bg-blue-400">
                <router-link  to="/docs" class="tw-px-2 tw-block tw-text-gray-800 hover:tw-text-white">Tutorials</router-link>
              </div>
            </div>
          </div>
        </a> -->
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
          return this.$store.sso ? 'https://cas/cas/login?service=http://192.168.33.10:9000/current' : '/login'
        }
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/')
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
  @apply tw-bg-header-background;
}

@screen md {
  #vue-header {
    background-image: url('../../../css/images/diamond_gs_small.png');
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>