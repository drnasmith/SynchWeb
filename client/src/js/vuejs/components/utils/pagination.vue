<template>
    <div class="content">
        <select v-model="perPage" v-on:change="onPageSizeChange">
            <option v-for="(option, index) in pageSizes" v-bind:key="index" v-bind:value="option">{{option}}</option>
        </select>
        <button v-on:click="onFirst" class="button">
            <i class="fa fa-chevron-left" style="font-size: 0.5rem;"></i>
            <i class="fa fa-chevron-left" style="font-size: 0.5rem;"></i>
        </button>
        <button v-on:click="onPrev" class="button">
            <i class="fa fa-chevron-left" style="font-size: 0.5rem;"></i>
        </button>
        <button class="button inactive">Page {{currentPage}}</button>
        <button v-on:click="onNext" class="button">
            <i class="fa fa-chevron-right" style="font-size: 0.5rem;"></i>
        </button>
        <button v-on:click="onLast" class="button">
            <i class="fa fa-chevron-right" style="font-size: 0.5rem;"></i>
            <i class="fa fa-chevron-right" style="font-size: 0.5rem;"></i>
        </button>
    </div> 
</template>

<script>

export default {
    name: 'Pagination',
    props: {
        initialPage: {
            type: Number,
            default: 0
        },
        totalRecords: {
            type: Number,
            default: 0
        }
    },

    data: function() {
        return {
            currentPage: 1,
            perPage: 15,
            pageSizes: ['15', '25', '50', '100', '500'],
        }
    },
    computed: {
        // Calculate total number of pages
        maxPages: function() {
            if (this.totalRecords < 1) {
                return 1
            }
            return Math.ceil(this.totalRecords / this.perPage)
        }
    },
    methods: {
        onFirst: function() {
            this.currentPage = 1
            this.sendPageChangeEvent()
        },
        onPrev: function() {
            this.currentPage = this.currentPage > 1 ? this.currentPage -1 : 1
            this.sendPageChangeEvent()
        },
        onNext: function() {
            this.currentPage = this.currentPage < this.maxPages ? this.currentPage + 1 : this.maxPages
            this.sendPageChangeEvent()
        },
        onLast: function() {
            this.currentPage = this.maxPages
            this.sendPageChangeEvent()
        },
        onPageSizeChange: function(event) {
            console.log("Page Size changed..." + this.perPage + " event " + event.target.value)
            this.sendPageChangeEvent()
        },
        sendPageChangeEvent: function() {
            let payload = {
                'current-page': this.currentPage,
                'page-size': this.perPage
            }
            this.$emit('page-changed', payload)
        }
    },

    created: function() {
        console.log("Created pagination component")
        if (this.initialPage < 1) {
            this.currentPage = 1
        } else if (this.initialPage > this.maxPages) {
            this.currentPage = this.maxPages
        }
    },
}
</script>