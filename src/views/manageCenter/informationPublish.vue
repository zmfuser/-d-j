<template>
  <div class="information-publish-wrapper">
    <div class="header-wrap">
      <div class="title-wrap">
        <h1 class="module">{{ checkedModuleName }}</h1>
        <span class="title">信息发布</span>
      </div>
      <div class="slot-opts-wrap publish-opts">
        <div class="opt-item bgc-red" @click="publishFormData">
          <div class="icon publish-icon"></div>
          <div class="title">发布</div>
        </div>
      </div>
    </div>
    <div class="form-content">
      <Form
        ref="informationForm"
        :model="informationDataInfo"
        :rules="imformationValidateRules"
        :label-width="80"
        label-position="left"
      >
        <Row>
          <Col span="24">
            <FormItem label="资料类型">
              <div class="form-item-sm-wrap">
                <RadioGroup
                  v-model="informationDataInfo.upperChannelType"
                  @on-change="changeModuleType"
                >
                  <Radio
                    :label="item.channelCode"
                    v-for="(item, i) of moduleList"
                    :key="i"
                  >{{ item.channelName }}</Radio>
                </RadioGroup>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="标题" class="flex-block" prop="title">
              <div class="inputer-wrap">
                <Input v-model.trim="informationDataInfo.title"></Input>
              </div>
              <div class="ext">
                <Checkbox
                  v-model="informationDataInfo.isBold"
                  :true-value="1"
                  :false-value="0"
                  class="is-blod"
                >加粗标红</Checkbox>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="附件上传">
              <Upload
                ref="upload"
                :action="attuploadurl"
                multiple
                name="file"
                :show-upload-list="false"
                :with-credentials="true"
                :headers="headers"
                :before-upload="handleUpload"
                :on-success="handleSuccess"
                :on-error="handleError"
              >
                <Button class="bgc-red">添加附件</Button>
                <!-- <div slot="tip" class="upload-tips">注：上传照片必须为jpg、png格式，尺寸为1100×360，大小2M内</div> -->
              </Upload>
              <div class="attach-result-content">
                <div class="attach-item" v-for="(att, i) of defaultFilesList" :key="i">
                  <span
                    class="att-title"
                    :title="att.name || att.fileName"
                  >{{ att.name || att.fileName }}</span>
                  <div class="att-del" @click="deleteFile(att)">
                    <Icon type="md-close" />
                  </div>
                </div>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="选择所属组织" prop="ownedOrgId">
              <i-select v-model="informationDataInfo.ownedOrgId" style="width:200px" @on-change="change">
                <i-option
                  v-for="(item,index) in managerList"
                  :value="item.value"
                  :key="index"
                >{{ item.label }}</i-option>
              </i-select>
              <!-- <div v-for="(item,index) in managerList" :key="index">{{item+}}1</div> -->
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="计划类目">
              <RadioGroup v-model="informationDataInfo.channeltype">
                <Radio
                  :label="item.channelCode"
                  v-for="(item, i) of childPlanType"
                  :key="i"
                >{{ item.channelName }}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <div class="dassed-border-wrap">
              <div class="dassed-item">
                <div class="label">首页幻灯</div>
                <RadioGroup v-model="informationDataInfo.isslide">
                  <Radio :label="0">否</Radio>
                  <Radio :label="1">是</Radio>
                </RadioGroup>
                <!-- <div class="tips">注：该选项默认否，上传照片必须为jpg、png格式，尺寸为1100×360，大小2M内</div> -->
              </div>
              <div class="dassed-item">
                <div class="label">首页头条</div>
                <RadioGroup v-model="informationDataInfo.istop">
                  <Radio :label="0">否</Radio>
                  <Radio :label="1">是</Radio>
                </RadioGroup>
              </div>
            </div>
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
      <div slot="footer">{{attUploadInfo}}</div>
    </Modal>
  </div>
</template>

