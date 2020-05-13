<template>
    <div class="tw-relative"
      @mouseover="showMenu = true" 
      @mouseleave="showMenu = false">
        <a class="tw-mx-1" :href="link" ><i class="fa fa-2x fa-file"/> {{title}} <i v-if="menu" class="fa fa-chevron-down"/></a>
        <div v-if="showMenu">
            <div class="tw-absolute tw-left-0 tw-ml-1 tw-rounded tw-w-48 tw-py-2">
                <router-link  
                  v-for="(item, index) in menu" 
                  :key="index" 
                  :to="item.link"
                  class="tw-block tw-border-b tw-px-2 tw-py-4 tw-border-gray-500 tw-bg-gray-300 hover:tw-bg-blue-400 tw-text-gray-800 hover:tw-text-white">{{item.name}}</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NavbarMenuItem',
    props: {
      'title': String,
      'link': String,
      'menu': Array,
    },
    data: function() {
      return {
        showMenu: false
      }
    },
}
</script>