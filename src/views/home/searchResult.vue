<template>
    <div class="search-result-wrapper">
        <dataList listTitle="搜索结果" :actionUrl="actionUrl" :actionParams="actionParams"></dataList>
    </div>
</template>

<script>
    import dataList from '@/components/common/dataList'
    import util from '@/tools/util'
    export default {
        data() {
            return {
                actionUrl: 'searchDataByKeyword',
                actionParams: {}
            }
        },
        components: {
            dataList,
        },
        created () {
            $eventBus.$on('seachAction', (params) => {
                this.actionParams = params;
            });
        },
        mounted(){
            let {query} = this.$route;
            if(!util.isEmptyObject(query)){
                this.actionParams = query;
            }
        },
    }
</script>

<style lang="less" scoped>
    .search-result-wrapper {
        width: 1100px;
        margin: 0 auto;
    }
</style>