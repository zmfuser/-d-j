<template>
  <div class="my-data">
    <div class="select-wrap">
      <div>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="getData"
          :picker-options="pickerOptions"
          style="margin-right: 10px"
        ></el-date-picker>
        <el-cascader
          v-model="selectOrgId"
          :options="allOrgOptions"
          :props="{ multiple: true, checkStrictly: true, value: 'id', label: 'orgname', children: 'orgList', emitPath: false }"
          clearable
          @change="getData"
          placeholder="请选择组织，可多选"
          style="width: 596px"
          :show-all-levels="false"
        ></el-cascader>
      </div>

      <div class="btn" @click="handleExport">
        <span>导出</span>
      </div>
    </div>

    <div class="table-wrap">
      <el-table :height="tHeight" :data="tData" @selection-change="changeTableRowId" v-loading="loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" align="center" prop="id" width="60"></el-table-column>
        <el-table-column label="组织" align="center" prop="orgName" width="200"></el-table-column>
        <el-table-column label="时间" align="center" prop="time" width="120"></el-table-column>
        <el-table-column label="管理员" align="center" prop="managerName" width="90">
          <template v-slot="scope">{{scope.row.managerName.join(' | ')}}</template>
        </el-table-column>
        <el-table-column label="党建信息" align="center">
          <el-table-column label="经验交流" align="center" prop="jyjlCount"></el-table-column>
          <el-table-column label="党内培训" align="center" prop="dnpxCount"></el-table-column>
          <el-table-column label="民主管理" align="center" prop="mzglCount"></el-table-column>
          <el-table-column label="合计" align="center" prop="djxxSumCount"></el-table-column>
        </el-table-column>
        <el-table-column label="我的组织" align="center">
          <el-table-column label="组织生活" align="center" prop="zzshCount"></el-table-column>
          <el-table-column label="党内活动" align="center" prop="dnhdCount"></el-table-column>
          <el-table-column label="党内关怀" align="center" prop="dnghCount"></el-table-column>
          <el-table-column label="考核管理" align="center" prop="khglCount"></el-table-column>
          <el-table-column label="合计" align="center" prop="wdzzSumCount"></el-table-column>
        </el-table-column>
        <el-table-column label="工作计划" align="center" prop="gzjhCount"></el-table-column>
        <el-table-column label="备注" align="center" prop="remark"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import tool from "../../tools/util";
export default {
  data() {
    return {
      dateRange: [
        tool.translateDateTimeToStr(
          new Date().getTime() - 3600 * 1000 * 24 * 7
        ),
        tool.translateDateTimeToStr(new Date())
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近二个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      allOrgOptions: [],
      selectOrgId: [],
      selectOrgIdList: [],
      tHeight: 0,
      loading: false,
      tData: []
    };
  },
  created() {
    this.handleGetAllOrgs();
    console.log(this.dateRange);
    this.getData();
  },
  mounted() {
    let _this = this;

    setTimeout(() => {
      autoReize();
    }, 0);

    function autoReize() {
      let wh = +window.innerHeight,
        tHeight = wh - 396;
      _this.tHeight = tHeight;
    }
  },
  methods: {
    // 选中或取消
    changeTableRowId(row) {
      var newList = [];
      row.forEach(function(item) {
        newList.push(item.orgId);
      });
      this.selectOrgId = newList;
    },
    handleGetAllOrgs() {
      let _this = this;
      this.getOrgsData().then(res => {
        this.allOrgOptions = res.data;
        _this.changedata(res.data);
        console.log("selectOrgIdList", _this.selectOrgIdList);
        _this.getDataOne();
      });
    },
    // 遍历生成全选数组
    changedata(data) {
      let _this = this;
      data.forEach(function(item) {
        _this.selectOrgIdList.push(item.id);
        if (item.orgList && item.orgList.length > 0) {
          _this.changedata(item.orgList);
        }
      });
    },
    // handleDate() {
    //   console.log(this.dateRange);
    // },
    // handleOrg(flag) {
    //   console.log(flag);
    //   if(!flag) {
    //     this.getData()
    //   }
    // },
    // 首次全部查出
    getDataOne() {
      console.log(this.selectOrgId);
      this.getCountDetail({
        orgIds: this.selectOrgIdList,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      }).then(res => {
        if (res.success) {
          console.log(res);
          this.tData = res.data;
          this.loading=false;
        }
      });
    },
    getData() {
       this.loading=true;
      if (this.selectOrgId.length < 1) {
        this.handleGetAllOrgs();
      } else {
        console.log("this.selectOrgId", this.selectOrgId);
        this.getCountDetail({
          orgIds: this.selectOrgId,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1]
        }).then(res => {
          if (res.success) {
            console.log(res);
            this.tData = res.data;
             this.loading=false;
          }
        });
      }
    },
    handleExport() {
      this.getCSV({
        orgIds: this.selectOrgId,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      }).then(res => {
        const blob = new Blob([res], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const downloadElement = document.createElement("a");
          const href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = `数据统计.xlsx`;
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        } else {
          navigator.msSaveBlob(blob, "数据统计");
        }
      });
    },
    ...mapActions(["getOrgsData", "getCountDetail", "getCSV"])
  }
};
</script>

<style lang="less" scoped>
.my-data {
  width: 1100px;
  margin: 0 auto;
  background: #fff;
  padding: 15px 20px;
}
.select-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  }
}

.table-wrap {
  margin-top: 15px;
}
</style>