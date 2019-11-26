<template>
    <div class="examine-data-container">
        <listHeader :listTitle="listTitle" openMarginBotton>
            <div class="slot-opts-wrap examine-opts" slot="headOpts">
                <template v-if="isDWManager">
                    <div class="opt-item" @click="viewMyData" v-show="!isViewMyData">
                        <div class="icon upload-icon"></div>
                        <div class="title">部门资料</div>
                    </div>
                    <div class="opt-item" @click="backToDefault" v-show="isViewMyData">
                        <div class="icon examine-icon"></div>
                        <div class="title">返回审核资料</div>
                    </div>
                </template>
                
                <div class="opt-item" @click="gotoPublishPage" v-if="!isDWManager">
                    <div class="icon upload-icon"></div>
                    <div class="title">上传</div>
                </div>
            </div>
        </listHeader>
        <tabsBar :tabsData="tabsData" noMarginBottom defaultBgColor="#ebebeb" @tabChange="tabChange" :isChangeSubNavi="false" tabsType="examine"></tabsBar>
        <dataList ref="dataList" :actionUrl="actionUrl" :actionParams="actionParams" :titleLinkSwitch="getLinkSwitch">
            <template v-slot:itemOpts="{dataItem}">
                <div class="slot-opts-wrap edit-item-opt">
                    <template v-if="dataItem.isRevocate == 0 && (isDWManager || isZBManager)">
                        <div class="opt-item opt-item-red" @click="revokeToDraft(dataItem)">
                            <div class="icon revoke-icon"></div>
                            <div class="titile">撤回</div>
                        </div>
                    </template>
                    <template v-else-if="dataItem.approve == 2 && dataItem.approveLevel == 2 && !isJTManager">
                        <div class="approve-tips">上级审核中...</div>
                    </template>
                    <template v-else-if="!isZBManager && isMyDatum == 'false' && curTabName == '待审核'">
                        <div class="opt-item" @click="examineData(dataItem)">
                            <div class="icon examine-icon"></div>
                            <div class="title">审核</div>
                        </div>
                    </template>
                    <template v-else-if="curTabName != '待审核' && isJTManager">
                        <div class="opt-item opt-item-red" @click="revokeCheck(dataItem)">
                            <!-- <div class="icon view-icon"></div> -->
                            <div class="title">撤销审核</div>
                        </div>
                    </template>
                </div>
            </template>
        </dataList>
        <examineModal v-show="showModal" :showModal="showModal" :content="detailObj" @hideModal="hideModal" :isViewMyData="isViewMyData"></examineModal>
    </div>
</template>

