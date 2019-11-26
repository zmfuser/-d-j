<template>
    <div class="org-selector-wrapper">
        <Collapse v-model="currentOrg">
            <Panel name="all" :hide-arrow="hideArrow">
                <div class="org-item" @click="checkBuxian">
                    <div class="selected-tag" v-show="buxianChecked"></div>
                    <div class="info">
                        <div class="avatar av-buxian"></div>
                        <div class="orgname">不限</div>
                    </div>
                </div>
            </Panel>
            <template v-for="(org, i) of orgDataCpd">
                <Panel :name="org.id.toString()" :hide-arrow="hideArrow" :key="i">
                    <div class="org-item" @click="orgExpand(org)">
                        <template v-if="org.orgCode != 1">
                            <div class="selected-tag" v-show="org.selected"></div>
                        </template>
                        <div class="info">
                            <div class="avatar" :class="getOrgAvatar(org.orgCode)"></div>
                            <div class="orgname">{{ org.orgName }}</div>
                        </div>
                        <div class="arrow-wrap" :class="org.expand?'expand':''" v-if="org.child.length">
                            <Icon type="md-arrow-dropright" />
                        </div>
                    </div>
                    <template v-if="org.child.length">
                        <div slot="content">
                            <Collapse>
                                <template v-for="(child, j) of org.child">
                                    <Panel :name="child.id.toString()" :hide-arrow="hideArrow" :key="j">
                                        <div class="org-item" @click="orgClickHandle(child)">
                                            <div class="selected-tag" v-show="child.selected"></div>
                                            <div class="info">
                                                <div class="avatar" :class="getOrgAvatar(child.orgCode)"></div>
                                                <div class="orgname">{{ child.orgName }}</div>
                                            </div>
                                        </div>
                                    </Panel>
                                </template>
                            </Collapse>
                        </div>
                    </template>
                </Panel>
            </template>
        </Collapse>
    </div>
