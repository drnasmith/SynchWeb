<template>

    <div v-show="isLoggedIn && showMenu">
        <div class="tw-absolute tw-flex tw-flex-col tw-border-2 tw-border-red-500" @click="showMenu=false" >
            <router-link to="/proposals" 
                class="tw-py-4 tw-bg-sidebar-mobile-background hover:tw-bg-gray-200 tw-border tw-border-gray-400 tw-text-white tw-text-left tw-text-xs tw-px-2">
                Proposals
            </router-link>

            <router-link to="#" class="tw-relative tw-py-4 tw-bg-sidebar-mobile-background hover:tw-bg-gray-100 tw-border tw-border-gray-400 tw-text-white tw-text-left tw-text-xs tw-px-2">
                <p class="">{{proposal ? proposal : 'No Proposal'}} <i v-show="proposal" class="fa fa-chevron-down"/></p>
            </router-link>
            
            <div>
                <router-link v-for="(item, index) in menu" :key="index" :to="item.link" 
                    class="tw-w-full tw-border-b tw-border-gray-400 tw-bg-sidebar-mobile-background hover:tw-bg-gray-100 tw-block tw-text-white tw-py-4 tw-px-4">
                    {{item.name}}
                </router-link>
            </div>

            <router-link to="/projects" class="tw-py-4 tw-bg-sidebar-mobile-background hover:tw-bg-gray-100 tw-border tw-border-gray-400 tw-text-white tw-text-left tw-text-xs tw-px-2">
                Projects
            </router-link>
        
            <router-link to="/feedback" class="tw-py-4 tw-bg-sidebar-mobile-background hover:tw-bg-gray-100 tw-border tw-border-gray-400 tw-text-white tw-text-left tw-text-xs tw-px-2">
                Feedback
            </router-link>

            <router-link to="/help" class="tw-relative tw-py-4 tw-bg-sidebar-mobile-background hover:tw-bg-gray-100 tw-border tw-border-gray-400 tw-text-white tw-text-left tw-text-xs tw-px-2">
                Help
            </router-link>

            <router-link to="/docs" 
                class="tw-w-full tw-border-b tw-border-gray-400 tw-bg-sidebar-mobile-background hover:tw-bg-gray-100 tw-block tw-text-white tw-py-4 tw-px-4">
                Tutorial
            </router-link>
        </div>
    </div>
</template>

<script>
import EventBus from './utils/event-bus.js'

export default {
    name: 'Sidebar',
    props: {
        'menu': Array,
    },

    data: function() {
        return {
            showMenu: false,
        }
    },

    mounted: function() {
        let self = this
        EventBus.$on('toggleSidebar', function (payLoad) {
            self.showMenu = ! self.showMenu
        })
    },

    computed: {
        proposal: function() {
            return this.$store.getters.currentProposal
        },
        isLoggedIn: function() {
            return this.$store.getters.isLoggedIn
        }
    },

    methods: {
        leave: function() {
            console.log("MOUSE EVENT LEAVE ")
            this.showMenu = false
        }
    }
}
</script>