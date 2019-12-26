<template>
    <div class="details-warp">
        <div class="details-content">
            <div class="workplan-status" :class="workPlanStatus.statusClass" v-if="showWorkplanStatus">
                <!-- <span class="status-text">{{ workPlanStatus.statusText }}</span> -->
            </div>
            <div class="approve-status" :class="approveStatus.statusClass" v-if="showApproveStatus && !fromIndex">
                <span class="status-text">{{ approveStatus.statusText }}</span>
            </div>

            <div class="detail-title">{{ detailInfo.title }}</div>
            <div class="detail-name-time">
                <div class="name-time">
                    <template v-if="showWorkplanStatus">
                        <div class="time">执行时间：{{ dateFormat(detailInfo.execTime) }}</div>
                    </template>
                    <template v-else>
                        <div class="time">{{ detailInfo.releasetime }}</div>
                    </template>
                    <div class="name">发布人：{{ detailInfo.author }}</div>
                    <div class="name">浏览数：{{ detailInfo.readnum }}</div>
                    <div class="readcount">{{ detailInfo.orgName }}</div>
                </div>
                <div class="collect" @click="collect" v-if="isShowCollect">
                    <div class="icon" :class="isCollect?'full':''"></div>
                    <div class="text" :class="isCollect?'black':''">{{ isCollect?'已收藏':'收藏' }}</div>
                </div>
                <div class="collect" @click="gotoEdit" v-if="!isNormalEmp && isShowEdit &&splitGetuserinfo()">
                    <div class="edit-icon"></div>
                    <div class="bg-text">变更</div>
                </div>
                <!-- <div class="collect" @click="handleReport" v-if="isShowReport">
                    <div class="report-icon"></div>
                    <div class="text">工作汇报</div>
                </div> -->
            </div>

            <div class="detail-content" v-html="detailInfo.text"></div>
        </div>

        <div class="plan-state">

        </div>

        <div class="download-warp">
            <div class="file-warp" v-for="(item,index) in detailInfo.aList" :key="index" v-show="item.status === 0">
                <div class="file-content">
                    <div class="file-name">{{ item.fileName }}</div>
                    <div class="file-size">{{ item.fileSize }}</div>
                    <!-- <div class="file-dele" v-if="!isNormalEmp" @click="deleteFile(item)"></div> -->
                </div>
                <div class="download-btn" @click="downloadFile(item)"></div>
            </div>
            
        </div>

        <div class="change-area" v-if="(detailInfo.changeReasons || []).length > 0">
            <div class="change" v-for="(item, index) in detailInfo.changeReasons" :Key="index">
                <div class="change-title">变更事由</div>
                <div class="change-time">{{item.createTime}}</div>
                <div class="change-content">{{item.title}}</div>
            </div>
        </div>
        <div class="plan-area" v-if="detailInfo.reportText">
            <div class="plan">
                <div class="plan-title">计划执行情况</div>
                <div class="plan-content">{{detailInfo.reportText}}</div>
            </div>         
        </div>

        <div class="download-warp">
            <div class="file-warp" v-for="(item,index) in detailInfo.aList" :key="index" v-show="item.status === 1">
                <div class="file-content">
                    <div class="file-name">{{ item.fileName }}</div>
                    <div class="file-size">{{ item.fileSize }}</div>
                </div>
                <div class="download-btn" @click="downloadFile(item)"></div>
            </div>       
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import util from '@/tools/util'
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
            sourceModule: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                detailInfo: {},
                isCollect: false,
                showWorkplanStatus: false,
                showApproveStatus: false,
                isShowCollect: false,
                isShowEdit: false,
                isShowReport: false,
                fromIndex: false
            }
        },
        computed: {
            ...mapGetters([
                'getLoginUserInfo'
            ]),
            isNormalEmp(){
                let {roleType} = this.getLoginUserInfo;
                if(roleType == '0'){
                    return true;
                }else{
                    return false;
                }
            },
            approveStatus(){
                let ret = {
                    statusClass: '',
                    statusText: ''
                };
                if(typeof this.detailInfo.approve != 'undefined'){
                    if(this.detailInfo.approve == '0'){
                        ret.statusClass = 'ap-status-0';
                        ret.statusText = '已通过';
                    }else if(this.detailInfo.approve == '1'){
                        ret.statusClass = 'ap-status-1';
                        ret.statusText = '未通过';
                    }else{
                        ret.statusClass = 'ap-status-2';
                        ret.statusText = '待审核';
                    }
                }
                return ret;
            },
            workPlanStatus(){
                let ret = {
                    statusClass: '',
                    statusText: ''
                };
                if(typeof this.detailInfo.workplanstatus != 'undefined'){
                    if(this.detailInfo.workplanstatus == '1'){
                        ret.statusClass = 'wp-status-1';
                        ret.statusText = '待执行'
                    }else if(this.detailInfo.workplanstatus == '2'){
                        ret.statusClass = 'wp-status-2';
                        ret.statusText = '执行中'
                    }else if(this.detailInfo.workplanstatus == '3'){
                        ret.statusClass = 'wp-status-3';
                        ret.statusText = '已执行'
                    } else {
                        ret.statusClass = 'wp-status-4';
                        ret.statusText = '未执行'
                    }
                }
                return ret;
            }
        },
        mounted(){
            this.loadDetailData();
        },
        methods: {
             splitGetuserinfo(){
                let {powerCodes}=this.getLoginUserInfo;
                this.powerCodesList=powerCodes.split(",")
                var result=this.powerCodesList.includes("info")
                return result
            },
            collect() {
                if(this.isCollect){
                    let params = {
                        essayId: this.detailInfo.id
                    }
                    this.singleDelRelation(params).then(res => {
                        if(res.success){
                            this.$Message.success('取消收藏成功！');
                            this.isCollect = false;
                        }
                    })
                }else{
                    let params = {
                        id: this.detailInfo.id
                    }
                    this.addtoEnshrine(params).then(res => {
                        if(res.success){
                            this.$Message.success('收藏成功！');
                            this.isCollect = true;
                        }
                    });
                }
            },
            gotoEdit(){
                if(this.detailInfo.isworkplan == '1'){
                    this.changeSubNaviPath('workPlanUpload');
                    this.$router.push({ name: 'workPlanUpload', params: { id: this.detailInfo.id, action: 'change' }});
                }else{
                    this.changeSubNaviPath('informationPublish');
                    this.$router.push({ name: 'informationPublish', params: { id: this.detailInfo.id }});
                }
                
            },
            // 工作汇报
            handleReport() {

            },
            downloadFile(file){
                if(file.url){
                    window.open(file.url);
                }
            },
            deleteFile(file){
                let params = {
                    id: [file.id],
                    eid: file.essayid
                };
                this.attachDelete(params).then(res => {
                    if(res.success){
                        this.$Modal.success({
                            title: '提示信息',
                            content: res.message
                        })
                        this.loadDetailData();
                    }else{
                        this.$Modal.info({
                            title: '提示信息',
                            content: res.message
                        })
                    }
                })
            },
            loadDetailData(){
                // let {params} = this.$route;
                let params= {}
                let {query} = this.$route;
                // query.isViewDeptData = query.isViewDeptData === 'true' ? true : false;
                this.fromIndex = (query.from && query.from === 'index') ? true : false;

                console.log(this.fromIndex);
                if(!util.isEmptyObject(query)){
                    console.log(query);
                    if((query.isViewDeptData && query.isViewDeptData !== 'false') || query.isViewDeptData === 'true'){
                        // this.isShowEdit = true;
                        this.isShowCollect = false;
                    }else{
                        // this.isShowEdit = false;
                        this.isShowCollect = true;
                    }
                    let id = query.id ? query.id : params.id;
                    params.id = id;
                    console.log(params);
                    this.getDataInfoDetail(params).then(res => {
                        if(res.success){
                            this.detailInfo = res.data;
                            if(this.detailInfo.isEnshrine == '1'){
                                this.isCollect = true;
                            }
                            if(this.detailInfo.isworkplan == '1'){
                                this.showWorkplanStatus = true;
                                this.showApproveStatus = false;
                                if(this.detailInfo.workplanstatus == '1' || this.detailInfo.workplanstatus == '2'){
                                }
                            }else{
                                this.showWorkplanStatus = false;
                                this.showApproveStatus = true;
                            }
                            /* if(typeof this.detailInfo.approve != 'undefined'){
                                this.showWorkplanStatus = false;
                                this.showApproveStatus = true;
                                
                            } */

                            if(((query.isViewDeptData && query.isViewDeptData !== 'false') || query.isViewDeptData === 'true') && this.detailInfo.workplanstatus === 1) {
                                this.isShowEdit = true;
                            }

                            if(((query.isViewDeptData && query.isViewDeptData !== 'false') || query.isViewDeptData === 'true') && this.detailInfo.workplanstatus === 2) {
                                this.isShowReport = true;
                            }
                        }
                    });
                }
            },
            dateFormat(date){
                let ret = '';
                if(date){
                    ret = util.translateDateTimeToStr(date, 'yyyy-MM-dd');
                }
                return ret;
            },
            ...mapActions([
                'getDataInfoDetail',
                'addtoEnshrine',
                'singleDelRelation',
                'attachDownload',
                'attachDelete',
                'changeSubNaviPath'
            ])
        },
    }
