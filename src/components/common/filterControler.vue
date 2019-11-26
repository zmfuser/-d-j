<template>
    <div class="filter-controler-wrap">
        <Dropdown trigger="click" placement="bottom-end">
            <div class="filter-btn">
                <div class="filter-icon"></div>
                <div class="text">筛选</div>
            </div>
            <div class="dropdown-content-wrap" slot="list">
                <Form ref="filterForm" :model="filterFormInfo" label-position="top">
                    <Row>
                        <Col span="24">
                            &nbsp;
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem>
                                <span class="form-label" slot="label">截止日期</span>
                                <div class="flex-box">
                                    <div class="flex-item">
                                        <Date-picker type="date" format="yyyy-MM-dd" placeholder="开始时间" :options="startTimeOptions" @on-change="startTimeChange" :value="filterFormInfo.startTime"></Date-picker>
                                    </div>
                                    <div class="flex-item">
                                        <Date-picker type="date" format="yyyy-MM-dd" placeholder="结束时间" :options="endTimeOptions" @on-change="endTimeChange" :value="filterFormInfo.endTime"></Date-picker>
                                    </div>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem>
                                <span class="form-label" slot="label">类目</span>
                                <div class="flex-box">
                                    <div class="channel-item" :class="filterFormInfo.channelCode==0?'selected':''" @click="channelSelect()">
                                        <span class="text">不限</span>
                                    </div>
                                    <template v-for="(item, i) of channelDataList">
                                        <div class="channel-item" :class="filterFormInfo.channelCode==item.channelCode?'selected':''" :key="i" @click="channelSelect(item)">
                                            <span class="text">{{ item.channelName }}</span>
                                        </div>
                                    </template>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row v-show="!isMyDeptView">
                        <Col span="24">
                            <FormItem style="margin-bottom:0;">
                                <span class="form-label" slot="label">党组织</span>
                                <div class="org-selector-content">
                                    <orgCollapseView :orgData="orgData" @getSelectedOrg="getSelectedOrg"></orgCollapseView>
                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div class="dropdown-footer-wrap">
                    <div class="footer-btn reset" @click="filterReset">恢复默认</div>
                    <div class="footer-btn confirm" @click="filterConfirm">确认筛选</div>
                </div>
            </div>
        </Dropdown>
    </div>
</template>
<script>
    import orgCollapseView from '@/components/common/orgCollapseView'
    import { mapActions } from 'vuex'
    export default {
        props: {
            channelAction: {
                type: String,
                default: ''
            },
            channelParams: {
                type: Object,
                default(){
                    return {};
                }
            },
            isMyDeptView: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                filterFormInfo: {
                    startTime: '',
                    endTime: '',
                    channelCode: 0,
                    accounts: []
                },

                startTimeOptions: {},
                endTimeOptions: {},

                channelDataList: [],
                orgData: []
            }
        },
        components: {
            orgCollapseView,
        },
        watch: {
            channelParams: {
                handler(channelParams) {
                    if(this.channelAction){
                        let params = {};
                        let type = 1;
                        if(this.channelAction == 'getThirdChannelData'){
                            params.upperCode = channelParams.channelType;
                            type = 0
                        }
                        this.$store.dispatch(this.channelAction, params).then(res => {
                            if(res.success){
                                for(const item of res.data){
                                    item.selected = false;
                                }
                                this.channelDataList = res.data;
                            }
                        });
                        if(!this.isMyDeptView) {
                            this.findOrgByAcc({type}).then(res => {
                                if(res.success){
                                    this.orgData = res.data;
                                }
                            });
                        }
                        
                    }
                },
                deep: true
            }
        },
        mounted(){
            if(this.channelAction){
                let params = {};
                let type = 1;
                if(this.channelAction == 'getThirdChannelData'){
                    params.upperCode = this.channelParams.channelType;
                    type = 0
                }
                this.$store.dispatch(this.channelAction, params).then(res => {
                    if(res.success){
                        for(const item of res.data){
                            item.selected = false;
                        }
                        this.channelDataList = res.data;
                    }
                });
                if(!this.isMyDeptView) {
                    this.findOrgByAcc({type}).then(res => {
                        if(res.success){
                            this.orgData = res.data;
                        }
                    });
                }
                
            }
        },
        methods: {
            startTimeChange(e){
                this.filterFormInfo.startTime = e;
                this.endTimeOptions = {
                    disabledDate: date => {
                        let startTime = e ? new Date(e).valueOf() : '';
                        return date && (date.valueOf() < startTime);
                    }
                }
            },
            endTimeChange(e){
                this.filterFormInfo.endTime = e;
                let endTime = e ? new Date(e).valueOf() - 1 * 24 * 60 * 60 * 1000 : '';
                if(!e) {
                    this.startTimeOptions = new Object();
                } else {
                    this.startTimeOptions = {
                        disabledDate: date => {
                            return date && (date.valueOf() > endTime);
                        }
                    }
                }         
            },
            getSelectedOrg(params){
                let list = params.selectedList;

                let oids = [];
                for(const org of list) {
                    oids = oids.concat(org.id)
                }
                
                this.filterFormInfo.oids = oids;
            },
            channelSelect(channel){
                if(channel){
                    this.filterFormInfo.channelCode = channel.channelCode;
                }else{
                    this.filterFormInfo.channelCode = 0;
                }
                // this.filterConfirm();
            },
            filterConfirm(){
                $eventBus.$emit('queryFilterData', {
                    filterFormInfo: this.filterFormInfo
                });
            },
            filterReset(){
                this.filterFormInfo = {
                    startTime: '',
                    endTime: '',
                    channelCode: 0,
                    accounts: []
                };
                $eventBus.$emit('filterReset');
                $eventBus.$emit('queryFilterData', {
                    filterFormInfo: this.filterFormInfo
                });
            },
            ...mapActions([
                'getThirdChannelData',
                'getWorkPlanChannel',
                'findOrgByAcc'
            ])
        },
    }
