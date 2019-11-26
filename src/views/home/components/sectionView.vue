<template>
    <div class="section-view-wrapper">
        <div class="section-container">
            <div class="title-wrap">
                <h1 class="section-title">{{ sectionTitle }}</h1>
                <span class="more" v-if="moreLink" @click="gotoMorePage">更多>></span>
            </div>
            <div class="group-list">
                <div class="group-item" v-for="(item, i) of retContentData" :key="i">
                    <div class="group-title" v-show="item.channelName">{{ item.channelName }}</div>
                    <div class="group-content" v-show="item.channelName">
                        <template v-if="item.rows && item.rows.length">
                            <ul>
                                <li class="content-item" v-for="(contentItem, j) of item.rows" :key="j" @click="gotoDetail(contentItem)">
                                    <span>{{ contentItem.title }}</span>
                                </li>
                            </ul>
                        </template>
                        <template v-else>
                            <div class="no-data-tips">
                                <span>暂无数据。</span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapActions} from 'vuex'
    export default {
        props: {
            sectionTitle: {
                type: String,
                default: ''
            },
            moreLink: {
                type: String,
                default: ''
            },
            detailLink: {
                type: String,
                default: 'details'
            },
            contentData: {
                type: Array,
                default(){
                    return [];
                }
            }
        },
        data(){
            return {
                
            }
        },
        computed: {
            retContentData(){
                let ret = [].concat(this.contentData);
                if(ret.length % 2 == 1){
                    ret.push({
                        groupTitle: '',
                        list: []
                    })
                }
                return ret;
            }
        },
        methods: {
            gotoMorePage() {
                if(this.moreLink){
                    this.changeNaviPath('partyInfo');
                    this.changeSubNaviPath(this.moreLink);
                    this.$router.push({ name: 'partyInfo', params: { type: this.moreLink }});
                }
            },
            gotoDetail(item){
                this.changeNaviPath('partyInfo');
                this.$router.push({ name: this.detailLink, query: { id: item.id, from: 'index' }});
            },
            ...mapActions([
                'changeNaviPath',
                'changeSubNaviPath'
            ])
        },
    }
</script>
<style lang="less" scoped>
    .section-view-wrapper {
        // background-color: #fff;
        .section-container {
            width: 1100px;
            margin: 0 auto;
            padding-bottom: 70px;
            .title-wrap {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 20px;
                margin-bottom: 30px;
                .section-title {
                    position: relative;
                    padding-left: 20px;
                    color: #333333;
                    text-align: left;
                    font-size: 26px;
                    &::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 50%;
                        margin-top: -15px;
                        width: 4px;
                        height: 30px;
                        background-color: #d11528;
                    }
                }
                .more {
                    font-size: 16px;
                    color: #999999;
                    cursor: pointer;
                    &:hover {
                        color: #d11528;
                    }
                }
            }
            .group-list {
                display: flex;
                flex-wrap: wrap;
                margin: 0 20px;
                border: 1px solid #ccc;
                border-bottom: 0;
                border-right: 0;
                .group-item {
                    width: 50%;
                    border-bottom: 1px solid #ccc;
                    border-right: 1px solid #ccc;
                    &:nth-child(even) {
                        border-left: 0; 
                    }
                    .group-title {
                        position: relative;
                        padding: 21px 0 20px 18px;
                        text-align: left;
                        color: #d11528;
                        font-size: 22px;
                        &::before {
                            content: '';
                            position: absolute;
                            left: 0;
                            top: -1px;
                            width: 142px;
                            height: 3px;
                            background-color: #d11528;
                        }
                    }
                    .group-content {
                        height: 260px;
                        .content-item {
                            position: relative;
                            padding: 14px 56px 14px 40px;
                            text-align: left;
                            cursor: pointer;
                            font-size: 16px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            max-width: 100%;
                            overflow: hidden;
                            &::before {
                                content: '';
                                position: absolute;
                                left: 20px;
                                top: 50%;
                                margin-top: -3px;
                                width: 6px;
                                height: 6px;
                                border-radius: 50%;
                                background-color: #cccccc;
                            }
                            &:hover {
                                color: #d11528;
                                background-color: #fafafa;
                            }
                        }
                        .no-data-tips {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            width: 100%;
                            height: 100%;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
</style>
