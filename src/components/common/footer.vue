<template>
    <div class="customer-footer-wrapper">
        <div class="link-item" v-for="(item, i) of footerLinks" :key="i">
            <a :href="item.href" target="_blank" class="link-title">{{ item.title }}</a>
            <span class="split-line" v-if="i != (footerLinks.length - 1)">|</span>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            footerLinks: [
                {
                    title: '共产党员网',
                    href: 'http://www.12371.cn'
                }, {
                    title: '中国共产党新闻网',
                    href: 'http://cpc.people.com.cn'
                }, {
                    title: '人民网',
                    href: 'http://www.people.com.cn'
                }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
    .customer-footer-wrapper {
        display: flex;
        justify-content: center;
        padding: 31px 0;
        background-color: #373737;
        .link-item {
            color: #fff;
            font-size: 16px;
            .link-title {
                color: #fff;
            }
            .split-line {
                margin: 0 0.86rem;
            }
        }
    }
</style>
