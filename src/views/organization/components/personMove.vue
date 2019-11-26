<template>  
  <div>
    <Modal v-model="personMoveShow" title="人员移动" @on-cancel="handleCloseModal" :width="720" :mask-closable="false">
      <el-steps :active="activeStep" class="step" finish-status="success">
        <el-step title="选择转出组织"></el-step>
        <el-step title="选择转出人员"></el-step>
        <el-step title="选择转入组织"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <div class="content-wrap">
        <el-scrollbar v-show="activeStep === 0">
          <div class="org-select">
            
            <Tree :data="orgTreeData" children-key="orgList" @on-select-change="selectChange"></Tree>
           
          </div>
        </el-scrollbar>
        
        <el-scrollbar v-show="activeStep === 2">
          <div class="org-select">
            
            <Tree :data="orgTreeData1" children-key="orgList" @on-select-change="selectChange1"></Tree>
            
          </div>
        </el-scrollbar>
        

        
          <div class="select-wrap-1" v-show="activeStep === 0">
            <el-scrollbar style="width: 100%;height: 100%">
            <RadioGroup v-model="step1SelectedOrg" class="org-wrap">
              <div v-for="item in orgData2" :key="item.id" class="org-item">
                <!-- <span>{{item.orgname}}</span> -->
                <Radio :label="item.id" size="large">{{item.orgname}}</Radio>
              </div>
            </RadioGroup>
            </el-scrollbar>         
          </div>
        
        
        
          <div class="select-wrap-2" v-show="activeStep === 1">
            <el-scrollbar  v-show="orgData3.length > 0" style="width: 100%;height: 100%">
            <CheckboxGroup v-model="checkAllGroup" class="org-wrap org-wrap1">
              <div v-for="item in orgData3" :key="item.id" class="org-item">
                <Checkbox :label="item.id">{{item.name}}</Checkbox>
              </div>
            </CheckboxGroup>
            </el-scrollbar>
            <div v-show="orgData3.length === 0" class="none">
              <p>该组织下暂无人员</p>
            </div>
            
          </div>  
        
        
        
          <div class="select-wrap-3" v-show="activeStep === 2">
            <el-scrollbar style="width: 100%;height: 100%">
            <RadioGroup v-model="step3SelectedOrg" class="org-wrap">
              <div v-for="item in orgData4" :key="item.id" class="org-item">
                <!-- <span>{{item.orgname}}</span> -->
                <Radio :label="item.id" size="large">{{item.orgname}}</Radio>
              </div>
            </RadioGroup>
            </el-scrollbar>  
          </div> 
        
        
      </div>

      <div class="org-sort-footer" slot="footer">
        <div class="btn" v-show="activeStep === 1" @click="handleCheckAll">
          <span>全选</span>
        </div>
        <div class="btn bgc-red" v-show="activeStep === 1" @click="handlePreviousStep">
          <span>上一步</span>
        </div>
        <div class="btn bgc-red" v-show="activeStep === 0 || activeStep === 1" @click="handleNextStep">
          <span>下一步</span>
        </div>
        <div class="btn bgc-red" v-show="activeStep === 2" @click="handleConfirm">
          <span>确认</span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import util from '@/tools/util'
