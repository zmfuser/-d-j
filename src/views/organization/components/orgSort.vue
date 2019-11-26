<template>
  <div>
    <Modal v-model="orgSortShow" title="组织排序" @on-cancel="handleCloseModal" :width="720">
      <div class="title">
        <span class="title-item" :class="{'active': currentItem === 0}" @click="changeItem(0)">一级组织</span>
        <span class="title-item" :class="{'active': currentItem === 1}" @click="changeItem(1)">二级组织</span>
      </div>
      
      <div v-show="currentItem === 0" class="content" id="content">
        <div v-for="(item, index) in orgData1" :key="index" class="content-item" id="content-item" :data-id="item.id">
          <span>{{item.orgname}}</span>
        </div>
      </div>
      
      <div v-show="currentItem === 1" class="content-wrap">
        <el-scrollbar style="height: 100%;">
          <div class="org-select">
            <Tree :data="orgTreeData" children-key="orgList" @on-select-change="selectChange"></Tree>
          </div>
        </el-scrollbar>
        

        <div class="org-wrap" id="org-wrap">
          <div v-for="(item, index) in orgData2" :key="index" class="org-item" id="org-item" :data-id="item.id">
            <span>{{item.orgname}}</span>
          </div>
        </div>
        
      </div>

      <div class="org-sort-footer" slot="footer">
          <div class="btn bgc-red" @click="handleConfirmOrgSort">
              <span>确认</span>
          </div>
          <!-- <div class="btn" @click="handleCloseModal">
              <span>取消</span>
          </div> -->
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import util from '@/tools/util'
import $ from "jquery"
require("webpack-jquery-ui")
require("webpack-jquery-ui/css")
export default {
  props: [
    'orgSortShow'
  ],
  watch: {
    orgSortShow: {
      handler(val) {
        if(val) {
          this.getOrgsData().then(res => {
            this.orgData1 = res.data[0].orgList;
            (res.data || []).forEach(item => {
              item.title = item.orgname;
              item.expand = true;
              if(item.orgList && item.orgList.length) {
                item.orgList.forEach((val, index) => {
                  // if(index === 0) val.selected = true;
                  let list = util.deepClone(val.orgList)
                  val.title = val.orgname;
                  val.orgList = [];
                  // list.shift();
                  this.orgData2Obj[val.id] = list || [];
                })        
              }
            })

            this.orgTreeData = res.data;
          })
        }
      }
    }
  },
  data() {
    return {
      currentItem: 0,
      orgData1: [], // 所有的一级组织，即矿
      orgData2: [], // 选中的一级组织对应的二级组织
      orgTreeData: [],
      orgData2Obj: {},
      sortids: [],
      flag2: false,
      flag1: false,
    }
  },
  created() {
    console.log(this.orgSortShow);
    // this.getOrgsData().then(res => {
    //   this.orgData1 = res.data[0].orgList;
    //   (res.data || []).forEach(item => {
    //     item.title = item.orgname;
    //     item.expand = true;
    //     if(item.orgList && item.orgList.length) {
    //       item.orgList.forEach((val, index) => {
    //         // if(index === 0) val.selected = true
    //         let list = util.deepClone(val.orgList)
    //         val.title = val.orgname;
    //         val.orgList = [];
    //         list.shift();
    //         this.orgData2Obj[val.id] = list || [];
    //       })        
    //     }
    //   })

    //   this.orgTreeData = res.data;
    // })
  },
  mounted() {
    console.log('test');
    this.initSort1();  // 一级组织科排序
  },
  methods: {
    handleConfirmOrgSort() {
      this.orgSort({sortids: this.sortids}).then(res => {
        if(res.success) {
          this.$Message.success('组织排序成功')
          this.$emit('refresh');
          this.handleCloseModal()
        } else {
          this.$Modal.error({
            title: '提示',
            content: res.message
          })
        }
      })

    },
    handleCloseModal() {
      this.currentItem = 0;
      this.orgData1 = [];
      this.orgTreeData = [];
      this.orgData2 = [];
      this.orgData2Obj = {};
      this.flag1 = false;
      this.flag2 = false;
      this.$emit('closeOrgSort')
    },
    changeItem(currentItem) {
      this.currentItem = currentItem;
    },
    selectChange(arr, item) {
      if(this.flag1) {
        $( "#content" ).sortable( "option", "disabled", true );
      }
      this.orgData2 = this.orgData2Obj[item.id];

      this.$nextTick(() => {
        this.flag2 = true;
        $('#org-wrap').sortable({
          containment: '#org-wrap',
          update: (event, ui) => {
            let temp = $('#org-wrap').sortable('toArray', {attribute: 'data-id'})

            this.sortids = temp;

            // this.orgSort({sortids: temp}).then(res => {
            //   console.log(res);
            // })
          }
        })
      })
    },
    initSort1() {
      if(this.flag2) {
        $( "#org-wrap" ).sortable( "option", "disabled", true );
      }
      this.$nextTick(() => {
        this.flag1 = true;
        $('#content').sortable({
          containment: '#content',
          update: (event, ui) => {
            let temp = $('#content').sortable('toArray', {attribute: 'data-id'})

            this.sortids = temp;
            // this.orgSort({sortids: temp}).then(res => {
            //   console.log(res);
            // })
          }
        })
      })  
    },
    ...mapActions([
      'getOrgsData',
      'orgSort'
    ])
  },
}
</script>

<style lang="less" scoped>
.title {
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
  font-size: 18px;
  margin-bottom: 20px;
  .title-item {
    padding-bottom: 10px;
  }
  .active {
    color: #d11528;
    border-bottom: 3px solid #d11528;
    font-weight: 500;
  }
}
.content {
  display: flex;
  flex-wrap: wrap;
  height: 300px;
  overflow-y: auto;
  align-items: space-between;
  // justify-content: space-around;
  .content-item {
    display: inline-block;
    font-size: 16px;
    border: 1px solid #ccc;
    margin: 10px 10px;
    width: 148px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #fff;
  }
  .ui-sortable-helper {
    background: #d11528;
    color: #fff;
  }
}
.content-wrap {
  display: flex;
  height: 300px;
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .org-select {
    height: 100%;
    overflow-y: auto;
    width: 160px;
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
  .org-wrap {
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    align-content: flex-start;
    flex: 1;
    .org-item {
      display: inline-block;
      font-size: 16px;
      border: 1px solid #ccc;
      margin: 10px 10px;
      width: 144px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: #fff;
    }

    .ui-sortable-helper {
      background: #d11528;
      color: #fff;
    }
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
