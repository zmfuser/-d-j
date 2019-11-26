<template>
    <div class="workplan-upload-wrapper">
        <div class="header-wrap">
            <h1 class="title">{{title}}</h1>
            <div class="slot-opts-wrap publish-opts">
                <div class="opt-item bgc-red" @click="publishFormData">
                    <div class="icon publish-icon"></div>
                    <div class="title">{{buttonName}}</div>
                </div>
            </div>
        </div>
        <div class="form-content">
            <Form ref="workPlanForm" :model="workPlanInfo" :rules="workPlanValidateRules" :label-width="120" label-position="left">
                <Row>
                    <Col span="24">
                        <FormItem label="计划类目" prop="channeltype">
                            <RadioGroup v-model="workPlanInfo.channeltype">
                                <template v-for="(item, i) of workPlanChannel">
                                    <Radio :label="item.channelCode" :key="i">{{ item.channelName }}</Radio>
                                </template>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="标题" class="flex-block" prop="title">
                            <div class="inputer-wrap">
                                <Input v-model.trim="workPlanInfo.title"></Input>
                            </div>
                            <div class="ext">
                                <Checkbox v-model="workPlanInfo.isBold" :true-value="1" :false-value="0" class="is-blod">加粗标红</Checkbox>
                            </div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="附件上传">
                            <Upload ref="upload" :action="attuploadurl" multiple name="file" :show-upload-list="false" :with-credentials="true" :headers="headers" :before-upload="handleUpload" :on-success="handleSuccess" :on-error="handleError">
                                <Button class="bgc-red">添加附件</Button>
                            </Upload>
                            <div class="attach-result-content">
                                <div class="attach-item" v-for="(att, i) of defaultFilesList" :key="i">
                                    <span class="att-title" :title="att.name || att.fileName">{{ att.name || att.fileName }}</span>
                                    <div class="att-del" @click="deleteFile(att)">
                                        <Icon type="md-close"/>
                                    </div>
                                </div>
                            </div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="开始执行时间" prop="execTime">
                            <Date-picker type="date" format="yyyy-MM-dd" :value="workPlanInfo.execTime" :options="execTimeOptions" @on-change="changeStartDate"></Date-picker>
                            <!-- <el-date-picker type="datetime" value-format="yyyy-MM-dd HH"	format="yyyy-MM-dd HH" v-model="workPlanInfo.execTime" :options="execTimeOptions" @change="changeStartDate"></el-date-picker> -->
                            <!-- <div class="tips">
                                <span>注：</span>
                                <span>
                                    <p>1. 开始执行时间精确到小时，分钟固定为00分</p>
                                    <p>2. 如果计划需要提醒，请选择两小时以后的时间</p>
                                </span>
                            </div> -->
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="状态">
                            <RadioGroup v-model="workPlanInfo.workplanstatus">
                                <Radio :label="1">待执行</Radio>
                                <template v-if="workPlanInfo.id">
                                    <Radio :label="2">执行中</Radio>
                                    <Radio :label="3" v-show="!isChange">已执行</Radio>
                                    <Radio :label="4" v-show="isChange">未执行</Radio>
                                </template>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row v-if="isChange" style="margin-top: 20px">
                    <Col span="24">
                        <FormItem label="变更理由" prop="changeReason">
                            <Input v-model="workPlanInfo.changeReason" type="textarea" :rows="3" placeholder="请输入变更理由"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <div id="editor"></div>
                    </Col>
                </Row>
            </Form>
        </div>
        <Modal width="360" v-model="uploadAtt" title="附件上传" :mask-closable="false">
            <Progress :percent="upLoadPercent"></Progress>
            <div slot="footer">
                {{attUploadInfo}}
            </div>
        </Modal>
    </div>
</template>

