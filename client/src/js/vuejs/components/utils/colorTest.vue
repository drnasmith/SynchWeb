<template>
    <div>
        <ul>
            <li v-for="(clss, index) in colors" :key="index"
                class="tw-border" :class="'tw-bg-'+clss"><p>{{clss}}</p></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'color-test',
    data() {
        return {
            colors: [
                'sidebar-grad-start',
                'sidebar-grad-end',
                'sidebar-border',
                'sidebar-hover-background',
                'sidebar-hover-dark-background',
                'sidebar-mobile-color',
                'sidebar-mobile-background',
                'sidebar-mobile-border-top',
                'sidebar-mobile-border-bottom',
                'sidebar-mobile-active-background',
                'sidebar-mobile-hover-background',
            ]
        }
    }
}
</script>