<template>
  <div class="manager-setting-wrap">
    <div class="search-wrapper">
      <Button class="btn" @click="handleAddManager">新增</Button>
      <el-select
        class="look-type"
        v-model="lookType"
        placeholder="请选择查看类型"
        @change="handleChangeLookType"
      >
        <el-option
          v-for="(item, index) in allLookTypes"
          :key="index"
          :value="item.id"
          :label="item.name"
        ></el-option>
      </el-select>

      <el-input
        class="input-search"
        placeholder="请输入组织名/人名/电话号码"
        clearable
        v-model="searchProp"
        @clear="handleSearch"
        @keyup.enter.native="handleSearch"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <el-table
      :max-height="tHeight"
      class="my-table"
      :border="true"
      :data="tDataList"
      :span-method="objectSpanMethod"
    >
      <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="orgname" label="组织名称" align="center"></el-table-column>

      <el-table-column prop="eName" label="管理员人名" width="250" align="center"></el-table-column>
      <el-table-column prop="account" label="电话号码" width="250" align="center" ></el-table-column>
      <el-table-column prop="powerName" label="权限" align="center" ></el-table-column>
      <!-- <el-table-column prop="account" label="权限" width="250" align="center"></el-table-column> -->
      <el-table-column v-slot="scope" width="100" label="操作" align="center">
        <el-button
          v-show="!buttonHide && scope.row.buttonHide"
          type="danger"
          size="small"
          plain
          @click="handleDeleteManager(scope.row)"
        >删除</el-button>
      </el-table-column>
    </el-table>

    <div class="pager-wrapper">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pData.currentPage"
        :page-sizes="pData.pageSizes"
        :page-size="pData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pData.total"
      ></el-pagination>
    </div>

    <Modal v-model="addManagerShow" title="新增管理员">
      <el-form ref="addManagerForm" :model="addManagerForm" :rules="rules">
        <el-form-item label="选择赋权组织" prop="orgName">
          <el-cascader
            value="id"
            label="orgname"
            children="orgList"
            ref="cascaderOrg"
            class="common-width"
            v-model="addManagerForm.orgName"
            :options="allOrgOptions"
            :props="{ checkStrictly: true, expandTrigger: 'hover', value: 'id', label: 'orgname', children: 'orgList' }"
            clearable
            @change="getChangeData"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="选择指派人员" prop="manager">
          <el-select
            class="common-width"
            v-model="addManagerForm.manager"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入人名以搜索"
            :remote-method="handleRemoteSearch"
            :loading="loading"
          >
            <el-option
              v-for="item in allPersonOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.disabled"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限分配" prop="powerid">
          <el-select
            class="power"
            v-model="addManagerForm.powerid"
            placeholder="请选择权限类型"
            @change="completeData"
          >
            <el-option
              v-for="(item, index) in powerlist"
              :key="index"
              :value="item.id"
              :label="item.powerName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="member-add-footer" slot="footer">
        <div class="btn bgc-red" @click="handleConfirmAddManager">
          <span>确认</span>
        </div>
        <div class="btn" @click="handleCloseModal">
          <span>取消</span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Table, Button, Select, MessageBox, Message } from "element-ui";