<script>
    import E from 'wangeditor'
    import {mapGetters, mapActions} from 'vuex'
    import util from '@/tools/util'
    export default {
        data(){
            return {
                title: '上传工作计划',
                buttonName: '发布',
                workPlanInfo: {
                    title: '',
                    isBold: 0,
                    workplanstatus: 1,
                    isworkplan: '1',
                    channeltype: '',
                    execTime: '',
                    changeReason: ''
                },
                workPlanChannel: [],
                workPlanValidateRules: {
                    channeltype: [
                        { required: true, type: 'number', message: '计划类目为空', trigger: 'change' }
                    ],
                    title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ],
                    execTime: [
                        { required: true, type: 'string', message: '执行时间不能为空', trigger: 'change' }
                    ],
                    changeReason: [
                        {required: true, message: '变更理由不能为空', trigger: 'change'}
                    ]
                },
                attuploadurl: '/party/file/upload',
                headers:{},

                uploadAtt: false,
                uploadHasError: false,
                attUploadInfo: '',
                upLoadPercent: 0,
                defaultFilesList: [],
                successFileList: [],
                fileUploadList: [],

                editor: {},
                execTimeOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                isEdit: false,
                isChange: false,
            };
        },
        computed: {
            ...mapGetters([
                'getLoginUserInfo'
            ])
        },
        mounted(){
            if(this.$route.params.id){
                this.reloadData(this.$route.params.id);
            }
            if(this.$route.params.action === 'change') {
                this.isChange = true;
                this.title = '变更计划';
                this.buttonName = '变更';
            }
            this.headers = {
                userid: this.getLoginUserInfo.account
            }
            this.editor = new E('#editor');
            this.editor.customConfig.menus = [
                'head',
                'bold',
                'fontSize',
                'fontName',
                'italic',
                'underline',
                'foreColor',
                'backColor',
                'list',
                'justify',
                'undo',
                'redo'
            ];
            this.editor.customConfig.zIndex = 100;
            this.editor.create();

            this.getWorkPlanChannel().then(res => {
                if(res.success){
                    this.workPlanChannel = res.data;
                    if(!this.isEdit){
                        this.workPlanInfo.channeltype = this.workPlanChannel[0].channelCode;
                    }
                }
            });
        },
        methods: {
            handleUpload(file){
                let filename = file.name.toLowerCase();
                let fileType = filename.split(".").pop();
                let list = this.defaultFilesList.map((item) => {
                    return item.name;
                });
                if(list.indexOf(file.name) != -1){
                    this.$Modal.error({
                        title: "错误",
                        content: "["+file.name+"]已上传，请重新选择再上传！"
                    });
                }else{
                    let keyID = Math.random().toString().substr(2);
                    file['keyID'] = keyID;
                    // if(!this.isEdit) {
                        this.defaultFilesList.push(file);
                    // }
                    this.fileUploadList.push(file);
                }
                return false;
            },
            handleSuccess(response, file, fileList){
                if(response.success){
                    let dataResult = response.data.ids;
                    if(dataResult.length){
                        let files = dataResult.map(item => {
                            return {
                                id: item
                            };
                        });
                        this.successFileList = this.successFileList.concat(files);
                        console.log(this.successFileList);
                    }
                }else{
                    this.uploadHasError = true;
                }
            },
            handleError(error, file, fileList){
                this.$Modal.error({
                    title: "错误",
                    content: error
                });
            },
            uploadFile(){
                if (this.fileUploadList.length === 0) {
                    this.$Message.error('未选择上传文件')
                    return false;
                }
                for(var i=0;i<this.fileUploadList.length;i++){
                    let item =this.fileUploadList[i];
                    this.$refs.upload.post(item);
                }
            },
            getAttUploadResult(){
                this.uploadAtt = true;
                this.upLoadPercent = Math.round(this.successFileList.length / this.fileUploadList.length * 100);
                if(this.upLoadPercent >= 100){
                    this.attUploadInfo = "附件上传完成，正在提交表单！";
                    setTimeout(() => {
                        this.uploadAtt = false;
                        this.submitData();
                    }, 1000);
                }else{
                    this.attUploadInfo = "附件总数：" + this.fileUploadList.length + "  正在上传第 " + (this.successFileList.length + 1) + " 个";
                    if(!this.uploadHasError){
                        setTimeout(() => {
                            this.getAttUploadResult();
                        }, 2000);
                    }else{
                        this.uploadAtt = false;
                        this.$Modal.error({
                            title: "错误",
                            content: '上传过程中发生错误，请稍后再试！'
                        });
                    }
                }
            },
            changeStartDate(date){
                let ret = date;
                if(ret){
                    let dateObj = new Date(ret);
                    if(dateObj.getMinutes() > 0){
                        dateObj.setMinutes(0);
                        ret = util.translateDateTimeToStr(dateObj, 'yyyy-MM-dd');
                    }
                }
                console.log(ret);
                this.workPlanInfo.execTime = ret;
            },
            submitData(){
                console.log(this.workPlanInfo.execTime);
                // this.workPlanInfo.execTime = util.translateDateTimeToStr(this.workPlanInfo.execTime, 'yyyy-MM-dd HH');
                console.log(this.workPlanInfo);
                console.log(this.successFileList);
                let params = {
                    aList: this.successFileList,
                    text: this.editor.txt.html(),
                    ...this.workPlanInfo
                };

                if(this.isEdit) {
                    params.aList = this.successFileList
                }

                if(!this.isChange) {
                    delete params.changeReason
                }

                console.log(params);

                this.submitWorkPlan(params).then(res => {
                    if(res.success){
                        this.$Modal.success({
                            title: '提示信息',
                            content: res.message
                        });
                        this.workPlanInfo = {
                            title: '',
                            isBold: 0,
                            workplanstatus: 1,
                            isworkplan: '1',
                            execTime: '',
                            channeltype: this.workPlanChannel[0].channelCode,
                            changeReason: ''
                        }
                        this.defaultFilesList = [];
                        this.successFileList = [];
                        this.fileUploadList = [];
                        this.editor.txt.html('');
                        this.$refs.workPlanForm.resetFields();
                        this.isEdit = false;
                    }
                });
            },
            publishFormData(){
                this.$refs.workPlanForm.validate((valid) => {
                    if(valid){
                        let text = this.editor.txt.text();
                        if(util.removeTagFromStr(text).trim() == ""){
                            this.$Modal.warning({
                                title: '提示信息',
                                content: '请输入正文内容！'
                            });
                            return;
                        }
                        if(this.fileUploadList.length){
                            this.uploadFile();
                            this.getAttUploadResult();
                        }else{
                            this.submitData();
                        }
                    }
                });
            },
            reloadData(id){
                this.isEdit = true;
                this.getDataInfoDetail({id}).then(res => {
                    if(res.success){
                        this.workPlanInfo = Object.assign(this.workPlanInfo, res.data);
                        console.log(this.workPlanInfo);
                        this.defaultFilesList = this.workPlanInfo.aList;
                        delete this.workPlanInfo.createtime;
                        delete this.workPlanInfo.releasetime;
                        delete this.workPlanInfo.timeDistance;
                        delete this.workPlanInfo.updatetime;

                        this.editor.txt.html(res.data.text);
                    }
                })
            },
            deleteFile(file){
                if(file.url){
                    let params = {
                        id: [file.id],
                        eid: file.essayid
                    };
                    this.attachDelete(params).then(res => {
                        if(res.success){
                            for(let i = 0; i < this.defaultFilesList.length; i++){
                                const item = this.defaultFilesList[i];
                                if(item.id == file.id){
                                    this.defaultFilesList.splice(i, 1);
                                }
                            }
                            this.$Modal.success({
                                title: '提示信息',
                                content: res.message
                            })
                        }else{
                            this.$Modal.info({
                                title: '提示信息',
                                content: res.message
                            })
                        }
                    })
                }else{
                    let {keyID} = file;
                    for(let i = 0; i < this.defaultFilesList.length; i++){
                        const item = this.defaultFilesList[i];
                        if(item.keyID == keyID){
                            this.defaultFilesList.splice(i, 1);
                        }
                    }
                    for(let i = 0; i < this.fileUploadList.length; i++){
                        const item = this.fileUploadList[i];
                        if(item.keyID == keyID){
                            this.fileUploadList.splice(i, 1);
                        }
                    }
                }
            },
            ...mapActions([
                'submitWorkPlan',
                'getDataInfoDetail',
                'attachDelete',
                'getWorkPlanChannel'
            ])
        },
    }
