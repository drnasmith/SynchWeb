<template>
  <div class="tw-bg-content-background">
    <notification/>
    <header-menu v-bind:prop="proposal" v-bind:staff_menus="adminMenu"/>
    <breadcrumbs v-bind:bc="bc"/>

    <div class="tw-mx-auto"> <!-- Popout menu for mobile screens -->
        <sidebar :menu="proposalMenu"/>
    </div>

    <div class="tw-w-10/12 tw-mx-auto"> <!-- Sets the main width of the content on screen -->
        <navbar :menu="proposalMenu"/>
        <motd :message="motd"/>
        <div v-if="loading" ><div class="loading">&nbsp;</div></div>

        <div id="content-wrapper" class="tw-w-full tw-mx-2">
          <!-- Using the full route as key forces refresh when sharing the same component -->
          <router-view :key="$route.fullPath"></router-view>
        </div>
    </div>

    <footer-panel />
  </div>
</template>


<script>
import Backbone from 'backbone'
import Header from './components/header.vue'
import Footer from './components/footer.vue'
import Sidebar from './components/sidebar.vue'
import Navbar from './components/navbar.vue'
import Breadcrumbs from './components/breadcrumbs.vue'
import Motd from './components/utils/motd.vue'
import Notification from './components/utils/notification.vue'
import EventBus from './components/utils/event-bus.js'

export default {
    name: 'App',
    components: {
        'header-menu': Header,
        'footer-panel': Footer,
        'navbar': Navbar,
        'sidebar': Sidebar,
        'motd': Motd,
        'notification': Notification,
        'breadcrumbs': Breadcrumbs,
    },
    data: function() {
      return {
        admin_menu: [
          {icon: 'fa-line-chart', link: '/reporting', name: 'Reporting'},
          {icon: 'fa-image', link: '/imaging', name: 'Imaging'},
          {icon: 'fa-cogs', link: '/settings', name: 'Overview'},
          {icon: 'fa-pie-chart', link: '/stats', name: 'Stats'},
          {icon: 'fa-truck', link: '/dewars', name: 'Logistics'},
        ],
        proposal_menu: [
          {link: '/shipments', name: 'Shipment'},
          {link: '/vcontacts', name: 'Contacts'},
          {link: '/contacts', name: 'Lab Contacts'},
          {link: '/proteins', name: 'Proteins'},
          {link: '/dewars', name: 'Registered Dewars'},
        ],
        motd: 'This is the message of the day',
        bc: [{title: 'Login', link: '/login'}, {title: 'DC'}],
      }
    },
    computed: {
      proposal: function() {
        return this.$store.getters.currentProposal
      },
      token: function() {
        return this.$store.getters.token
      },
      proposalMenu: function() {
        // Old menu object has key:val as route-link:name
        return this.getMenuType('menu')
      },
      extraMenu: function() {
        // Old menu object has key:val as route-link:name
        return this.getMenuType('extra')
      },
      adminMenu: function() {
        // Old menu object has key:val as route-link:name
        return this.getMenuType('admin')
      },
      loading: function() {
        return this.$store.getters.isLoading
      },
    },
    created: function () {
      let self = this

      EventBus.$on('proposalChange', function (payLoad) {
          console.log("Sidebar Proposal has Changed - " + payload)
      })

      EventBus.$on('bcChange', function (payload=undefined) {
        if (!payload) {
          console.log("Resetting breaccrumbs")
          self.bc = []
        } else {
          console.log("Breadcrumbs changed - " + payload)
          self.bc = payload
        }
      })

      var menus = this.$store.getters['getMenu']
      console.log("Menus: " + JSON.stringify(menus))
    },
    methods: {
      getMenuType: function(menuType) {
        var menu = []
        var legacyMenu = this.$store.getters['getMenu'][menuType]
        
        if (legacyMenu) {
          if (menuType === 'admin') {
            Object.keys(legacyMenu).forEach(function(key) {
              var title = legacyMenu[key]['title']
              var icon = legacyMenu[key]['icon']
              var permission = legacyMenu[key]['permission'] ? legacyMenu[key]['permission'] : ''

              var item = {link: key, name: title, icon: 'fa-'+icon, permission: permission}
              
              menu.push(item)
            })
          } else {
            // proposal and extra menus are simpler
            Object.keys(legacyMenu).forEach(function(key) {
              var item = {link: key, name: legacyMenu[key]}
              menu.push(item)
            })
          }
        }
        console.log("Computed menu for " + menuType + ", " + JSON.stringify(menu))
        return menu
      }
    }
}
</script>

<style>
</style>
