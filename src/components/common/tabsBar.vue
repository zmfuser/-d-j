<template>
    <div class="tabs-container" :class="noMarginBottom?'':'margin-b-16'">
        <div class="tabs-content">
            <div class="tabs-item" :class="item.selected?'active':''" :style="`background-color: ${defaultBgColor}`" v-for="(item, i) of tabsDataCpd" :key="i" @click="tabChange(item)">
                <span>{{ item.title }}{{ tabsType?`（${item.count}）`:'' }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import util from '@/tools/util'
    export default {
        props: {
            tabsData: {
                type: Array,
                default(){
                    return [];
                }
            },
            tabsType: {
                type: String,
                default: ''
            },
            noMarginBottom: {
                type: Boolean,
                default: false
            },
            defaultShowTab: {
                type: String,
                default: ''
            },
            defaultBgColor: {
                type: String,
                default: '#fff'
            },
            isChangeSubNavi: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                tabsDataCpd: [],

                isMyWorkPlan: false,
                isOrgIdWorkPlan: false,
                isMyDatum: false,
            }
        },
        computed: {
            ...mapGetters([
                'getCurrentNavi'
            ])
        },
        created(){
            $eventBus.$on('refreshTabBar', params => {
                // console.log(params);
                if(params.isMyDatum){
                    this.isMyDatum = true;
                } else {
                    this.isMyDatum = false;
                }
                if(params.isMyWorkPlan){
                    this.isMyWorkPlan = true;
                }
                if(params.isOrgIdWorkPlan){
                    this.isOrgIdWorkPlan = true;
                }
                this.tabsInit(params);
            });
            $eventBus.$on('setTabCount', params => {
                for(const item of this.tabsDataCpd) {
                    if(item.countMap == params.countMapper){
                        item.count = params.count;
                    }
                }
            });
        },
        mounted(){
            this.tabsInit();
        },
        methods: {
            getIndex(curTabName) {
                switch(curTabName) {
                    case '待审核':
                        return 0;
                        break;
                    case '未通过':
                        return 1;
                        break;
                    case '已通过':
                        return 2;
                        break;
                    default:
                        break;
                }
            },
            getIndex1(curTabName) {
                console.log(curTabName);
                switch(curTabName) {
                    case 'nonexecution':
                        return 0;
                        break;
                    case 'executing':
                        return 1;
                        break;
                    case 'executed':
                        return 2;
                        break;
                    case 'noexecuted':
                        return 3;
                        break;
                    default:
                        return 0;
                        break;
                }
            },
            tabsInit(tabPara){
                let index = this.$route.name === 'workPlanList' ? this.getIndex1(this.$route.query.curTab) : (tabPara ? this.getIndex(tabPara.currentTabName) : 0);
                // console.log(index);
                let tabDatas = util.deepClone(this.tabsData);
                if(!this.tabsType){
                    if(this.defaultShowTab){
                        let tab = tabDatas.filter(tab => tab.type == this.defaultShowTab);
                        if(tab.length == 1){
                            this.tabChange(tab[0]);
                        }
                    }else{
                        for(let i = 0; i < tabDatas.length; i++){
                            let item = tabDatas[i];
                            this.$set(item, 'selected', false);
                            if(i == index){
                                item.selected = true;
                                // this.tabChange(item);
                            }
                        }
                    }
                    this.tabsDataCpd = tabDatas;
                }else{
                    let params = this.buildParams();
                    this.getCountByType(params).then(res => {
                        if(res.success){
                            let tabsCount = res.data;
                            if(tabsCount){
                                for(const tabItem of tabDatas){
                                    tabItem.count = tabsCount[tabItem.countMap] || 0;
                                }
                            }
                            if(this.defaultShowTab){
                                let tab = tabDatas.filter(tab => tab.type == this.defaultShowTab);
                                if(tab.length == 1){
                                    this.tabChange(tab[0]);
                                }
                            }else{
                                for(let i = 0; i < tabDatas.length; i++){
                                    let item = tabDatas[i];
                                    this.$set(item, 'selected', false);
                                    if(i == index){
                                        item.selected = true;
                                        // this.tabChange(item);
                                    }
                                }
                            }
                            this.tabsDataCpd = tabDatas;
                        }
                    });
                }
            },
            tabChange(tab){
                // console.log(tab);
                // $eventBus.$emit('refreshTabBar', {currentTabName: tab.title})
                if(this.$route.name === 'myOrganization' || this.$route.name === 'partyInfo') {
                    this.$router.push({path: this.$route.name, query: {type: tab.type}});
                }
                // this.$route.query.type = tab.type;
                for(const item of this.tabsDataCpd){
                    if(!item.hasOwnProperty('selected')){
                        this.$set(item, 'selected', false);
                    }else{
                        item.selected = false;
                    }
                }
                this.$emit('tabChange', {
                    tab
                })
                tab.selected = true;
                if(this.isChangeSubNavi){
                    this.changeSubNaviPath(tab.type);
                }
            },
            buildParams(){
                let ret = {};
                if(this.tabsType == 'partyInfo'){
                    ret.type = 3;
                }else if(this.tabsType == 'workplan'){
                    ret.type = 1;
                }else if(this.tabsType == 'examine'){
                    ret.type = 2;
                }
                ret.isMyWorkPlan = this.isMyWorkPlan;
                ret.isOrgIdWorkPlan = this.isOrgIdWorkPlan;
                ret.isMyDatum = this.isMyDatum;
                return ret;
            },
            ...mapActions([
                'getCountByType',
                'changeSubNaviPath'
            ])
        },
        watch: {
            defaultShowTab(newValue) {
                this.tabsInit();
            }
        },
    }
</script>

<style lang="less" scoped>
    .tabs-container {
        &.margin-b-16 {
            margin-bottom: 16px;
        }
        .tabs-content {
            display: flex;
            .tabs-item {
                position: relative;
                flex: 1;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 60px;
                margin-right: 2px;
                background-color: #ffffff;
                font-size: 16px;
                color: #333;
                cursor: pointer;
                &:last-child {
                    margin-right: 0;
                }
                &.active {
                    color: #fff;
                    background-color: #d11528 !important;
                    &::before {
                        content: '';
                        position: absolute;
                        bottom: -1px;
                        left: 50%;
                        margin-left: -8px;
                        width: 0;
                        height: 0;
                        border-top: 0;
                        border-left: 8px solid transparent;
                        border-right: 8px solid transparent;
                        border-bottom: 7px solid #fff;
                    }
                }
            }
        }
    }
</style>