<template>
    <div class="data-list-container">
        <listHeader :listTitle="listTitle" lessPadding>
            <template slot="headOpts">
                <slot name="headOpts"></slot>
            </template>
        </listHeader>

        <div class="data-content">
            <template v-if="listData.length">
                <CheckboxGroup v-model="checkedItems" @on-change="emitCheckedData">
                    <div class="data-item" :class="itemDelSwitch?'delMode':''" v-for="(item, i) of listData" :key="i">
                        <template v-if="isWorkPlanList">
                            <div class="workpaln-status-tag" :class="getWorkPlanStatus(item)"></div>
                        </template>
                        <div class="title-wrap">
                            <div class="item-checkbox-wrap" v-if="itemDelSwitch">
                                <Checkbox :label="item.rid"></Checkbox>
                            </div>
                            <div style="display:flex;max-width: 800px;" :class="titleLinkSwitch?'':'no-click'" @click="lookDetail(item)">
                                <div class="category" v-if="item.channelName">【{{ item.channelName }}】</div>
                                <!-- <div class="title" :title="item.title">{{ item.title }}</div> -->
                                <div class="title">{{ item.title }}</div>
                            </div>
                            <div class="item-opt-wrapper">
                                <slot name="itemOpts" :dataItem="item"></slot>
                            </div>
                        </div>
                        <!-- <div class="summary" :title="getSummary(item.text)">
                            <p >{{ getSummary(item.text) }}</p>
                        </div> -->
                        <div class="summary">
                            <p >{{ getSummary(item.text) }}</p>
                        </div>
                        <div class="resource-wrap">
                            <div class="read-count" v-show="titleLinkSwitch && item.readnum">浏览数：{{ item.readnum }}</div>
                            <div class="source">{{ item.orgName || item.channelName }}</div>
                            <template v-if="item.execTime">
                                <div class="date">执行时间：{{ translateDate(item.execTime, 'yyyy-MM-dd') }}</div>
                            </template>
                            <template v-else>
                                <div class="date" v-if="item.isWorkPlan !== 1">{{ translateDate(item.releasetime || item.releaseTime || item.updatetime || item.createTime) }}</div>
                                <div class="date" v-if="item.isWorkPlan === 1">执行时间：{{translateDate1(item.releaseTime)}}</div>
                            </template>
                        </div>
                    </div>
                </CheckboxGroup>
            </template>
            <template v-else>
                <div class="data-item nodata">
                    <div class="no-data-tips">
                        <span>暂无数据。</span>
                    </div>
                </div>
            </template>
        </div>
        <div class="page-footer-wrap">
            <pagers :totalCount="totalCount" :pageSize="pageSize" @pageChange="pageChange"></pagers>
        </div>
    </div>
</template>

<script>
    import pagers from '@/components/common/pagers'
    import listHeader from '@/components/common/listHeader'
    import util from '@/tools/util'
    import {mapGetters, mapActions} from 'vuex'
    export default {
        props: {
            actionUrl: {
                type: String,
                default: ''
            },
            actionParams: {
                type: Object,
                default(){
                    return {};
                }
            },
            listTitle: {
                type: String,
                default: ''
            },
            itemDelSwitch: {
                type: Boolean,
                default: false
            },
            titleLinkSwitch: {
                type: Boolean,
                default: true
            },
            openFilter: {
                type: Boolean,
                default: false
            },
            detaiRouter: {
                type: String,
                default: 'details'
            },
            countMapper: {
                type: String,
                default: ''
            }
        },
        data(){
            return {
                listData: [],
                pageSize: 10,
                totalCount: 0,
                currentPage: 1,
                checkedItems: [],

                filterFormInfo: {
                    startTime: '',
                    endTime: '',
                    channelCode: 0,
                    accounts: []
                }
            }
        },
        computed: {
            isWorkPlanList(){
                if(this.actionUrl == 'getMyWorkPlanList'){
                    return true;
                }
                return false;
            },
            ...mapGetters([
                'getLoginUserInfo',
            ])
        },
        components: {
            pagers,
            listHeader
        },
        created(){
            $eventBus.$on('refreshDataList', () => {
                
                this.getListData();
                
            });
            $eventBus.$on('queryFilterData', params => {
                this.filterFormInfo = params.filterFormInfo;
                this.getListData('filter');
            });
        },
        mounted(){
            this.$nextTick(() => {
                this.getListData();
            });
        },
        methods: {
            lookDetail(row) {
                if(this.titleLinkSwitch){
                    let detailId = row.id;
                    if(!detailId){
                        detailId = row.eid;
                    }
                    let isViewDeptData = false;
                    if(this.actionUrl == 'getMyWorkPlanList'){
                        isViewDeptData = true;
                    }

                    let from = this.$route.name === 'partyInfo' || this.$route.name === 'draftBox' || this.$route.name === 'myOrganization';
                    this.$router.push({ name: this.detaiRouter, query: { id: detailId, isViewDeptData, from: from ? 'index' : '' }});
                }
            },
            getListData(type = ''){
                this.checkedItems = [];
                this.$Spin.show();
                if(this.actionUrl){
                    let params = util.deepClone(this.actionParams);
                    if(this.actionUrl == 'getMyOrgListByType' && typeof params.account == 'undefined'){
                        params.account = this.getLoginUserInfo.account;
                    }

                    // if(this.actionUrl === 'getMyWorkPlanList') {
                    //     params.workPlanStatus = 
                    // }
                    params.currentPage = this.currentPage;
                    params.pageSize = this.pageSize;
                    if(params.action === 'getMyUpload' || params.action === 'getDrafts') {

                    }else if(this.openFilter && type == 'filter'){
                        params.filter = this.filterFormInfo;
                    }else{
                        params.filter = {
                            startTime: '',
                            endTime: '',
                            channelCode: 0,
                            accounts: []
                        };
                        this.filterFormInfo = {
                            startTime: '',
                            endTime: '',
                            channelCode: 0,
                            accounts: []
                        };
                    }
                    this.$store.dispatch(this.actionUrl, params).then(res => {
                        if(res.success){
                            if(this.countMapper){
                                $eventBus.$emit('setTabCount', {
                                    countMapper: this.countMapper,
                                    count: res.data.totalCount
                                })
                            }
                            this.listData = res.data.rows;
                            // this.pageSize = res.data.pageSize;
                            this.totalCount = res.data.totalCount;
                        }
                        this.$Spin.hide();
                    }).catch(error => {
                        console.log('error: ', error);
                    })
                }else{
                    this.$Spin.hide();
                }
            },
            emitCheckedData(data){
                let retDatas = [];
                for(const item of this.listData){
                    if(data.indexOf(item.rid) != -1){
                        retDatas.push({
                            essayid: item.eid,
                            id: item.rid
                        })
                    }
                }
                this.$emit('checkedChange', {
                    checkedData: retDatas
                });
            },
            pageChange(params){
                this.currentPage = params.currentPage;
                this.getListData();
            },
            translateDate(date, fmt = 'yyyy-MM-dd'){
                return util.translateDateTimeToStr(date, fmt);
            },
            translateDate1(date, fmt = 'yyyy-MM-dd'){
                return util.translateDateTimeToStr(date, fmt);
            },
            getSummary(str){
                return util.removeTagFromStr(str);
            },
            getWorkPlanStatus(item){
                let ret = '';
                if(typeof item.workPlanStatus_ch != 'undefined'){
                    switch(item.workPlanStatus_ch){
                        case '待执行':
                            ret = 'status-dzx';
                            break;
                        case '执行中':
                            ret = 'status-zxz';
                            break;
                        case '已执行':
                            ret = 'status-yzx';
                            break;
                        case '未执行':
                            ret = 'status-wzx';
                            break;
                    }
                }
                return ret;
            },
            ...mapActions([
                'changeSpinStatus',
                'changeSubNaviPath'
            ])
        },
        watch: {
            actionUrl(){
                this.currentPage = 1;
                this.getListData();
            },
            actionParams: {
                handler(){
                    this.currentPage = 1;
                    this.getListData();
                },
                deep: true
            }
        },
    }