</template>
<script>
    import util from '@/tools/util'
    import { mapActions } from 'vuex'
    export default {
        props: {
            orgData: {
                type: Array,
                default(){
                    return [];
                }
            },
        },
        data() {
            return {
                /* orgData: [
                    {
                        id: '1',
                        title: '火铺矿',
                        avatar: '',
                        children: [
                            {
                                id: '11',
                                title: '火铺矿 - 第一支部',
                                avatar: '',
                            }, {
                                id: '12',
                                title: '火铺矿 - 第二支部',
                                avatar: '',
                            }, {
                                id: '13',
                                title: '火铺矿 - 第三支部',
                                avatar: '',
                            }, {
                                id: '14',
                                title: '火铺矿 - 第四支部',
                                avatar: '',
                            }
                        ]
                    }, {
                        id: '2',
                        title: '金价矿',
                        avatar: '',
                        children: [
                            {
                                id: '21',
                                title: '金价矿 - 第一支部',
                                avatar: '',
                            }, {
                                id: '22',
                                title: '金价矿 - 第二支部',
                                avatar: '',
                            }, {
                                id: '23',
                                title: '金价矿 - 第三支部',
                                avatar: '',
                            }, {
                                id: '24',
                                title: '金价矿 - 第四支部',
                                avatar: '',
                            }
                        ]
                    }, {
                        id: '3',
                        title: '中山梅矿',
                        avatar: '',
                        children: [
                            {
                                id: '31',
                                title: '中山梅矿 - 第一支部',
                                avatar: '',
                            }, {
                                id: '32',
                                title: '中山梅矿 - 第二支部',
                                avatar: '',
                            }, {
                                id: '33',
                                title: '中山梅矿 - 第三支部',
                                avatar: '',
                            }, {
                                id: '34',
                                title: '中山梅矿 - 第四支部',
                                avatar: '',
                            }
                        ]
                    }
                ], */
                orgDataSave: [],
                currentOrg: '',
                hideArrow: true,

                buxianChecked: false
            }
        },
        computed: {
            orgDataCpd() {
                // let data = util.deepClone(this.orgData);
                let data = this.orgDataSave;
                for(const org of data){
                    if(org.child && org.child.length){
                        this.$set(org, 'expand', false);
                        // org.expand = false;
                        for(const child of org.child){
                            this.$set(child, 'selected', false);
                            // child.selected = false;
                        }
                    }else{
                        this.$set(org, 'selected', false);
                        this.$set(org, 'child', []);
                    }
                }
                return data;
            }
        },
        created(){
            $eventBus.$on('filterReset', () => {
                for(const org of this.orgDataCpd){
                    if(org.child.length){
                        org.expand = false;
                        for(const child of org.child){
                            if(child.selected){
                                child.selected = false;
                            }
                        }
                    }
                }
            });
        },
        methods: {
            orgClickHandle(org){
                org.selected = !org.selected;
                this.buxianChecked = false;
                let selectedList = [];
                for(const org of this.orgDataCpd){
                    if(org.child && org.child.length){
                        for(const child of org.child){
                            if(child.selected){
                                selectedList.push(child);
                            }
                        }
                    }else if(org.selected){
                        selectedList.push(org);
                    }
                }
                if(selectedList.length){
                    this.$emit('getSelectedOrg', {
                        selectedList
                    });
                }
            },
            orgExpand(org){
                if(org.orgCode != 1){
                    this.orgClickHandle(org);
                }else{
                    org.expand = !org.expand;
                }
            },
            checkBuxian(){
                this.buxianChecked = !this.buxianChecked;
                for(const org of this.orgDataCpd){
                    org.expand = false;
                    if(org.child && org.child.length){
                        for(const child of org.child){
                            if(child.selected){
                                child.selected = false;
                            }
                        }
                    }else{
                        org.selected = false;
                    }
                }
            },
            getOrgAvatar(orgCode){
                let ret = '';
                if(orgCode == 0){
                    ret = 'av-jituan';
                }else if(orgCode == 1){
                    ret = 'av-kuang';
                }else if(orgCode == 2){
                    ret = 'av-dangwei';
                }else if(orgCode == 3){
                    ret = 'av-zhibu';
                }
                return ret;
            },
            ...mapActions([
                'findOrgByAcc'
            ])
        },
        watch: {
            orgData(){
                this.orgDataSave = this.orgData;
            }
        },
    }
</script>
<style lang="less" scoped>
    .org-selector-wrapper /deep/ .ivu-collapse {
        margin: 0 -10px;
        background-color: #fff;
        border: 0;
        border-radius: 0;
        .ivu-collapse-item {
            border: 0;
            .ivu-collapse-header {
                border: 0;
                height: 67px;
                line-height: initial;
                padding: 0px;
            }
        }
        .ivu-collapse-content {
            padding: 0 10px;
            .ivu-collapse-content-box {
                padding: 0;
            }
        }
    }
    .org-selector-wrapper {
        position: relative;
        .org-item {
            display: flex;
            align-items: center;
            position: relative;
            padding: 10px;
            cursor: pointer;
            &:hover {
                background-color: #fafafa;
            }
            .info {
                flex: 1;
                display: flex;
                align-items: center;
                font-size: 16px;
                color: #333;
                .avatar {
                    width: 46px;
                    height: 46px;
                    margin-right: 18px;
                    border-radius: 50%;
                    &.av-kuang {
                        background: url('~@/images/gl_icon_dzz_kuang.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.av-dangwei {
                        background: url('~@/images/gl_icon_dzz_dang.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.av-zhibu {
                        background: url('~@/images/gl_icon_dzz_zhi.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.av-jituan {
                        background: url('~@/images/gl_icon_dzz_jt.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.av-buxian {
                        background: url('~@/images/gl_icon_dzz_bx.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
            .arrow-wrap {
                flex: 0 0 16px;
                font-size: 16px;
                transition: all .2s;
                &.expand {
                    transform: rotate(90deg);
                }
            }
            .selected-tag {
                position: absolute;
                left: 0;
                top: 0;
                width: 13px;
                height: 13px;
                background: url('~@/images/gz_icon_yh_set.png') no-repeat;
                background-size: 100% 100%;
            }
        }
    }
</style>