<template>

    <div v-show="isLoggedIn" class="tw-hidden md:tw-flex md:flex-row tw-bg-sidebar-grad-end tw-justify-center tw-my-2 md:tw-mx-4">
        <router-link to="/proposals" class="md:tw-w-48 tw-py-4 tw-bg-sidebar-grad-end hover:tw-bg-gray-100 tw-border tw-border-gray-400 tw-text-gray-800 tw-text-center tw-text-xs">
            Proposals
        </router-link>

        <router-link to="#" class="tw-relative md:tw-w-48 tw-py-4 tw-bg-sidebar-grad-end hover:tw-bg-gray-100 tw-border tw-border-gray-400 tw-text-gray-800 tw-text-center tw-text-xs"
          @mouseover.native="showProposalMenu = true" @mouseleave.native="showProposalMenu=false" @click.native="showProposalMenu=false">
            <p class="tw-text-xs">{{proposal ? proposal : 'No Proposal'}} <i v-show="proposal" class="fa fa-chevron-down"/></p>

            <div v-show="showProposalMenu && proposal">
                <div class="tw-absolute tw-left-0 tw-mt-4 tw-w-full">
                    <ul class="tw-border-t tw-border-l tw-border-r">
                        <li v-for="(item, index) in menu" :key="index" class="tw-w-full tw-border-b tw-border-gray-400 tw-bg-sidebar-grad-end hover:tw-bg-sidebar-hover-background">
                            <router-link  :to="item.link" class="tw-block tw-text-gray-800 tw-py-4">{{item.name}}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </router-link>

        <router-link to="/projects" class="md:tw-w-48 tw-py-4 tw-bg-sidebar-grad-end hover:tw-bg-gray-100 tw-border tw-border-gray-400 tw-text-gray-800 tw-text-center tw-text-xs">
            Projects
        </router-link>
    
        <!-- Spacer element -->
        <div class="tw-flex-1 tw-py-4 tw-bg-sidebar-grad-end hover:tw-bg-gray-100 tw-border-t tw-border-b tw-border-gray-400">
            <p class="tw-text-gray-800 tw-text-center tw-text-xs"> </p>
        </div>
    
        <router-link to="/feedback" class="md:tw-w-48 tw-py-4 tw-bg-sidebar-grad-end hover:tw-bg-gray-100 tw-border tw-border-gray-400 tw-text-gray-800 tw-text-center tw-text-xs">
            Feedback
        </router-link>

        <router-link to="/help" class="tw-relative md:tw-w-48 tw-py-4 tw-bg-sidebar-grad-end hover:tw-bg-gray-100 tw-border tw-border-gray-400 tw-text-gray-800 tw-text-center tw-text-xs"
          @mouseover.native="showHelpMenu = true" @mouseleave.native="showHelpMenu=false" @click.native="showHelpMenu=false">
            <p class="tw-text-xs">Help</p>

            <div v-show="showHelpMenu" >
                <div class="tw-absolute tw-left-0 tw-mt-4 tw-w-full">
                    <ul class="tw-border-t tw-border-l tw-border-r">
                        <li class="tw-w-full tw-border-b tw-border-gray-400 tw-bg-sidebar-grad-end  hover:tw-bg-sidebar-hover-background">
                            <router-link  to="/docs" class="tw-block tw-py-4 tw-text-gray-800 ">Tutorials</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </router-link>

    </div>

</template>

<script>
export default {
    name: 'Sidebar',
    props: {
        'menu': Array,
    },

    data: function() {
        return {
            showHelpMenu: false,
            showProposalMenu: false,
        }
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
    }
}
</script>