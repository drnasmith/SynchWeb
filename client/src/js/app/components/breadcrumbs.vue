<template>
    <section class="bread">
        <ul id="breadcrumbs">
            <li v-for="(item, index) in bc" :key="index">
                <router-link v-if="item.link" :to="item.link">{{item.title}}</router-link>
                <span v-else>{{item.title}}</span>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
    name: 'Breadcrumbs',
    props: {
        'bc': Array // Should be list of objects {'title': ..., 'link': ...}
    }
}
</script>

<style scoped>
#breadcrumbs {
    background: #474747;
    color: #dbdbdb;
    font-size: 10px;
    list-style-type: none;
    padding: 5px 5px;
    clear: both
}

#breadcrumbs li {
    display: inline;
    padding: 2px
}

#breadcrumbs li a {
    color: #dbdbdb;
    text-decoration: none
}

#breadcrumbs li a:hover {
    color: #fff
}

#breadcrumbs li:before {
    content: '\00BB  '
}
</style>