<script>
    import listHeader from '@/components/common/listHeader'
    import tabsBar from '@/components/common/tabsBar'
    import dataList from '@/components/common/dataList'
    import examineModal from './components/examineModal'
    import {mapGetters, mapActions} from 'vuex'
    export default {
        data(){
            return {
                listTitle: '审核资料',
                tabsData: [
                    {
                        title: '待审核',
                        status: 2,
                        countMap: 'unchecked',
                        count: 0
                    }, {
                        title: '未通过',
                        status: 1,
                        countMap: 'refuse',
                        count: 0
                    }, {
                        title: '已通过',
                        status: 0,
                        countMap: 'pass',
                        count: 0
                    }
                ],
                showModal: false,
                detailObj: {},
                isViewMyData: false,

                actionUrl: 'getCheckDatumList',
                actionParams: {status: 2, isMyDatum: 'false'},
                isMyDatum: 'false',
                curTabName: '待审核',
                curTabStatus: 2,
            }
        },
        computed: {
            isJTManager(){
                let {roleType} = this.getLoginUserInfo;
                if(roleType == '1'){
                    return true;
                }else{
                    return false;
                }
            },
            isDWManager(){
                let {roleType} = this.getLoginUserInfo;
                if(roleType == '2'){
                    return true;
                }else{
                    return false;
                }
            },
            isZBManager(){
                let {roleType} = this.getLoginUserInfo;
                if(roleType == '3'){
                    return true;
                }else{
                    return false;
                }
            },
            getLinkSwitch(){
                // console.log(this.curTabName);
                // if(this.curTabName == '待审核'){
                //     return true;
                // }
                // return false;
                return true;
            },
            ...mapGetters([
                'getCurrentNavi',
                'getLoginUserInfo'
            ])
        },
        components: {
            listHeader,
            tabsBar,
            dataList,
            examineModal
        },
        mounted(){
            let {name} = this.$route;
            if(this.getCurrentNavi != name){
                this.changeNaviPath(name);
            }
        },
        methods: {
            // 撤回为草稿状态
            revokeToDraft(dataItem) {
                console.log(dataItem)

                let params = {
                    id: dataItem.id,
                    isDraft: 1
                }

                this.essayChange(params).then(res => {
                    if(res.success) {
                        this.refreshDataList();
                        $eventBus.$emit('refreshTabBar', {
                            isMyDatum: this.isDWManager ? true : false,
                            currentTabName: this.curTabName
                        });
                        this.$Message.success('撤回成功');
                    } else {
                        this.$Message.error('撤回失败');
                    }
                })
            },
            // 撤销审核
            revokeCheck(dataItem) {
                console.log(dataItem);
                let params = {
                    id: dataItem.id,
                    status: 2
                }
                this.checkDatumById(params).then(res => {
                    if(res.success) {
                        this.refreshDataList();
                        $eventBus.$emit('refreshTabBar', {
                            isMyDatum: false,
                            currentTabName: this.curTabName
                        });
                        this.$Message.success('撤销审核成功');
                    } else {
                        this.$Message.error('撤销审核失败');
                    }
                })
            },
            examineData(dataItem) {
                let params = {
                    id: dataItem.id
                };
                this.getDataInfoDetail(params).then(res => {
                    if(res.success){
                        this.detailObj = res.data;
                        this.showModal = true;
                    }
                });
            },
            viewMyData(){
                this.listTitle = '部门资料';
                this.curTabName = '待审核';
                this.isViewMyData = true;
                this.isMyDatum = 'true';
                this.actionParams = {status: 2, isMyDatum: this.isMyDatum};
                $eventBus.$emit('refreshTabBar', {
                    isMyDatum: true,
                    currentTabName: this.curTabName
                });
            },
            backToDefault(){
                this.listTitle = '审核资料';
                this.curTabName = '待审核';
                this.isViewMyData = false;
                this.isMyDatum = 'false';
                this.actionParams = {status: 2, isMyDatum: this.isMyDatum};
                $eventBus.$emit('refreshTabBar', {
                    isMyDatum: false,
                    currentTabName: this.curTabName
                });
            },
            gotoPublishPage(){
                this.$router.push('informationPublish');
            },
            tabChange(params){
                console.log('params: ' + params.tab.title);
                this.curTabName = params.tab.title;
                this.curTabStatus = params.tab.status;
                this.actionParams = {status: this.curTabStatus, isMyDatum: this.isMyDatum};
            },
            hideModal(){
                this.showModal = false;
                console.log(this.curTabName);
                if(this.curTabName === '待审核') {
                    this.refreshDataList();
                    $eventBus.$emit('refreshTabBar', {
                        isMyDatum: false,
                        currentTabName: this.curTabName
                    });
                }   
            },
            refreshDataList(){
                if(this.isMyDatum == 'true'){
                    this.actionParams = {status: this.curTabStatus, isMyDatum: 'true'};
                }else{
                    this.actionParams = {status: this.curTabStatus, isMyDatum: 'false'};
                }
            },
            lookDetail(row) {
                this.$router.push({ name: 'details', query: { id: row.id }});
            },
            ...mapActions([
                'changeNaviPath',
                'getDataInfoDetail',
                'checkDatumById',
                'essayChange'
            ])
        },
    }
</script>

<style lang="less" scoped>
    .examine-data-container {
        width: 1100px;
        margin: 0 auto;
        .header-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 80px;
            padding-right: 20px;
            margin-bottom: 10px;
            background-color: #fff;
            .title {
                position: relative;
                padding-left: 25px;
                font-size: 30px;
                line-height: 22px;
                &::before {
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
        }
        .examine-opts {
            .opt-item {
                border: 1px solid #d11528;
                color: #d11528;
                >.icon {
                    background-color: #d11528;
                    &.upload-icon {
                        background: url('~@/images/gl_icon_up.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.examine-icon {
                        background: url('~@/images/gl_icon_v1_sh.png') no-repeat;
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
                background-color: #ffffff;
                border-radius: 6px;
                border: 1px solid #1a94db;
                font-size: 18px;
                color: #1a95db;
                .icon {
                    width: 18px;
                    height: 18px;
                    &.examine-icon {
                        background: url('~@/images/gl_icon_sh.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.view-icon {
                        height: 13px;
                        background: url('~@/images/gl_icon_ck.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.revoke-icon {
                        background: url('~@/images/my_icon_cehui.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
            .opt-item-red {
                border: 1px solid #d11528;
                color: #d11528;
            }
            .approve-tips {
                font-size: 18px;
                color: #e69617;
            }
        }
    }
</style>