<script>
import E from "wangeditor";
import { mapGetters, mapActions } from "vuex";
import util from "@/tools/util";
export default {
  data() {
    return {
      documentType: "",
      managerList: [],
      informationDataInfo: {
        ownedOrgId: "",
        title: "",
        isBold: 0,
        channeltype: "",
        isslide: 0,
        istop: 0,
        isworkplan: "0",
        upperChannelType: ""
      },
      channeltype: null,
      upperChannelType: null,
      imformationValidateRules: {
        title: [{ required: true, message: "标题不能为空" }],
        ownedOrgId: [
          { required: true, message: "所属组织不能为空" }
        ]
      },
      attuploadurl: "/party/file/upload",
      headers: {},

      uploadAtt: false,
      uploadHasError: false,
      attUploadInfo: "",
      upLoadPercent: 0,
      defaultFilesList: [],
      successFileList: [],
      fileUploadList: [],
      tempFileUploadList: [],
      imgFileCount: 0,
      imgFileType: ["jpg", "jpeg", "png"],

      editor: {},

      checkedModuleName: "组织生活",
      moduleList: [],
      childPlanType: [],
      isEdit: false
    };
  },
  computed: {
    ...mapGetters(["getLoginUserInfo"])
  },
  created() {
    this.getPowerlist();
  },
  mounted() {
    this.getSecondChannelData().then(res => {
      if (res.success) {
        this.moduleList = res.data;
        // this.documentType = res.data[0].channelCode;
        this.upperChannelType = res.data[0].channelCode;

        if (this.$route.params.id) {
          this.reloadData(this.$route.params.id);
        } else {
          this.changeModuleType(res.data[0].channelCode, false);
          this.informationDataInfo.upperChannelType = res.data[0].channelCode;
        }
      }
    });

    this.headers = {
      userid: this.getLoginUserInfo.account
    };
    this.editor = new E("#editor");
    this.editor.customConfig.menus = [
      "head",
      "bold",
      "fontSize",
      "fontName",
      "italic",
      "underline",
      "foreColor",
      "backColor",
      "list",
      "justify",
      "undo",
      "redo"
    ];
    this.editor.customConfig.zIndex = 100;
    this.editor.create();
  },
  methods: {
    change(valid) {
      // this.informationDataInfo.ownedOrgId = valid;

      console.log(valid);
      console.log(this.informationDataInfo.ownedOrgId);
    },
    // 获取用户权限
    getPowerlist() {
      let _this=this
      this.getPowerList().then(res => {
        if (res.success) {
          // this.managerList=res.data
          res.data.forEach(function(item) {
            _this.managerList.push({
              value: item.id,
              label: item.orgName
            });
          });
          console.log(_this.managerList)
        }
      });
    },
    changeModuleType(evt, flag) {
      console.log(evt);
      console.log(this.moduleList);
      let moduleItem = this.moduleList.filter(item => item.channelCode == evt);
      if (moduleItem.length) {
        let module = moduleItem[0];
        this.checkedModuleName = module.channelName;
        this.getThirdChannelData({ upperCode: module.channelCode }).then(
          res => {
            if (res.success) {
              this.childPlanType = res.data;

              if (!flag) {
                this.informationDataInfo.channeltype = res.data[0].channelCode;
                this.channeltype = res.data[0].channelCode;
              }
            }
          }
        );
      }
    },
    getModuleNameByType(type) {
      let ret = "";
      for (const item of this.moduleList) {
        if (item.moduleName == type) {
          ret = item.name;
          break;
        }
      }
      return ret;
    },
    handleUpload(file) {
      let filename = file.name.toLowerCase();
      let fileType = filename.split(".").pop();
      let list = this.defaultFilesList.map(item => {
        return item.name;
      });
      if (list.indexOf(file.name) != -1) {
        this.$Modal.error({
          title: "错误",
          content: "[" + file.name + "]已上传，请重新选择再上传！"
        });
      } else {
        if (this.imgFileType.indexOf(fileType) != -1) {
          this.imgFileCount += 1;
        }
        let keyID = Math.random()
          .toString()
          .substr(2);
        file["keyID"] = keyID;
        this.defaultFilesList.push(file);
        this.fileUploadList.push(file);
      }
      return false;
    },
    handleSuccess(response, file, fileList) {
      if (response.success) {
        let dataResult = response.data.ids;
        if (dataResult.length) {
          let files = dataResult.map(item => {
            return {
              id: item
            };
          });
          this.successFileList = this.successFileList.concat(files);
        }
      } else {
        this.uploadHasError = true;
      }
    },
    handleError(error, file, fileList) {
      this.$Modal.error({
        title: "错误",
        content: error
      });
    },
    uploadFile() {
      if (this.fileUploadList.length === 0) {
        this.$Message.error("未选择上传文件");
        return false;
      }
      for (var i = 0; i < this.fileUploadList.length; i++) {
        let item = this.fileUploadList[i];
        this.$refs.upload.post(item);
      }
    },
    getAttUploadResult() {
      this.uploadAtt = true;
      this.upLoadPercent = Math.round(
        (this.successFileList.length / this.fileUploadList.length) * 100
      );
      if (this.upLoadPercent >= 100) {
        this.attUploadInfo = "附件上传完成，正在提交表单！";
        setTimeout(() => {
          this.uploadAtt = false;
          this.submitData();
        }, 1000);
      } else {
        this.attUploadInfo =
          "附件总数：" +
          this.fileUploadList.length +
          "  正在上传第 " +
          (this.successFileList.length + 1) +
          " 个";
        if (!this.uploadHasError) {
          setTimeout(() => {
            this.getAttUploadResult();
          }, 2000);
        } else {
          this.uploadAtt = false;
          this.$Modal.error({
            title: "错误",
            content: "上传过程中发生错误，请稍后再试！"
          });
        }
      }
    },
    submitData() {
      console.log(this.informationDataInfo);
      let params = {
        ...this.informationDataInfo,
        aList: this.successFileList,
        text: this.editor.txt.html()
      };
      console.log(params);
      // return false;
      this.submitWorkPlan(params).then(res => {
        if (res.success) {
          //   this.$Modal.success({
          //     title: "提示信息",
          //     content: res.message
          //   });
          this.$confirm(`${res.message},即将跳转到首页, 是否继续?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$router.push({ path: "/home" });
              this.changeNaviPath("home")
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });

          this.informationDataInfo = {
            title: "",
            isBold: 0,
            channeltype: this.channeltype,
            isslide: 0,
            istop: 0,
            isworkplan: "0",
            upperChannelType: this.upperChannelType
          };
          this.defaultFilesList = [];
          this.successFileList = [];
          this.fileUploadList = [];
          this.imgFileCount = 0;
          this.editor.txt.html("");
          this.$refs.informationForm.resetFields();
          if (this.isEdit) {
            this.isEdit = false;
          }

          this.changeModuleType(this.upperChannelType, false);
        }
      });
    },
    publishFormData() {
      this.$refs.informationForm.validate(valid => {
        if (valid) {
          let text = this.editor.txt.text();
          if (util.removeTagFromStr(text).trim() == "") {
            this.$Modal.warning({
              title: "提示信息",
              content: "请输入正文内容！"
            });
            return;
          }

          console.log(this.fileUploadList);
          console.log(this.imgFileCount);
          if (this.informationDataInfo.isslide == "1") {
            // if((!this.fileUploadList.length || !this.imgFileCount) && !this.isEdit){
            //     this.$Modal.error({
            //         title: '提示信息',
            //         content: '您未上传任何图片附件，请检查！'
            //     });
            //     return;
            // } else if(this.isEdit && (this.fileUploadList.length ) {

            // }
            if (!this.imgFileCount) {
              this.$Modal.error({
                title: "提示信息",
                content: "您未上传任何图片附件，请检查！"
              });
              return;
            }
          }

          if (this.fileUploadList.length) {
            this.uploadFile();
            this.getAttUploadResult();
          } else {
            this.submitData();
          }
        }
      });
    },
    deleteFile(file) {
      if (file.url) {
        let params = {
          id: [file.id],
          eid: file.essayid
        };
        this.attachDelete(params).then(res => {
          console.log(res);
          if (res.success) {
            for (let i = 0; i < this.defaultFilesList.length; i++) {
              const item = this.defaultFilesList[i];
              if (item.id == file.id) {
                this.defaultFilesList.splice(i, 1);

                if (this.imgFileType.indexOf(item.accessorytype) != -1) {
                  this.imgFileCount--;
                }
              }
            }
            this.$Modal.success({
              title: "提示信息",
              content: res.message
            });
          } else {
            this.$Modal.info({
              title: "提示信息",
              content: res.message
            });
          }
        });
      } else {
        let { keyID } = file;
        for (let i = 0; i < this.defaultFilesList.length; i++) {
          const item = this.defaultFilesList[i];
          if (item.keyID == keyID) {
            this.defaultFilesList.splice(i, 1);
          }
        }
        for (let i = 0; i < this.fileUploadList.length; i++) {
          const item = this.fileUploadList[i];
          if (item.keyID == keyID) {
            this.fileUploadList.splice(i, 1);
          }
        }
      }
    },
    reloadData(id) {
      this.isEdit = true;
      this.getDataInfoDetail({ id }).then(res => {
        if (res.success) {

          this.informationDataInfo = Object.assign(
            this.informationDataInfo,
            res.data
          );
          delete this.informationDataInfo.createtime;
          delete this.informationDataInfo.releasetime;
          delete this.informationDataInfo.timeDistance;
          delete this.informationDataInfo.updatetime;

          this.defaultFilesList = [...this.informationDataInfo.aList];

          this.informationDataInfo.ownedOrgId=res.data.essayOrgId;
          this.defaultFilesList.forEach(file => {
            let filename = file.fileName;
            let fileType = filename.split(".").pop();
            if (this.imgFileType.indexOf(fileType) != -1) {
              this.imgFileCount += 1;
            }
            let keyID = Math.random()
              .toString()
              .substr(2);
            file["keyID"] = keyID;
            // this.defaultFilesList.push(file);
            // this.fileUploadList.push(file);
            // this.tempFileUploadList.push(file);
          });
          // console.log(res.data.text);
          this.editor.txt.html(res.data.text);
          this.changeModuleType(
            this.informationDataInfo.upperChannelType,
            true
          );
        }
      });
    },
    ...mapActions([
      "getSecondChannelData",
      "getThirdChannelData",
      "submitWorkPlan",
      "getDataInfoDetail",
      "getPowerList",
      "changeNaviPath",,
      "attachDelete"
    ])
  }
};
</script>

<style lang="less" scoped>
.information-publish-wrapper {
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
    .title-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      padding-left: 25px;
      font-size: 30px;
      line-height: 22px;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -15px;
        width: 4px;
        height: 30px;
        background-color: #d11528;
      }
      .module {
        font-size: 30px;
        line-height: 22px;
        color: #333333;
      }
      .title {
        display: inline-block;
        margin-left: 20px;
        font-size: 26px;
        line-height: 20px;
        color: #999999;
      }
    }
    .publish-opts {
      .opt-item {
        border: 1px solid #d11528;
        color: #fff;
        > .icon {
          background-color: #d11528;
          &.publish-icon {
            background: url("~@/images/gz_icon_fb.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  .form-content {
    padding: 30px 13px 15px 13px;
    background-color: #fff;
    .inputer-wrap {
      width: 50%;
      margin-right: 20px;
    }
    .attach-result-content {
      display: flex;
      flex-flow: wrap;
      // width: 45%;
      margin-bottom: -20px;
      padding-top: 20px;
      .attach-item {
        position: relative;
        // width: 294px;
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
          right: 10px;
          top: 50%;
          margin-top: -18px;
          cursor: pointer;
          font-size: 18px;
        }
      }
    }
    .dassed-border-wrap {
      margin-bottom: 40px;
      background-color: #fafafa;
      .dassed-item {
        display: flex;
        align-items: center;
        padding: 26px 21px;
        border: 1px dashed #bdbdbd;
        font-size: 14px;
        &:nth-child(odd) {
          border-bottom: 0;
        }
        .label {
          margin-right: 27px;
        }
        .tips {
          color: #d11528;
        }
      }
    }
  }
  .bgc-red {
    color: #ffffff;
    background-color: #d11528;
  }
  .is-blod {
    color: #d11528;
  }
  .form-item-sm-wrap {
    width: 45%;
  }
  .upload-tips {
    display: inline-block;
    margin-left: 20px;
    font-size: 14px;
    color: #d11528;
  }
}
</style>
<style lang="less">
.information-publish-wrapper {
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