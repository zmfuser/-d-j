<template>
    <div class="customer-pages-container">
        <Button class="first-page-btn" @click="changePage(1)">{{ firstPageText }}</Button>
        <Page :current="currentPage" :total="totalCount" :page-size="pageSize" :prev-text="prevText" :next-text="nextText" @on-change="changePage" class="page"/>
        <Button class="last-page-btn" @click="changePage(Math.ceil(totalCount/pageSize))">{{ lastPageText }}</Button>
    </div>
</template>

<script>
    export default {
        props: {
            firstPageText: {
                type: String,
                default: '首页'
            },
            lastPageText: {
                type: String,
                default: '尾页'
            },
            prevText: {
                type: String,
                default: '上一页'
            },
            nextText: {
                type: String,
                default: '下一页'
            },
            pageSize: {
                type: Number,
                default: 10
            },
            totalCount: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                currentPage: 1
            }
        },
        methods: {
            changePage(index) {
                this.currentPage = index;
                this.$emit('pageChange', {
                    currentPage: index
                })
            }
        },
    }
</script>

<style lang="less" scoped>
    .customer-pages-container {
        display: flex;
        justify-content: center;
        padding: 40px 0;
        .first-page-btn, .last-page-btn {
            width: 66px;
            height: 34px;
            line-height: 16px;
            font-size: 16px;
            text-align: center;
            &:hover {
                color: #d11528;
                border-color: #d11528;
            }
        }
        .first-page-btn {
            margin-right: 20px;
        }
        .last-page-btn {
            margin-left: 20px;
        }
    }
</style>