export default {
  props: ['personMoveShow'],
  watch: {
    personMoveShow: {
      handler(val) {
        if(val) {
          console.log(val);
          this.getOrgsData().then(res => {
            (res.data || []).forEach(item => {
              item.title = item.orgname;
              item.expand = true;
              if(item.orgList && item.orgList.length) {
                item.orgList.forEach((val, index) => {
                  // if(index === 0) val.selected = true;
                  // let list = util.deepClone(val.orgList)
                  val.title = val.orgname;
                  // val.orgList = [];
                  // list.shift();
                  // this.orgData2Obj[val.id] = list || [];
                  val.lowerList = [...val.orgList];
                  val.orgList = [];
                })        
              }
            })

            this.orgTreeData = util.deepClone(res.data);
            this.orgTreeData1 = util.deepClone(res.data);
          })
        }
      }
    },
    immediate: true
  },
  data() {
    return {
      activeStep: 0,
      orgTreeData: [],
      orgTreeData1: [],
      orgData2: [],
      orgData3: [], // 备选人员数组
      orgData4: [],
      allPersonIds: [],
      checkAllGroup: [], // 选中的人员数组
      step1SelectedOrg: null, // 选中的三级组织，即党委本身或支部
      step3SelectedOrg: null, // 转出组织
    }
  },
  methods: {
    handleCloseModal() {
      this.activeStep = 0,
      this.orgTreeData = [],
      this.orgTreeData1 = [],
      this.orgData2 = [],
      this.orgData3 = [], // 备选人员数组
      this.orgData4 = [],
      this.checkAllGroup = [], // 选中的人员数组
      this.step1SelectedOrg = null, // 选中的三级组织，即党委本身或支部
      this.step3SelectedOrg = null, // 转出组织
      this.$emit('closePersonMove')
    },
    selectChange(arr, item) {
      if(this.activeStep !== 0) return false;
      this.step1SelectedOrg = null;
      // console.log(arr);
      console.log(item);
      if(item.orgcode === 0) { // 如果是集团党委，构造虚拟数据
        let list = [{
          id: 0,
          orgname: '机关党委',
          empList: [...item.empList]
        }]

        this.orgData2 = [...list];
      } else {
        this.orgData2 = [...item.lowerList];
      }
    },
    selectChange1(arr, item) {
      console.log(item);
      if(this.activeStep !== 2) return false;
      if(item.orgcode === 0) { // 如果是集团党委，构造虚拟数据
        let list = [{
          id: 0,
          orgname: '机关党委',
          // empList: [...item.empList]
        }]

        this.orgData4 = [...list];
      } else {
        this.orgData4 = [...item.lowerList];
      }
    },
    handlePreviousStep() {
      this.checkAllGroup = [];
      this.allPersonIds = [];
      this.activeStep--;
    },
    handleNextStep() {
      
      console.log(this.activeStep);
      if(this.activeStep === 0) {
        let list = this.orgData2.find(item => item.id === this.step1SelectedOrg);
        console.log(list);
        this.orgData3 = [...list.empList];
        let cList = this.orgData3.map(item => item.id)
        this.allPersonIds = [...cList];
        console.log(cList);
        console.log(this.orgData3);
      } else if(this.activeStep === 1) {
        if(this.checkAllGroup.length === 0) {
          this.$Modal.warning({
            title: '提示',
            content: '请选择要转出的人员'
          })
          return false;
        }
      }

      this.activeStep++;
    },
    handleCheckAll() {
      this.checkAllGroup = [...this.allPersonIds]
    },
    handleConfirm() {
      console.log(this.checkAllGroup);
      console.log(this.step3SelectedOrg);
      this.empTransDept({
        empIds: this.checkAllGroup,
        deptId: this.step3SelectedOrg
      }).then(res => {
        if(res.success) {
          this.$Message.success('人员移动成功');
          this.$emit('refresh');
          this.handleCloseModal();
        }
      })
    },
    ...mapActions([
      'getOrgsData',
      'empTransDept'
    ])
  }
}
</script>

<style lang="less" scoped>
.step {
  color: red;
  margin: 0 60px;
  /deep/ .el-step__main {
    margin-left: -12%;
  }
  /deep/ .el-step__head.is-success {
    color: #d11528;
    border-color: #d11528;
    .el-step__line {
      background-color: #d11528;
    }
  }
  /deep/ .el-step__title.is-success, /deep/ .el-step__title.is-process {
    color: #d11528;
  }
  /deep/ .el-step__head.is-process {
  color: #d11528;
  border-color: #d11528;
  }
}
.content-wrap {
  display: flex;
  height: 300px;
  margin-top: 10px;
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .org-select {
    height: 100%;
    overflow-y: auto;
    width: 160px;
    flex: 0 0 auto;
    overflow-x: hidden;
    margin-right: 16px;
    & /deep/ ul{
      font-size: 16px;
    }

    & /deep/ .ivu-tree-title {
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
  }
  .select-wrap-1 {
    flex: 1;
  }
  .select-wrap-2 {
    flex: 1;
  }
  .select-wrap-3 {
    flex: 1;
  }
  .org-wrap {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    flex: 1;
    margin-left: 10px;
    .org-item {
      // display: inline-block;
      font-size: 16px;
      // border: 1px solid #ccc;
      // margin: 10px 10px;
      width: 125px;
      height: 40px;
      line-height: 40px;
      // text-align: center;
      // border-radius: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #fff;
      label {
        margin-top: -5px;
        margin-right: 0;
        margin-left: 2px;
        width: 100%;
        height: 100%;
        font-size: 16px;
      }
      /deep/ .ivu-radio-checked .ivu-radio-inner {
        border-color: #d11528;
      }
      /deep/ .ivu-radio-inner:after {
        background-color: #d11528;
      }
    }

    .ui-sortable-helper {
      background: #d11528;
      color: #fff;
    }
  }
  .org-wrap1 {
    margin-left: 60px;
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
.none {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    font-size: 16px;
    color: #999999;
  }
}
</style>