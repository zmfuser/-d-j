<template>
  <div class="worl-plan-list-warp">
    <listHeader :listTitle="listTitle" :subTitle="subTitle" openMarginBotton>
      <div class="slot-opts-wrap workplan-opts" slot="headOpts">
        <div
          class="opt-item"
          @click="lookDept"
          v-show="!isViewDeptData && !hidden"
          v-if="!isZBManager"
        >
          <div class="icon workplan-icon"></div>

          <div class="title">部门工作计划</div>
        </div>
        <div
          class="opt-item"
          @click="createWorkPlan"
          v-show="!isNormalEmp && (isViewDeptData || isZBManager)"
        >
          <div class="icon workplan-icon"></div>
          <div class="title">新增工作计划</div>
        </div>
        <div class="opt-item no-border">
          <!-- v-if="isViewDeptData" 隐藏部门筛选的按钮 -->
          <!-- <div>1111</div> -->
          <filterControler
            channelAction="getWorkPlanChannel"
            :channelParams="actionParams"
            isMyDeptView
          ></filterControler>
        </div>
      </div>
    </listHeader>
    <tabsBar
      :tabsData="tabsData"
      @tabChange="tabChange"
      noMarginBottom
      defaultBgColor="#ebebeb"
      tabsType="workplan"
      v-if="showTabsBar"
    ></tabsBar>

    <div class="status-tab-bar" v-if="!showTabsBar">
      <div
        class="tab-bar"
        v-for="(item, index) in allTabbars"
        :key="index"
        @click="handleCurTabbar(item, index)"
        :class="{'cur-tab-bar': index === curTabbar}"
      >
        <img :src="item.setUrl" alt v-show="index === curTabbar" />
        <img :src="item.norUrl" alt v-show="index !== curTabbar" />
        <span>{{item.name}}</span>
      </div>
    </div>
    <!-- <div class="flex-right-wrap" v-if="!isViewDeptData && actionParams.status == 3"> -->
    <div class="flex-right-wrap" v-if="false">
      <!-- <div>22222</div> -->
      <div>
        <filterControler channelAction="getWorkPlanChannel" :channelParams="actionParams"></filterControler>
      </div>
    </div>
    <dataList
      :itemDelSwitch="showCheckBox"
      :actionUrl="actionUrl"
      :actionParams="actionParams"
      :countMapper="currentTab"
      openFilter
    >
      <template v-slot:itemOpts="{dataItem}" v-if="isViewDeptData || isZBManager">
        <div class="slot-opts-wrap edit-item-opt">
          <div
            class="opt-item change"
            @click="gotoEditForChange(dataItem)"
            v-show="!isNormalEmp && dataItem.showEditButton === 1 && curTabbar === 0 && splitGetuserinfo()"
          >
            <div class="title">
              <img src="./../../images/gl_icon_bj.png" alt />
              变更
            </div>
          </div>
          <div
            class="opt-item change"
            @click="gotoReport(dataItem)"
            v-show="!isNormalEmp && dataItem.workplanstatus == '2' && splitGetuserinfo()"
          >
            <div class="title">
              <img src="./../../images/gl_icon_bj.png" alt />
              汇报
            </div>
          </div>
          <div
            class="opt-item change"
            @click="handleRepublish(dataItem)"
            v-show="!isNormalEmp && dataItem.workplanstatus == '4' && splitGetuserinfo()"
          >
            <div class="title">
              <!-- <img src="./../../images/gl_icon_bj.png" alt=""> -->
              重新发布
            </div>
          </div>
          <!-- <div class="opt-item edit" @click="gotoEdit(dataItem)">
                        <div class="title">编辑</div>
          </div>-->
          <div class="opt-item delete" @click="delData(dataItem)" v-show="!isNormalEmp">
            <div class="title">
              <img src="./../../images/my_icon_delete_set.png" alt />
              删除
            </div>
          </div>
        </div>
      </template>
    </dataList>

    <Modal v-model="reportShow" title="汇报" @on-cancel="handleCancelReport" :mask-closable="false">
      <Form
        :model="reportForm"
        :label-width="130"
        label-position="left"
        ref="informationForm"
        :rules="imformationValidateRules"
      >
        <!-- <FormItem label="状态变更">
                    <Radio v-model="reportForm.workPlanStatus">未执行</Radio>
        </FormItem>-->
        <FormItem label="计划执行情况" prop="title">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="800"
            v-model="reportForm.planDetail"
            show-word-limit
          ></el-input>
        </FormItem>
        <FormItem label="上传图片">
          <el-upload
            action="/party/file/upload"
            :headers="{'userid': getLoginUserInfo.account}"
            :on-success="handleImgSuccess"
            :on-remove="handleImgDelete"
            :file-list="imgList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </FormItem>
        <FormItem label="上传附件">
          <el-upload
            action="/party/file/upload"
            :headers="{'userid': getLoginUserInfo.account}"
            :on-success="handleFileSuccess"
            :on-remove="handleFileDelete"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </FormItem>
      </Form>

      <div class="org-sort-footer" slot="footer">
        <div class="btn bgc-red" @click="handleConfirmReport">
          <span>确认</span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import listHeader from "@/components/common/listHeader";