</script>

<style lang="less" scoped>
    .ivu-date-picker {
        & /deep/ .ivu-time-picker-cells-list {
            display: none;
            width: 0 !important;
        }
        & /deep/ .ivu-time-picker-cells-list:first-child {
            display: block;
            width: 216px !important;
        }
        // & /deep/ .ivu-time-picker-cells-list {
        //     display: none;
        // }
    }
    .workplan-upload-wrapper {
        width: 1100px;
        margin: 0 auto 40px auto;
        .header-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 80px;
            padding-right: 20px;
            margin-bottom: 10px;
            background-color: #fff;
            > .title {
                position: relative;
                padding-left: 25px;
                font-size: 26px;
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
            .publish-opts {
                .opt-item {
                    border: 1px solid #d11528;
                    color: #fff;
                    >.icon {
                        background-color: #d11528;
                        &.publish-icon {
                            width: 21px;
                            height: 19px;
                            background: url('~@/images/gz_icon_fb.png') no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                }
            }
        }
        .form-content {
            padding: 7px 13px 15px 13px;
            background-color: #fff;
            .inputer-wrap {
                width: 50%;
                margin-right: 20px;
            }
            .attach-result-content {
                    display: flex;
                    flex-flow: wrap;
                    margin-bottom: -20px;
                    padding-top: 20px;
                .attach-item {
                    position: relative;
                    padding: 7px 30px 7px 10px;
                    margin-right: 20px;
                    margin-bottom: 20px;
                    background-color: #ededed;
                    border-radius: 6px;
                    font-size: 14px;
                    color: #333333;
                    text-align: center;
                    .att-title {
                        display: inline-block;
                        vertical-align: top;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        max-width: 260px;
                        overflow: hidden;
                    }
                    .att-del {
                        position: absolute;
                        right: 5px;
                        top: 50%;
                        margin-top: -18px;
                        cursor: pointer;
                        font-size: 18px;
                    }
                }
            }
        }
        .bgc-red {
            color: #ffffff;
            background-color: #d11528;
        }
        .is-blod, .tips {
            color: #d11528;
        }
        .tips {
            display: inline-block;
            margin-left: 30px;
            >span {
                display: inline-block;
                vertical-align: top;
                p {
                    line-height: 18px;
                }
            }
        }
    }
</style>
<style lang="less">
    .workplan-upload-wrapper {
        .form-content {
            .flex-block {
                .ivu-form-item-content {
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
</style>
