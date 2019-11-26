<template>
    <div class="manage-center-warp">
        <div class="item-wrapper">
            <div class="manage-center-item" v-for="(item,index) in itemList.slice(0, 3)" :key="index" @click="cliclRow(item)">
                <div :class="`item-icon ${item.icon}`"></div>
                <div class="item-title">{{ item.title }}</div>
            </div>
        </div>
        <div class="item-wrapper item-wrapper1">
            <div class="manage-center-item" v-for="(item,index) in itemList.slice(3, 6)" :key="index" @click="cliclRow(item)">
                <div :class="`item-icon ${item.icon}`"></div>
                <div class="item-title">{{ item.title }}</div>
            </div>
        </div>
        <div class="item-wrapper item-wrapper2" v-if="itemList.length > 6">
            <div class="manage-center-item" v-for="(item,index) in itemList.slice(6)" :key="index" @click="cliclRow(item)">
                <div :class="`item-icon ${item.icon}`"></div>
                <div class="item-title">{{ item.title }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    export default {
        data() {
            return {
                itemList: [
                    {
                        icon:'information',
                        title:'信息发布',
                        href:'informationPublish'
                    }, {
                        icon:'planupload',
                        title:'上传计划',
                        href:'workPlanUpload'
                    }, {
                        icon: 'person',
                        title: '我的上传',
                        href: 'myUpload'
                    }, {
                        icon:'approve',
                        title:'审核资料',
                        href:'examineDataList'
                    }, 
                    // {
                    //     icon:'planlist',
                    //     title:'工作计划',
                    //     href:'workPlanList'
                    // }, 
                    {
                        icon: 'draft',
                        title: '草稿箱',
                        href: 'draftBox'
                    }, 
                    {
                        icon: 'statistics',
                        title: '数据统计',
                        href: 'statistics'
                    }
                ]
            }
        },
        created() {
            if(!this.isJTManager) {
                this.itemList.pop()
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
                'getCurrentNavi',
                'getLoginUserInfo'
            ])
        },
        mounted(){
            let {name} = this.$route;
            if(this.getCurrentNavi != name){
                this.changeNaviPath(name);
            }
        },
        methods: {
            cliclRow(item) {
                this.changeSubNaviPath(item.href);
                this.$router.push(item.href);
            },
            ...mapActions([
                'changeNaviPath',
                'changeSubNaviPath',
            ])
        },
        // watch: {
        //     getLoginUserInfo(){
        //         console.log(this.isJTManager);
        //         if(!this.isJTManager) {
        //             this.itemList.pop();
        //         }
        //     },
        // }
    }
</script>

<style lang="less" scoped>
    .manage-center-warp{
        width: 1100px;
        margin: 0 auto;
        display: flex;
        // justify-content: center;
        // align-items: center;
        // margin-bottom: 80px;
        background: #ffffff;
        flex-direction: column;
        .item-wrapper {
            flex: 0 0 320px;
            padding: 70px 0 0 0;
            display: inline-flex;
            flex-flow: wrap;
            width: 920px;
            margin: auto;
            .manage-center-item {
                height: 200px;
                flex: 0 0 280px;
                padding: 56px 0;
                margin: 0 40px 40px 0;
                background-color: #ffffff;
                border-radius: 6px;
                border: 1px solid #cccccc;
                flex-direction: row;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                .item-icon{
                    width: 36px;
                    height: 36px;
                    margin-right: 22px;
                    &.information {
                        background: url('~@/images/gl_icon_v1_xxfb.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.planupload {
                        background: url('~@/images/gl_icon_v1_upload.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.approve {
                        background: url('~@/images/gl_icon_v1_sh.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.planlist {
                        background: url('~@/images/gl_icon_v1_gzjh.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.person {
                        background: url('~@/images/gl_icon_v1_person.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.draft {
                        background: url('~@/images/gl_icon_v1_draft.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.statistics {
                        background: url('~@/images/gl_icon_v1_tj.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
                .item-title{
                    font-size: 22px;
                    line-height: 21.7px;
                    color: #d11528;
                }
            }
            .manage-center-item:last-child {
                margin-right: 0;
            }
        }
        
    }
.item-wrapper1 {
    padding: 0 !important;
    width: 920px !important;
    margin: auto !important;

}

.item-wrapper2 {
    padding-top: 0 !important;
    margin-top: -65px !important;
}
</style>