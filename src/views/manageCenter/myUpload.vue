<template>
  <div class="my-upload-wrap">
    <listHeader listTitle="我的上传" openMarginBotton>
      <div slot="headOpts">
        <el-select v-model="sourceType" @change="changeSourceType" placeholder="请选择上传类型" clearable>
          <el-option v-for="(item, index) in allSourceType" :key="index" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </div>
    </listHeader>

    <dataList :actionUrl="actionUrl" :actionParams="actionParams">
      <template v-slot:itemOpts={dataItem}>
        <div class="slot-opts-wrap edit-item-opt" v-if="dataItem.approve !== 0 && dataItem.isWorkPlan === 0 || (isJTManager && dataItem.isWorkPlan === 0) "> 
          <div class="opt-item" @click="revokeToDraft(dataItem)">
            <div class="icon revoke-icon"></div>
            <div class="title">撤回</div>
          </div>
        </div>
      </template>
    </dataList>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import listHeader from '@/components/common/listHeader'
import dataList from '@/components/common/dataList'
export default {
  components: {
    listHeader,
    dataList
  },
  data() {
    return {
      actionUrl: 'getMyUpload',
      actionParams: {
        action: 'getMyUpload',
        channelCode: ''
      },
      sourceType: null,
      allSourceType: [{
        id: 0,
        name: '党建信息'
      }, {
        id: 1,
        name: '我的组织'
      }, {
        id: 2,
        name: '工作计划'
      }]
    }
  },
  computed: {
    isJTManager(){
        let {roleType} = this.getLoginUserInfo;
        if(roleType == '1'){
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
    changeSourceType() {
      this.actionParams.channelCode = this.sourceType
    },
    // 撤回为草稿状态
    revokeToDraft(dataItem) {
      console.log(dataItem)

      let params = {
        id: dataItem.id,
        isDraft: 1
      }

      this.essayChange(params).then(res => {
        if(res.success) {
          $eventBus.$emit('refreshDataList');
          // $eventBus.$emit('refreshTabBar', {
          //     isMyDatum: this.isDWManager ? true : false,
          //     currentTabName: this.curTabName
          // });
          this.$Message.success('撤回成功');
        } else {
          this.$Message.error('撤回失败');
        }
      })
    },
    ...mapActions([
      'essayChange'
    ])
  }
}
</script>

<style lang="less" scoped>
.my-upload-wrap {
  width: 1100px;
  margin: 0 auto;
}
.edit-item-opt {
  .opt-item {
    background-color: #ffffff;
    border-radius: 6px;
    border: 1px solid #d11528;
    font-size: 18px;
    color: #d11528;
    justify-content: center;
  }
  .icon {
    width: 18px;
    height: 18px;
    &.revoke-icon {
      background: url('~@/images/my_icon_cehui.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>