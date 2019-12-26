<template>
    <!-- <div class="examine-modal-container" v-show="showModal"> -->
        <Modal v-model="showModal" :width="modalWidth" :mask-closable="false" class-name="examine-modal" :transfer="false">
            <div class="modal-close" slot="close" @click="hideModal">
                <Icon type="md-close"/>
            </div>
            <div class="modal-header" slot="header">
                <div class="status-icon" :class="approveStatus.statusClass">
                    <span class="status-text">{{ approveStatus.statusText }}</span>
                </div>
                <div class="title-wrap">
                    <h1 class="title">{{ content.title }}</h1>
                    <div class="other-info">
                        <span class="author">发布人：{{ content.author }}</span>
                        <span class="date">{{ content.createtime }}</span>
                        <span class="date">{{ content.orgName }}</span>
                    </div>
                </div>
            </div>
            <div class="modal-content">
                <div class="main-text" v-html="content.text"></div>
            </div>
            <div class="modal-footer" slot="footer">
                <template v-if="approveStatus.statusText == '待审核'">
                    <div class="approve-btn bgc-red" @click="approve(0)" v-show="!isZBManager">
                        <span class="text">通过</span>
                    </div>
                    <div class="approve-btn" @click="approve(1)" v-show="!isZBManager">
                        <span class="text">不通过</span>
                    </div>
                    
                </template>
                <template v-else-if="approveStatus.statusText == '未通过' ">
                   
                    <div class="approve-btn" @click="gotoEditPage">
                        <span class="text">编辑</span>
                    </div>
                </template>
            </div>
        </Modal>
    <!-- </div> -->
</template>

<script>
    import util from '@/tools/util'
    import {mapGetters, mapActions} from 'vuex'
    export default {
        props: {
            showModal: {
                type: Boolean,
                default: false
            },
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
            content: {
                type: Object,
                default(){
                    return {};
                }
            },
            isViewMyData: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                modalState: true,
                modalWidth: 1000,
            }
        },
        computed: {
            approveStatus() {
                let ret = {
                    statusClass: '',
                    statusText: ''
                };
                if(!util.isEmptyObject(this.content)){
                    if(this.content.approve == 0){
                        ret = {
                            statusClass: 'status-0',
                            statusText: '已通过'
                        };
                    }else if(this.content.approve == 1){
                        ret = {
                            statusClass: 'status-1',
                            statusText: '未通过'
                        };
                    }else if(this.content.approve == 2){
                        ret = {
                            statusClass: 'status-2',
                            statusText: '待审核'
                        };
                    }
                }
                return ret;
            },
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
            ...mapGetters([
                'getLoginUserInfo'
            ])
        },
        methods: {
        
            approve(approveType){
                let params = {
                    id: this.content.id,
                    status: approveType
                }
                let _this = this;
                _this.checkDatumById(params).then(res => {
                    if(res.success){
                        _this.$Message.success(res.message);
                        _this.hideModal();
                    }else{
                        _this.$Message.error(res.message);
                    }
                });
            },
            gotoEditPage(){
                this.hideModal();
                this.changeSubNaviPath('informationPublish');
                this.$router.push({ name: 'informationPublish', params: { id: this.content.id }});
            },
            hideModal(){
                this.$emit('hideModal');
            },
            ...mapActions([
                'checkDatumById',
                'changeSubNaviPath'
            ])
        },
    }
</script>

<style lang="less">
    .examine-modal {
        .ivu-modal {
            .ivu-modal-header, .ivu-modal-footer {
                padding: 0;
                border: 0;
            }
            .ivu-modal-body {
                padding: 0;
            }
            .modal-close {
                height: 20px;
                font-size: 20px;
                color: #666;
                .ivu-icon {
                    vertical-align: top;
                }
            }
        }
        .modal-header {
            position: relative;
            padding: 67px 40px 0;
            .status-icon {
                position: absolute;
                top: -16px;
                left: -17px;
                width: 200px;
                height: 70px;
                &.status-2 {
                    background: url('~@/images/gl_icon_sh_dsh.png') no-repeat;
                    background-size: 100% 100%;
                }
                &.status-1 {
                    background: url('~@/images/gl_icon_sh_wtg.png') no-repeat;
                    background-size: 100% 100%;
                }
                &.status-0 {
                    background: url('~@/images/gl_icon_sh_ytg.png') no-repeat;
                    background-size: 100% 100%;
                }
                .status-text {
                    display: block;
                    height: 72%;
                    width: 90%;
                    padding: 8% 0;
                    font-size: 18px;
                    text-align: center;
                    color: #fff;
                }
            }
            .title-wrap {
                padding-bottom: 20px;
                border-bottom: 1px solid #cccccc;
                .title {
                    margin-bottom: 40px;
                    font-size: 30px;
                    line-height: 49px;
                    color: #333333;
                }
                .other-info {
                    display: flex;
                    justify-content: space-between;
                    width: 40%;
                    font-size: 14px;
                    color: #999999;
                }
            }
        }
        .modal-content {
            padding: 20px 40px;
            .main-text {
                font-size: 16px;
                color: #333333;
            }
        }
        .modal-footer {
            display: flex;
            justify-content: center;
            padding-bottom: 38px;
            .approve-btn {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 110px;
                height: 38px;
                margin-right: 40px;
                border-radius: 6px;
                border: 1px solid #c21717;
                font-size: 18px;
                color: #c21717;
                cursor: pointer;
                &:last-child {
                    margin-right: 0;
                }
            }
            .bgc-red {
                background-color: #c21717;
                color: #fff;
            }
        }
    }
</style>