</script>

<style lang="less" scoped>
    .details-warp{
        width: 1100px;
        height: 100%;
        margin: 0 auto;
        padding-top: 15px;
        position: relative;
        .details-content {
            margin-top: 30px;
            position: relative;
            padding: 0 65px 80px 60px;
            background: #ffffff;
            .workplan-status, .approve-status {
                width: 172px;
                height: 74px;
                position: absolute;
                left: -15px;
                top: -17px;
                &.wp-status-1 {
                    background: url('~@/images/gl_icon_zx_dzx.png') no-repeat;
                    background-size: 100% 100%;
                    left: -20px;
                    top: -32px;
                }
                &.wp-status-2 {
                    background: url('~@/images/gl_icon_zx_zxz.png') no-repeat;
                    background-size: 100% 100%;
                    left: -20px;
                    top: -32px;
                }
                &.wp-status-3 {
                    background: url('~@/images/gl_icon_zx_yzx.png') no-repeat;
                    background-size: 100% 100%;
                    left: -20px;
                    top: -32px;
                }
                &.wp-status-4 {
                    background: url('~@/images/gl_icon_zx_wzx.png') no-repeat;
                    background-size: 100% 100%;
                    left: -20px;
                    top: -32px;
                }
                &.ap-status-2 {
                    background: url('~@/images/gl_icon_sh_dsh.png') no-repeat;
                    background-size: 100% 100%;
                }
                &.ap-status-1 {
                    background: url('~@/images/gl_icon_sh_wtg.png') no-repeat;
                    background-size: 100% 100%;
                }
                &.ap-status-0 {
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
        }
        .detail-title{
            font-size: 36px;
            letter-spacing: 0px;
            color: #333333;
            padding-top: 70px;
            padding-bottom: 30px;
            text-align: center;
        }
        .detail-name-time{
            display: flex;
            flex-direction: row;
            margin-bottom: 30px;
            border-bottom: solid 1px #ccc;
            font-size: 14px;
            .name-time{
                display: flex;
                flex-direction: row;
                flex: 1;
                color: #999999;
                margin-top: 17px;
                margin-bottom: 30px;
                .time, .name{
                    margin-right: 40px;
                }
            }
            .collect{
                margin-top: 17px;
                margin-bottom: 30px;
                color: #d11528;
                display: flex;
                flex-direction: row;
                align-items: center;
                .icon{
                    width: 17px;
	                height: 18px;
                    background: url('~@/images/dj_icon_sc_nor.png') no-repeat;
                    background-size: 100% 100%;
                    margin-right: 13px;
                    &.full {
                        background: url('~@/images/dj_icon_sc_set.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
                .text {
                    &.black {
                        color: #999;
                    }
                }
                .edit-icon{
                    width: 17px;
	                height: 18px;
                    background: url('~@/images/gl_icon_bj.png') no-repeat;
                    background-size: 100% 100%;
                    margin-right: 13px;
                }
                .report-icon {
                    width: 17px;
	                height: 18px;
                    background: url('~@/images/zz_icon_xg_set.png') no-repeat;
                    background-size: 100% 100%;
                    margin-right: 13px;
                }
                .bg-text {
                    color: #db811a;
                }
            }
        }
        .detail-content{
            font-size: 16px;
            line-height: 27.7px;
            color: #333333;
        }
    }

.download-warp{
    text-align: left;
    margin-top: 17px;
    margin-bottom: 18px;
    display: flex;
    flex-direction: column;
    .file-warp{
        
        display: flex;
        flex-direction: row;
        align-items: center;
        .file-content{
            height: 100%;
            width: 307px;
            padding: 13.1px 0px 13.1px 24px;
            background-color: #fafafa;
            border: solid 1px #d1d1d1;
            position: relative;
            margin-bottom: 10px;
            .file-name{
                font-size: 16px;
                color: #333333;
                word-break: break-all;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .file-size{
                font-size: 14px;
                color: #999999;
            }
            .file-dele{
                width: 26px;
                height: 26px;
                background: url('~@/images/gl_icon_down_gb.png') no-repeat;
                background-size: 100% 100%;
                cursor: pointer;
                position: absolute;
                top: -13px;
                right: -13px;
            }
        }
        .download-btn{
            width: 28px;
            height: 23px;
            cursor: pointer;
            margin-left: 30px;
            background: url('~@/images/gl_icon_down.png') no-repeat;
            background-size: 100% 100%;
        }
    }
    
}

.change-area {
    margin-bottom: 20px;
    .change {
        margin-top: 20px;
        position: relative;
        background: #fff;
        .change-title {
            position: absolute;
            left: -10px;
            top: -10px;
            width: 145px;
            height: 56px;
            line-height: 56px;
            text-align: center;
            vertical-align: middle;
            font-size: 16px;
            background-image: linear-gradient(-90deg, #ffeae0 0%, #f5dace 100%), linear-gradient(#ebebeb, #ebebeb);
	        background-blend-mode: normal, normal;
	        border-radius: 6px 6px 0px 6px;
        }
        .change-time {
            position: absolute;
            left: 135px;
            top: 0;
            width: 145px;
            height: 46px;
            line-height: 46px;
            text-align: center;
            vertical-align: middle;
            font-size: 16px;
            background-image: linear-gradient(90deg, #f0dfd8 0%, #f5ddd2 100%), linear-gradient(#ebebeb, #ebebeb);
	        background-blend-mode: normal, normal;
	        border-radius: 0px 0px 26px 0px;
        }
        .change-content {
            font-size: 16px;
            padding: 60px 60px 20px 60px;
        }
    }
}
.plan-area {
    margin-bottom: 20px;
    .plan {
        margin-top: 20px;
        position: relative;
        background: #fff;
        .plan-title {
            position: absolute;
            left: -10px;
            top: -10px;
            width: 176px;
            height: 56px;
            line-height: 56px;
            text-align: center;
            vertical-align: middle;
            font-size: 16px;
	        background-image: linear-gradient(-90deg,#fff6e0 0%,#f5e9ce 100%), 
	        linear-gradient(#ebebeb, #ebebeb);
	        background-blend-mode: normal, normal;
	        border-radius: 6px 6px 26px 6px;
        }
        // .change-time {
        //     position: absolute;
        //     left: 135px;
        //     top: 0;
        //     width: 145px;
        //     height: 46px;
        //     line-height: 46px;
        //     text-align: center;
        //     vertical-align: middle;
        //     font-size: 16px;
        //     background-image: linear-gradient(90deg, #f0dfd8 0%, #f5ddd2 100%), linear-gradient(#ebebeb, #ebebeb);
	    //     background-blend-mode: normal, normal;
	    //     border-radius: 0px 0px 26px 0px;
        // }
        .plan-content {
            font-size: 16px;
            padding: 60px 60px 20px 60px;
        }
    }
}
</style>