</script>

<style lang="less" scoped>
    .data-list-container {
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 25px 20px 10px 0;
            background-color: #fff;
            >.title {
                position: relative;
                padding-left: 20px;
                font-size: 26px;
                color: #333333;
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
        .data-content {
            .data-item {
                position: relative;
                padding: 20px 20px 20px 37px;
                margin-bottom: 2px;
                background-color: #ffffff;
                &.nodata {
                    cursor: default;
                }
                &.delMode {
                    .title-wrap {
                        &::before {
                            display: none;
                        }
                    }
                }
                .workpaln-status-tag {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 46px;
                    height: 46px;
                    &.status-dzx {
                        background: url('~@/images/gl_icon_gz_dai.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.status-zxz {
                        background: url('~@/images/gl_icon_gz_zxz.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.status-yzx {
                        background: url('~@/images/gl_icon_gz_yi.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.status-wzx {
                        background: url('~@/images/gl_icon_gz_wei.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
                .title-wrap {
                    position: relative;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    margin-bottom: 26px;
                    &::before {
                        content: '';
                        position: absolute;
                        left: -18px;
                        top: 50%;
                        margin-top: -2px;
                        width: 4px;
                        height: 4px;
                        border-radius: 50%;
                        background-color: #cccccc;
                    }
                    .category {
                        font-size: 18px;
                        color: #d11528;
                        font-weight: bold;
                        cursor: default;
                        // flex: 0 0 108px;
                    }
                    .title {
                        font-size: 18px;
                        color: #333333;
                        font-weight: bold;
                        cursor: pointer;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        // max-width: 800px;
                        flex: 1;
                        &:hover {
                            color: #d11528;
                        }
                        
                    }
                    .no-click {
                        cursor: default;
                        .title {
                            cursor: default;
                            &:hover {
                                color: #333333;
                            }
                        }
                    }
                    
                    
                    .item-opt-wrapper {
                        position: absolute;
                        right: 0;
                    }
                }
                .summary {
                    position: relative;
                    max-height: 54px;
                    padding-right: 19px;
                    overflow: hidden;
                    margin-bottom: 10px;
                    line-height: 28px;
                    text-align: left;
                    font-size: 16px;
                    color: #333333;
                    &::before {
                        content: '';
                        position: absolute;
                        right: -15px;
                        width: 30px;
                        height: 28px;
                        background: #fff;
                        z-index: 1;
                    }
                    &::after {
                        content: '...';
                        position: absolute;
                        bottom: -3px;
                        right: -15px;
                        width: 30px;
                        font-size: 16px;
                        background-color: #fff;
                    }
                }
                .resource-wrap {
                    display: flex;
                    justify-content: flex-end;
                    font-size: 14px;
                    color: #999999;
                    .source, .read-count {
                        margin-right: 40px;
                    }
                }
            }
        }
    }
</style>
<style lang="less">
    .data-list-container {
        .data-item {
            .ivu-checkbox {
                .ivu-checkbox-inner {
                    width: 20px;
                    height: 20px;
                    &::after {
                        width: 8px;
                        height: 14px;
                        top: 0px;
                        left: 5px;
                    }
                }
            }
            .ivu-checkbox+span {
                display: none;
            }
        }
    }
</style>