import tabsBar from "@/components/common/tabsBar";
import filterControler from "@/components/common/filterControler";
import dataList from "@/components/common/dataList";
import { mapGetters, mapActions } from "vuex";
import { stat } from "fs";
export default {
  data() {
    return {
      reportForm: {
        planDetail: "",
        imgList: [],
        fileList: []
      },
      imgList: [],
      fileList: [],
      reportShow: false,
      listTitle: "工作计划",
      subTitle: " / 下级工作计划",
      // moduleTitle:'待执行',
      showCheckBox: false,
      showTabsBar: true,

      hidden: false,

      tabsData: [
        {
          title: "待执行",
          status: 1,
          countMap: "nonexecution",
          count: 0
        },
        {
          title: "执行中",
          status: 2,
          countMap: "executing",
          count: 0
        },
        {
          title: "已执行",
          status: 3,
          countMap: "executed",
          count: 0
        },
        {
          title: "未执行",
          status: 4,
          countMap: "noexecuted",
          count: 0
        }
      ],
      isViewDeptData: false,

      actionUrl: "getWorkPlanList",
      actionParams: { status: 1, workPlanStatus: 1 },
      currentTab: "",
      allTabbars: [
        {
          name: "待执行",
          setUrl: require("./../../images/gz_icon_bm_dai_set.png"),
          norUrl: require("./../../images/gz_icon_bm_dai_nor.png")
        },
        {
          name: "执行中",
          setUrl: require("./../../images/gz_icon_bm_ing_set.png"),
          norUrl: require("./../../images/gz_icon_bm_ing_nor.png")
        },
        {
          name: "已执行",
          setUrl: require("./../../images/gz_icon_bm_end_set.png"),
          norUrl: require("./../../images/gz_icon_bm_end_nor.png")
        },
        {
          name: "未执行",
          setUrl: require("./../../images/gz_icon_bm_no_set.png"),
          norUrl: require("./../../images/gz_icon_bm_no_nor.png")
        }
      ],
      curTabbar: 0,
      reportData: {},
      imformationValidateRules: {
        title: [{ required: true, message: "计划执行情况不能为空" }]
      }
    };
  },
  computed: {
    isNormalEmp() {
      let { roleType } = this.getLoginUserInfo;
      console.log(roleType);
      if (roleType == "0") {
        return true;
      } else {
        return false;
      }
    },
    isJTManager() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType == "1") {
        return true;
      } else {
        return false;
      }
    },
    isDWManager() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType == "2") {
        return true;
      } else {
        return false;
      }
    },
    isZBManager() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType == "3") {
        return true;
      } else {
        return false;
      }
    },
    ...mapGetters(["getLoginUserInfo"])
  },
  components: {
    listHeader,
    tabsBar,
    filterControler,
    dataList
  },
  created() {
    console.log("this.getLoginUserInfo", this.getLoginUserInfo);
    console.log(this.$route.params);
    if (this.$route.params.type) {
      let { type, orgId } = this.$route.params;

      if (type == "myworkplan") {
        this.showTabsBar = false;
        this.isViewDeptData = true;
        this.subTitle = "";
        this.listTitle = "部门工作计划";
        this.actionUrl = "getMyWorkPlanList";
      } else if (type == "deptWorkPlan") {
        console.log("test");
        this.showTabsBar = true;
        this.subTitle = " / 下级工作计划";
        this.listTitle = "工作计划";
        this.actionUrl = "getWorkPlanListByOrgid";
        this.hidden = true;
        this.actionParams = { orgId, status: 1 };
      }
    }
    if (this.isZBManager) {
      this.showTabsBar = false;
      this.subTitle = "";
      this.listTitle = "部门工作计划";
      this.actionUrl = "getMyWorkPlanList";
    }
    if (this.$route.query.curTab) {
      let status = 1;
      // this.tabsData.forEach(item => {

      //     if(item.title === this.$route.query.curTab) {
      //         console.log(item.title);
      //         status = item.status;
      //         console.log(status);
      //     }
      // })
      console.log(this.$route.query.curTab);
      switch (this.$route.query.curTab) {
        case "nonexecution":
          status = 1;
          break;
        case "executing":
          status = 2;
          break;
        case "executed":
          status = 3;
          break;
        case "noexecuted":
          status = 4;
          break;
        default:
          status = 1;
          break;
      }
      this.actionParams.status = status;
      console.log(status);
    }
    this.currentTab = this.$route.query.curTab || this.tabsData[0].countMap;
    if (this.isNormalEmp && this.getLoginUserInfo.orgDept.orgcode == 3) {
      this.lookDept();
    }
  },
  methods: {
    splitGetuserinfo() {
      let { powerCodes } = this.getLoginUserInfo;
      this.powerCodesList = powerCodes.split(",");
      var result = this.powerCodesList.includes("info");
      return result;
      console.log(
        "this.powerCodesList.includes",
        this.powerCodesList.includes("info1")
      );
    },
    handleCurTabbar(item, index) {
      this.curTabbar = index;
      this.actionParams.workPlanStatus = index + 1;
    },
    tabChange(params) {
      this.currentTab = params.tab.countMap;
      if (this.actionUrl == "getWorkPlanListByOrgid") {
        this.actionParams.status = params.tab.status;
      } else {
        this.actionParams = { status: params.tab.status, workPlanStatus: 1 };
      }
    },
    deleteRow() {
      this.showCheckBox = !this.showCheckBox;
    },
    lookDept() {
      this.showTabsBar = false;
      this.isViewDeptData = true;
      this.subTitle = "";
      this.listTitle = "部门工作计划";
      this.actionUrl = "getMyWorkPlanList";
    },
    createWorkPlan() {
      this.changeNaviPath("manageCenter");
      this.changeSubNaviPath("workPlanUpload");
      this.$router.push("workPlanUpload");
    },
    gotoEdit(data) {
      this.changeSubNaviPath("workPlanUpload");
      this.$router.push({ name: "workPlanUpload", params: { id: data.id } });
    },
    handleRepublish(data) {
      this.setNoExecutedToNonExecution({
        essayId: data.id
      }).then(res => {
        if (res.success) {
          $eventBus.$emit("refreshDataList");
        }
      });
    },
    gotoEditForChange(data) {
      if (data.editNum >= 2) {
        this.$Modal.info({
          title: "提示",
          content: "已变更2次，无法继续操作",
          okText: "知道了"
        });
        return false;
      }
      this.changeSubNaviPath("workPlanUpload");
      this.$router.push({
        name: "workPlanUpload",
        params: { id: data.id, action: "change" }
      });
    },
    // 汇报工作
    gotoReport(data) {
      this.reportData = data;
      this.reportShow = true;
    },
    handleImgSuccess(file, fileList) {
      console.log(file);
      this.reportForm.imgList.push(file.data.ids[0]);
    },
    handleImgDelete(file) {
      console.log(file);
      this.reportForm.imgList.splice(
        this.reportForm.imgList.indexOf(file.response.data.ids[0]),
        1
      );
      console.log(this.reportForm.imgList);
    },
    handleFileSuccess(file, fileList) {
      this.reportForm.fileList.push(file.data.ids[0]);
    },
    handleFileDelete(file) {
      console.log(file);
      this.reportForm.fileList.splice(
        this.reportForm.fileList.indexOf(file.response.data.ids[0]),
        1
      );
      console.log(this.reportForm.fileList);
    },
    handleCancelReport() {
      this.reportForm = {
        planDetail: "",
        imgList: [],
        fileList: []
      };
      this.imgList = [];
      this.fileList = [];
      (this.reportForm.imgList = []),
        (this.reportForm.fileList = []),
        (this.reportShow = false);
    },
    handleConfirmReport() {
      this.$refs.informationForm.validate(valid => {
        if (valid) {
          console.log(this.reportData);
          let params = {
            essayId: this.reportData.id,
            aList: [...this.reportForm.imgList, ...this.reportForm.fileList],
            reportText: this.reportForm.planDetail
          };

          console.log(params);

          console.log(this.reportForm);

          this.setReportAttachment(params).then(res => {
            if (res.success) {
              $eventBus.$emit("refreshDataList");
              this.handleCancelReport();
            }
          });
        }
      });
    },
    delData(data) {
      let _this = this;
      this.$Modal.confirm({
        title: "提示信息",
        content: "是否删除该条记录？",
        onOk() {
          _this.delWorkPlan({ id: data.id }).then(res => {
            if (res.success) {
              $eventBus.$emit("refreshDataList");
            }
          });
        }
      });
    },
    ...mapActions([
      "delWorkPlan",
      "changeNaviPath",
      "changeSubNaviPath",
      "setReportAttachment",
      "setNoExecutedToNonExecution"
    ])
  }
};
</script>

