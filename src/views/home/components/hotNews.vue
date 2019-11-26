<template>
    <div class="hot-news-wrapper">
        <img src="../../../images/home_icon_djtt.png" alt="">
        <div class="throw-line"></div>
        <div class="text" @click="lookDetail">
            <p class="main-title">{{ hotNewsObj.title}}</p>
            <p class="sub-title" v-show="summary">{{summary}}</p>
        </div>      
    </div>
</template>
<script>
    import {mapActions} from 'vuex'
    import util from '@/tools/util'
    export default {
        data(){
            return {
                hotNewsObj: {}
            }
        },
        computed: {
            summary() {
                let str = this.hotNewsObj.text
                if(str){
                    return util.removeTagFromStr(str);
                }else{
                    return '';
                }
            }
        },
        mounted(){
            setTimeout(() => {
                this.getHotNews().then(res => {
                    console.log('success: ', res);
                    if(res.success){
                        this.hotNewsObj = res.data;
                    }
                }).catch(error => {
                    console.log('error: ', error);
                })
            }, 300);
        },
        methods: {
            lookDetail() {
                this.$router.push({ name: 'details', query: { id: this.hotNewsObj.id, from: 'index' }});
            },
            ...mapActions([
                'getHotNews'
            ])
        },
    }
</script>
<style lang="less" scoped>
    .hot-news-wrapper {
        margin-top: 30px;
        height: 118px;
        // line-height: 118px;
        background-color: #fff;
        display: flex;
        align-items: center;
        border-radius: 6px;
        img {
            margin-left: 19px;
            margin-right: 31px;
        }
        .throw-line {
            width: 1px;
            height: 46px;
            background: #ccc;
            margin-right: 30px;
        }
        .text {
            // flex-grow: 1;
            display: flex;
            flex-direction: column;
            width: 900px;
            cursor: pointer;
            .main-title {
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-top: -3px;
                margin-bottom: 8px;
                cursor: pointer;
            }
            .sub-title {
                font-size: 18px;
                color: #999999;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
            }
        }
    }
</style>