import { setTimeout } from "timers";
export default {
  components: {
    [Table.name]: Table,
    [Button.name]: Button,
    [Select.name]: Select,
    [MessageBox.name]: MessageBox
  },
  data() {
    return {
      tHeight: 0, // 表格高度
      tDataList: [], // 表格数据
      lookType: null, // 查看类型
      powerType: null, // 权限类型
      allOrgOptionsItemLenth: null, // 选项长度
      powerlist: [], // 权限选项
      searchProp: "", // 搜索名称,
      pData: {
        total: 0,
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5, 10, 15, 20]
      },
      addManagerShow: false, // 新增管理员弹窗
      addManagerForm: {
        orgName: "",
        powerid: "",
        manager: ""
      },
      allOrgOptions: [], // 选择赋权组织的选项
      allPersonOptions: [], // 选择指派人员的选项
      loading: false,
      rules: {
        orgName: [
          { required: true, message: "请选择要赋权的组织", trigger: "blur" }
        ],
        manager: [
          { required: true, message: "请选择要指派的管理员", trigger: "blur" }
        ],
        powerid: [{ required: true, message: "请选择权限", trigger: "change" }]
      },
      spanArrorgname: [],
      tableData: [],
      spanArr1: [],
      spanArr2: [],
       position: 0,
      position1: 0,
      position2: 0,
    };
  },
  computed: {
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
    allLookTypes() {
      let _allLookTypes = [
        {
          id: 0,
          name: "按系统管理员查看"
        },
        {
          id: 1,
          name: "按机关管理员查看"
        },
        {
          id: 2,
          name: "按矿查看"
        },
        {
          id: 3,
          name: "按支部查看"
        }
      ];
      if (this.isJTManager) {
        return _allLookTypes.slice(1);
      } else if (this.isDWManager) {
        return _allLookTypes.slice(2);
      } else {
        return _allLookTypes;
      }
    },
    buttonHide() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType === "4") roleType = "0";
      // console.log(roleType != this.lookType);
      return roleType == this.lookType;
    },
    ...mapGetters(["getLoginUserInfo", "getIsManager"])
  },
  mounted() {
    let _this = this;
    this.getAllPowerFun();
    setTimeout(() => {
      autoReize();
    }, 0);

    function autoReize() {
      let wh = +window.innerHeight,
        tHeight = wh - 366;
      _this.tHeight = tHeight;
    }

    this.lookType = this.allLookTypes[0].id;

    this.getPageData();

    this.handleGetAllOrgs();
  },
  methods: {
    // 保留选项数据以作比较
    getChangeData(val) {
      this.allOrgOptionsItemLenth = val.length;
    },

    //比较数据权限是否为发布权限
    completeData(val) {
      if (val == 2 && this.allOrgOptionsItemLenth < 3) {
        this.$Modal.error({
          title: "提示信息",
          content: "请先选择一个支部，只有支部有发布权限"
        });
        this.addManagerForm.orgName = "";
      }
    },
    // 每页数据条数变化
    handleSizeChange(size) {
      this.pData.pageSize = size;
      this.getPageData();
    },
    // 页码变化
    handleCurrentChange(currentPage) {
      this.pData.currentPage = currentPage;
      this.getPageData();
    },
    // 查看模式改变
    handleChangeLookType() {
      this.pData.currentPage = 1;
      this.getPageData();
    },

    getPageData() {
      console.log(this.lookType);
      this.$Spin.show();
      let params = {
        currentPage: this.pData.currentPage,
        pageSize: this.pData.pageSize,
        type: this.lookType
      };

      if (this.searchProp) {
        Object.assign(params, {
          condition: this.searchProp
        });
      }
      this.getAdminByType(params).then(res => {
        if (res.success) {
          console.log("tDataList", res.data.rows);
          this.tableData = res.data.rows;
          this.pData.total = res.data.totalCount;

          let tDataList = [];

          (this.tableData || []).forEach((item, index) => {
            if (item.authList.length > 0) {
              item.authList.forEach((val, idx) => {
                console.log(" item.authList",item)
                if (val.powerList.length) {
                  val.powerList.forEach((List, idx) => {
                    console.log("List.powerName",List)
                    tDataList.push({
                      id: item.id,
                      orgcode: item.orgcode,
                      orgname: item.orgname,
                      index: index + 1,
                      account: val.account, //账号
                      eId: val.eId, //用户id
                      eName: val.eName, //用户姓名
                      powerCode: List.powerCode , //权限字符串
                      powerid: List.id , //权限id
                      powerName: List.powerName , //权限名
                      authId: val.id, //权限主键
                      level: val.level, //权限级别
                      oId: val.oId, //权限范围--组织
                      buttonHide: true
                    });
                  });
                } else {
                  tDataList.push({
                    id: item.id,
                    orgcode: item.orgcode,
                    orgname: item.orgname,
                    index: index + 1,
                    account: val.account, //账号
                    eId: val.eId, //用户id
                    eName: val.eName, //用户姓名
                    powerName: val.powerName , //用户姓名
                    authId: val.id, //权限主键
                    level: val.level, //权限级别
                    oId: val.oId, //权限范围--组织
                    buttonHide: true
                  });
                }

                console.log("debugger", val);
              });
            } else {
              tDataList.push({
                id: item.id,
                orgcode: item.orgcode,
                orgname: item.orgname,
                index: index + 1,
                account: "无", //账号
                eId: "", //用户id
                powerName: item.powerName || "无" , //用户姓名
                eName: "暂未添加人员", //用户姓名
                authId: "", //权限主键
                level: "", //权限级别
                oId: "", //权限范围--组织
                buttonHide: false
              });
            }
          });
          this.tDataList = tDataList;
          // this.$set(this,"tDataList",tDataList)
          // this.$nextTick(function(){
           this.rowspan(tDataList);
          // })
          // this.getSpanArr(this.tDataList);
          this.$Spin.hide();
        } else {
          console.log("error");
          this.$Spin.hide();
          this.$Modal.error({
            title: "提示信息",
            content: res.message
          });
        }
      });
    },
    getSpanArr(data) {
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].id === data[i - 1].id) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    cellMerge({ row, column, rowIndex, columnIndex }) {
      if (columnIndex <= 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log("hl",_row, _col)
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    rowspan(tDataList) {
      console.log("tDataList",tDataList)
      let _this=this
     tDataList.forEach((item, index) => {
         
        if (index === 0) {
          _this.spanArrorgname=[]
          _this.spanArrorgname.push(1);
          _this.position = 0;
          _this.spanArr1=[]
          _this.spanArr1.push(1);
          _this.position1 = 0;
          _this.spanArr2=[]
          _this.spanArr2.push(1);
          _this.position2 = 0;
        } else {
         
          if (tDataList[index].orgname === tDataList[index - 1].orgname) {
          
            _this.spanArrorgname[_this.position] += 1;
           
            _this.spanArrorgname.push(0);
            
          } else {
            _this.spanArrorgname.push(1);
            _this.position = index;
          }
          if (tDataList[index].eName === tDataList[index - 1].eName) {
            this.spanArr1[this.position1] += 1;
            this.spanArr1.push(0);
          } else {
            this.spanArr1.push(1);
            this.position1 = index;
          }
          if (tDataList[index].account === tDataList[index - 1].account) {
            this.spanArr2[this.position1] += 1;
            this.spanArr2.push(0);
          } else {
            this.spanArr2.push(1);
            this.position2 = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      //row: 当前行 column: 当前列 rowIndex：当前行号 columnIndex ：当前列号
     
   
     
      if (columnIndex === 0) {                
        const _row = this.spanArrorgname[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        
         console.log("hl",_row, _col)
        return {
          rowspan: _row,                
          colspan: _col
        };
        
      }
      if (columnIndex === 1) {                
        const _row = this.spanArrorgname[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        
         console.log("hl",_row, _col)
        return {
          rowspan: _row,                
          colspan: _col
        };
      }
      if (columnIndex === 2) {
        const _row = this.spanArr1[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log("hl2",_row, _col)
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 3) {
        const _row = this.spanArr2[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log("hl2",_row, _col)
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    // 获取权限接口 /power/getAll
    getAllPowerFun() {
      let _this = this;
      this.getAllPower().then(res => {
        if (res.success) {
          _this.powerlist = [];
          _this.$set(_this, "powerlist", res.data);
        }
        console.log("res", res);
      });
    },
    // 增加管理员
    handleAddManager() {
      this.addManagerShow = true;
    },
    // 确认新增管理员
    handleConfirmAddManager() {
      this.$refs["addManagerForm"].validate(valid => {
        if (valid) {
          this.$Spin.show();
          console.log(this.addManagerForm);
          // return false;
          let params = {
            oid: this.addManagerForm.orgName[
              this.addManagerForm.orgName.length - 1
            ],
            eid: this.addManagerForm.manager.join("|"),
            powerid: this.addManagerForm.powerid
          };

          this.addAuth(params).then(res => {
            if (res.success) {
              this.$Spin.hide();
              this.handleCloseModal();
              this.getPageData();
              this.$Modal.success({
                title: "提示信息",
                content: "添加成功"
              });
            } else {
              console.log("error");
              this.$Spin.hide();
              this.$Modal.error({
                title: "提示信息",
                content: res.message
              });
            }
          });
        }
      });
    },
    // 关闭新增管理员弹窗
    handleCloseModal() {
      this.addManagerShow = false;
      this.allPersonOptions = [];
      this.$refs["addManagerForm"].resetFields();
    },
    // 删除管理员
    handleDeleteManager(row) {
      let _this=this,tableData=_this.tDataList;
      let newlist= tableData.filter((item)=>{
        
      return item.eName==row.eName
        
      })
      if (newlist.length>1) {
         this.$Modal.confirm({
        title: "提示",
        content: "是否删除管理员该权限？",
        loading: true,
        onOk: () => {
          let id = row.authId;
          let params = {
            eId: row.eId,
            oId: row.oId,
            powerCode: row.powerCode,
          };
        
          this.delAuth(params).then(res => {
            if (res.success) {
              this.$Modal.remove();
              this.$Message.success("删除成功");
              this.getPageData();
            } else {
              this.$Modal.error({
                title: "提示信息",
                content: res.message
              });
            }
          });
        }
      });
      }else{
        this.$Modal.confirm({
        title: "提示",
        content: "是否删除该管理员及其权限？",
        loading: true,
        onOk: () => {
          let id = row.authId;
          let params = {
            eId: row.eId,
            oId: row.oId,
            powerCode: row.powerCode,
          };
        
          this.delAuth(params).then(res => {
            if (res.success) {
              this.$Modal.remove();
              this.$Message.success("删除成功");
              this.getPageData();
            } else {
              this.$Modal.error({
                title: "提示信息",
                content: res.message
              });
            }
          });
        }
      });
      }
      
      // MessageBox.confirm('是否确认删除此管理员', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      //   cancelButtonClass: 'btn',
      //   confirmButtonClass: 'btn bgc-red'
      // }).then(() => {

      // }).catch(() => {

      // })
    },
    // 搜索人名、组织名，电话号码
    handleSearch() {
      this.pData.currentPage = 1;
      console.log("test");
      this.getPageData();
    },
    // 依据不同登录用户，获取所管辖组织的层级结构
    handleGetAllOrgs() {
      let info = this.getLoginUserInfo;

      let params = {
        id: info.oid
      };

      this.getOrgsRemSome(params).then(res => {
        console.log("lianji", res.data);
        if (res.success) {
          this.allOrgOptions = res.data;
        } else {
          console.log("error");
          this.$Modal.error({
            title: "提示信息",
            content: res.message
          });
        }
      });
    },
    // 选择指派人员时的远程搜索
    handleRemoteSearch(query) {
      if (query !== "") {
        this.loading = true;
        this.getEmpByDim({ dim: query }).then(res => {
          (res.data || []).forEach(item => {
            item.label = `${item.orgname}     ${item.account}`;
            // item.disabled = item.roleType !== "0";
            // item.name =
            //   item.roleType !== "0" ? item.name + "（已是管理员）" : item.name;
          });

          this.allPersonOptions = res.data;

          this.loading = false;
        });
      } else {
        this.allPersonOptions = [];
      }
    },
    ...mapActions([
      "getAdminByType",
      "getEmpByDim",
      "getAllPower",
      "delAuth",
      "addAuth",
      "getOrgsRemSome"
    ])
  }
};
</script>

<style>
/* .el-input--suffix .el-input__inner,
.el-select .el-input.is-focus .el-input__inner,
.el-select .el-input__inner:focus,
.el-input__inner:hover,
.el-input__inner
{
  border: 1px solid #d11528 !important;
} */
.el-form-item__error {
  left: 108px;
}
.el-button > span {
  font-size: 14px;
}

.el-pagination__jump {
  display: inline-flex !important;
}
</style>
<style lang="less" scoped>
.btn {
  width: 86px;
  height: 40px;
  // border: solid 1px #d11528;
  font-size: 14px;
  // color: #d11528;
}
.setting_btn {
  margin-left: 412px;
}
.manager-setting-wrap {
  width: 1100px;
  margin: 0 auto;
  background: #fff;
  padding: 15px 20px;
  .search-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .look-type {
      margin-left: 10px;
    }
    .input-search {
      margin-left: 10px;
      width: 250px;
    }
  }
  .pager-wrapper {
    margin-top: 15px;
    text-align: right;
  }
}
.member-add-footer {
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
.common-width {
  width: 380px;
}
.el-select-dropdown .el-popper {
  min-width: 378px;
}
.power {
  .el-popper {
    width: 380px;
  }
  width: 380px;
  margin-left: 27px;
}
.power .el-select-dropdown .el-popper {
  width: 380px;
}
</style>>