</script>
<style lang="less" scoped>
    .filter-controler-wrap {
        .filter-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 86px;
            height: 38px;
            background-color: #ffffff;
            border-radius: 6px;
            border: 1px solid #d11528;
            color: #d11528;
            font-size: 16px;
            cursor: pointer;
            .filter-icon {
                width: 18px;
	            height: 19px;
                margin-right: 10px;
                background: url('~@/images/dj_icon_sx.png') no-repeat;
                background-size: 100% 100%;
            }
        }
        .dropdown-content-wrap {
            position: relative;
            width: 340px;
            padding: 0 0 55px;
            .flex-box {
                display: flex;
                flex-wrap: wrap;
                padding: 0 10px;
                .flex-item {
                    flex: 1;
                    margin-right: 10px;
                    &:last-child {
                        margin-right: 0;
                    }
                }
                .channel-item {
                    width: 100px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    background-color: #f5f5f5;
                    border-radius: 3px;
                    font-size: 16px;
                    color: #333333;
                    text-align: center;
                    cursor: pointer;
                    &:nth-child(3n) {
                        margin-right: 0;
                    }
                    &:hover, &.selected {
                        color: #fff;
                        background-color: #d11528;
                    }
                }
            }
            .form-label {
                padding: 0 10px;
                font-size: 16px;
                color: #333333;
            }
            .org-selector-content {
                padding: 0 10px;
                max-height: 300px;
                overflow-y: auto;
                overflow-x: hidden;
                &::-webkit-scrollbar {  
                    width: 8px;
                    background-color: #a8a8a8;  
                }  
                
                &::-webkit-scrollbar-track {  
                    background-color: #fff;  
                }  
                
                &::-webkit-scrollbar-thumb {
                    width: 8px;
                    border-radius: 10px;  
                    box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
                    background-color: #a8a8a8;  
                }
            }
            .dropdown-footer-wrap {
                position: absolute;
                bottom: -5px;
                left: 0;
                right: 0;
                z-index: 9;
                display: flex;
                height: 55px;
                .footer-btn {
                    flex: 1;
                    line-height: 55px;
                    text-align: center;
                    font-size: 16px;
                    cursor: pointer;
                    &.reset {
                        border-radius: 0px 0px 0px 6px;
                        color: #333;
                        background-color: #f5f5f5;
                    }
                    &.confirm {
                        border-radius: 0px 0px 6px 0px;
                        color: #fff;
                        background-color: #d11528;
                    }
                }
            }
        }
    }
</style>