<template>
  <div class="draft-box-wrap">
    <listHeader listTitle="草稿箱" openMarginBotton></listHeader>

    <dataList :actionUrl="actionUrl">
      <template v-slot:itemOpts={dataItem}>
        <div class="slot-opts-wrap edit-item-opt"> 
          <div class="opt-item" @click="editEssay(dataItem)">
            <div class="title">编辑</div>
          </div>
          <div class="opt-item" @click="deleteEssay(dataItem)">
            <div class="title">删除</div>
          </div>
        </div>
      </template>
    </dataList>
  </div>
</template>

<script>
import listHeader from '@/components/common/listHeader'
import dataList from '@/components/common/dataList'
import {mapGetters, mapActions} from 'vuex'
export default {
  data() {
    return {
      actionUrl: 'getDrafts',
    }
  },
  methods: {
    editEssay(data) {
      console.log(data)
      // return false;
      this.changeSubNaviPath('informationPublish');
      this.$router.push({ name: 'informationPublish', params: { id: data.id }});
    },
    deleteEssay(data) {
      this.delWorkPlan({id: data.id}).then(res => {
        if(res.success){
          this.$Message.success('删除成功')
          $eventBus.$emit('refreshDataList');
        } else {
          this.$Message.error('删除失败')
        }
      });
    },
    ...mapActions([
        'changeSubNaviPath',
        'delWorkPlan'
    ])
  },
  components: {
    listHeader,
    dataList,
  }
}
</script>

<style lang="less" scoped>
.draft-box-wrap {
  width: 1100px;
  margin: auto;
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
}
</style>