<style lang="less" scoped>
.worl-plan-list-warp {
  width: 1100px;
  margin: 0 auto;
  .workplan-opts {
    .opt-item {
      border: 1px solid #d11528;
      color: #d11528;
      &.no-border {
        border: 0;
      }
      > .icon {
        background-color: #d11528;
        &.workplan-icon {
          background: url("~@/images/gl_icon_bm.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
  .edit-item-opt {
    .opt-item {
      justify-content: center;
      &.change {
        border: 1px solid #db811a;
        color: #db811a;
      }
      &.delete {
        border: 1px solid #d11528;
        color: #d11528;
      }
      > .icon.change-icon {
        background: url("~@/images/gl_icon_bj.png") no-repeat;
        background-size: 100% 100%;
      }
      .title {
        display: flex;
        align-items: center;
        img {
          margin-right: 8px;
        }
      }
    }
  }
  .flex-right-wrap {
    display: flex;
    justify-content: flex-end;
    padding: 20px 20px 0;
    background-color: #fff;
  }
}
.status-tab-bar {
  width: 100%;
  height: 88px;
  padding: 20px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .tab-bar {
    color: #333333;
    width: 120px;
    height: 48px;
    border-radius: 24px;
    box-shadow: 0 0 8px #eeeeee;
    margin-right: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      margin-left: 8px;
      font-size: 20px;
    }
  }
  .tab-bar:hover {
    cursor: pointer;
  }
  .cur-tab-bar {
    color: #fff;
    background-color: #d11528;
    box-shadow: 0 0 8px rgba(255, 0, 0, 0.1);
  }
}
.org-sort-footer {
  display: flex;
  justify-content: flex-end;
  .btn {
    width: 86px;
    padding: 5px;
    margin-left: 18px;
    border-radius: 6px;
    border: solid 1px #d11528;
    font-size: 16px;
    color: #d11528;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    &.bgc-red {
      background-color: #d11528;
      color: #fff;
    }
  }
}
</style>