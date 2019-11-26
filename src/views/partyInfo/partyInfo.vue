<template>
    <div class="container-back">
        <div class="partyinfo-view-container">
        <tabsBar :tabsData="tabsData" @tabChange="tabChange" :defaultShowTab="defaultShowTab" tabsType="partyInfo"></tabsBar>
            <dataList :listTitle="moduleTitle" :actionUrl="actionUrl" :actionParams="actionParams" :countMapper="currentTab" openFilter>
                <template slot="headOpts">
                    <filterControler channelAction="getThirdChannelData" :channelParams="actionParams"></filterControler>
                </template>
            </dataList>
        </div>
    </div>
</template>

<script>
    import tabsBar from '@/components/common/tabsBar'
    import dataList from '@/components/common/dataList'
    import filterControler from '@/components/common/filterControler'
    import {mapGetters, mapActions} from 'vuex'
    export default {
        data(){
            return {
                tabsData: [
                    {
                        title: '经验交流',
                        type: 'experience',
                        countMap: 'jingyan',
                        count: 0
                    }, {
                        title: '党内培训',
                        type: 'train',
                        countMap: 'dangnei',
                        count: 0
                    }, {
                        title: '民主管理',
                        type: 'democratic',
                        countMap: 'minzhu',
                        count: 0
                    }
                ],
                defaultShowTab: '',
                moduleTitle: '经验交流',
                actionUrl: 'getPartyInfoListByType',
                actionParams: {channelType: 20},

                currentTab: ''
            }
        },
        computed: {
            ...mapGetters([
                'getCurrentNavi',
                'getDataListDefaultTab'
            ])
        },
        components: {
            tabsBar,
            dataList,
            filterControler
        },
        mounted() {
            let {name, params, query} = this.$route;
            if(this.getCurrentNavi != name){
                this.changeNaviPath(name);
            }
            if(query.type){
                this.defaultShowTab = query.type;
                if(query.type == 'experience'){
                    this.actionParams = {channelType: 20};
                }else if(query.type == 'train'){
                    this.actionParams = {channelType: 30};
                }else{
                    this.actionParams = {channelType: 40};
                }
            }
            this.currentTab = this.tabsData[0].countMap;
        },
        methods: {
            changeShowTab(){
                let routerName = this.getDataListDefaultTab.dataListType;
                if(routerName == this.getCurrentNavi){
                    this.defaultShowTab = this.getDataListDefaultTab.tabType;
                }
            },
            tabChange(params) {
                this.moduleTitle = params.tab.title;
                this.currentTab = params.tab.countMap;
                if(params.tab.type == 'experience'){
                    this.actionParams = {channelType: 20};
                }else if(params.tab.type == 'train'){
                    this.actionParams = {channelType: 30};
                }else{
                    this.actionParams = {channelType: 40};
                }
            },
            ...mapActions([
                'changeNaviPath',
                'changeDataListDefaultTab'
            ])
        },
        watch: {
            getDataListDefaultTab(){
                this.changeShowTab();
            }
        },
    }
</script>

<style lang="less" scoped>
    .container-back {
        background-color: #f7f7f7;
        .partyinfo-view-container {
            width: 1100px;
            margin: 0 auto;
            .collection-opts {
                .opt-item {
                    border: 1px solid #d11528;
                    color: #d11528;
                    >.icon {
                        background-color: #d11528;
                        &.delete-icon {
                            background: url('~@/images/my_icon_delete_set.png') no-repeat;
                            background-size: 100% 100%;
                        }
                        &.complete-icon {
                            width: 21px;
                            height: 14px;
                            background: url('~@/images/zz_icon_wc_set.png') no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                }
            }
            .edit-item-opt {
                .opt-item {
                    border: 1px solid #db811a;
                    color: #db811a;
                     >.icon.edit-icon {
                        background: url('~@/images/gl_icon_bj.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
        }
    }
</style>