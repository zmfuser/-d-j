<template>
    <div class="my-org-warp">
        <tabsBar :tabsData="tabsData" @tabChange="tabChange" :defaultShowTab="defaultShowTab"></tabsBar>
        <dataList :listTitle="moduleTitle" :itemDelSwitch="showCheckBox" :actionUrl="actionUrl" :actionParams="actionParams" @checkedChange="saveChangedData">
            <div class="slot-opts-wrap collection-opts" slot="headOpts" v-if="moduleTitle =='收藏' ">
                <template v-if="!showCheckBox">
                    <div class="opt-item" @click="showCheckBox=true">
                        <div class="icon delete-icon"></div>
                        <div class="title">删除</div>
                    </div>
                </template>
                <template v-else>
                    <div class="opt-item" @click="delRelationAction">
                        <div class="icon complete-icon"></div>
                        <div class="title">确认</div>
                    </div>
                    <div class="opt-item" @click="showCheckBox=false">
                        <div class="icon cancel-icon"></div>
                        <div class="title">取消</div>
                    </div>
                </template>
            </div>
        </dataList>
    </div>
</template>

<script>
    import tabsBar from '@/components/common/tabsBar'
    import dataList from '@/components/common/dataList'
    import {mapGetters, mapActions} from 'vuex'
    export default {
        data(){
            return {
                moduleTitle:'组织生活',
                showCheckBox:false,

                tabsData: [
                    {
                        title: '组织生活',
                        type: 'life',
                        channelCode: '1020'
                    }, {
                        title: '党内活动',
                        type: 'activity',
                        channelCode: '1030'
                    }, {
                        title: '党内关怀',
                        type: 'care',
                        channelCode: '1060'
                    }, {
                        title: '考核管理',
                        type: 'kaohe',
                        channelCode: '1040'
                    }, {
                        title: '党员风采',
                        type: 'fengcai',
                        channelCode: '1050'
                    }, {
                        title: '收藏',
                        type: 'collection',
                        channelCode: ''
                    }
                ],
                defaultShowTab: '',
                actionUrl: 'getMyOrgListByType',
                account: '',
                actionParams: {channelCode: 1020, account: this.account},
                checkedDataList: [],
            }
        },
        computed: {
            ...mapGetters([
                'getLoginUserInfo',
                'getCurrentNavi',
                'getDataListDefaultTab'
            ])
        },
        components: {
            tabsBar,
            dataList
        },
        created(){
            this.account = this.getLoginUserInfo.account;
        },
        mounted() {
            let {name, params, query} = this.$route;
            if(this.getCurrentNavi != name){
                this.changeNaviPath(name);
            }
            if(query.type){
                this.defaultShowTab = query.type;
                this.actionParams = {channelCode: params.channelCode, account: this.account};
            }
        },
        methods: {
            changeShowTab(){
                let routerName = this.getDataListDefaultTab.dataListType;
                if(routerName == this.getCurrentNavi){
                    this.defaultShowTab = this.getDataListDefaultTab.tabType;
                }
            },
            tabChange(params) {
                this.showCheckBox = false;
                this.moduleTitle = params.tab.title;
                this.actionParams = {channelCode: params.tab.channelCode, account: this.account};
            },
            deleteRow(){
                this.showCheckBox = !this.showCheckBox;
            },
            delRelationAction(){
                if(!this.showCheckBox){
                    return;
                }
                if(this.checkedDataList.length){
                    let params = {
                        relations: this.checkedDataList
                    }
                    this.batchDelRelation(params).then(res => {
                        if(res.success){
                            this.$Message.success('删除成功！');
                            this.actionParams = {channelCode: '', account: this.getLoginUserInfo.account};
                        }
                    })
                }else{
                    this.showCheckBox = false;
                }
            },
            saveChangedData(e){
                this.checkedDataList = e.checkedData;
            },
            ...mapActions([
                'changeNaviPath',
                'changeDataListDefaultTab',
                'batchDelRelation'
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
    .my-org-warp{
        width: 1100px;
        margin: 0 auto;
        .collection-opts {
            .opt-item {
                border: 1px solid #d11528;
                color: #d11528;
                &.disabled {
                    color: #c5c8ce;
                    background-color: #f7f7f7;
                    border-color: #dcdee2;
                    cursor: not-allowed;
                    .delete-icon {
                        background: url('~@/images/my_icon_delete_nor.png') no-repeat !important;
                        background-size: 100% 100% !important;
                    }
                    .complete-icon {
                        background: url('~@/images/zz_icon_wc_nor.png') no-repeat !important;
                        background-size: 100% 100% !important;
                    }
                    .edit-icon {
                        background: url('~@/images/zz_icon_xg_nor.png') no-repeat !important;
                        background-size: 100% 100% !important;
                    }
                    .cancel-icon {
                        background: url('~@/images/zz_icon_red_quxiao.png') no-repeat !important;
                        background-size: 100% 100% !important;
                    }
                }
                >.icon {
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
                    &.edit-icon {
                        width: 17px;
                        height: 18px;
                        background: url('~@/images/zz_icon_xg_set.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.cancel-icon {
                        background: url('~@/images/zz_icon_red_quxiao.png') no-repeat !important;
                        background-size: 100% 100% !important;
                    }
                }
            }
        }
    }
</style>