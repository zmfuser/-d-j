<template>
    <div class="customer-header-wrapper">
        <div :class="`background-wrapper ${getHeaderMode}`">
            <div class="bgc-wrapper">
                <div style="display: inline-flex;flex: 0 0 60%;">
                    <div class="logo"></div>
                    <div class="title-wrap">
                        <p class="main-title">{{ mainTitle }}</p>
                        <!-- <p class="sub-title">{{ subTitle }}</p> -->
                    </div>
                </div>
                <div class="search-wrap">
                    <input type="text" v-model="keyword" @keyup="gotoSearchResult">
                    <div class="suffix-icon" @click="gotoSearchResult"></div>
                </div>
            </div>
            <div class="user-info">
                <div class="org-info">
                    <div class="user-org">{{orgName}}</div>
                    <div class="user-type">{{userType}}</div>
                </div>
                <Button class="user-name" shape="circle">{{userName}}</Button>
            </div>
        </div>
        <div class="navigator-wrapper">
            <cusNavigator @changeHeadMode="changeHeadMode"></cusNavigator>
        </div>
    </div>
</template>
<script>
    import cusNavigator from '@/components/common/navigator'
    import {mapGetters, mapActions} from 'vuex'
    export default {
        data(){
            return {
                mainTitle: '盘江股份党建信息管理系统',
                subTitle: 'A company party building information management system',

                headerMode: '',
                keyword: '',
                // orgName: '',
                // userName: '',
                // userType: ''
            }
        },
        computed: {
            ...mapGetters([
                'getHeaderMode',
                'getLoginUserInfo'
            ]),
            userType() {
                console.log(this.getLoginUserInfo);
                let {roleType, oName} = this.getLoginUserInfo;
                console.log("roleType是",roleType)
                switch(roleType) {
                    case '0':
                        return '普通用户';
                        break;
                    case '1': 
                        return '机关管理员';
                        break;
                    case '2':
                        return oName + ' - 党委管理员';
                        break;
                    case '3':
                        return oName + ' - 支部管理员';
                        break;
                    case '4':
                        return '系统管理员';
                        break;
                    default: 
                        return '';
                }
            },
            orgName() {
                let info = this.getLoginUserInfo;

                return info.orgname;
            },
            userName() {
                let info = this.getLoginUserInfo;

                return info.name;
            }
        },
        created() {
            console.log("deng",this.getLoginUserInfo)
        },
        components: {
            cusNavigator
        },
        methods: {
            changeHeadMode(mode){
                this.changeHeaderMode(mode);
            },
            gotoSearchResult(e){
                if((e.type === 'keyup' && e.key === 'Enter') || e.type === 'click'){
                    let {name} = this.$route;
                    if(name == 'searchResult'){
                        $eventBus.$emit('seachAction', {
                            keyword: this.keyword
                        })
                    }else{
                        this.$router.push({ name: 'searchResult', query: { keyword: this.keyword }});
                    }
                }
            },
            ...mapActions([
                'changeHeaderMode'
            ])
        },
    }
</script>
<style lang="less" scoped>
    .customer-header-wrapper {
        .background-wrapper {
            display: flex;
            align-items: center;
            padding: 38px 0;
            background-color: #d11528;
            color: #fff;
            transition: all 1s;
            &.mode-2 {
                padding: 24px 0;
                .bgc-wrapper {
                    width: 900px;
                    .logo {
                        height: 43px;
                        flex: 0 0 42px;
                        margin-right: 24px;
                    }
                    .title-wrap {
                        display: flex;
                        align-items: center;
                        .main-title {
                            font-size: 20px;
                            letter-spacing: 9px;
                            // margin-bottom: 9px;
                        }
                        .sub-title {
                            font-size: 10px;
                        }
                    }
                }
            }
            .bgc-wrapper {
                width: 800px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 1s;
                .logo {
                    transition: all 1s;
                    flex: 0 0 56px;
                    height: 54px;
                    margin-right: 31px;
                    background: url('~@/images/nav_icon_logo.png') no-repeat;
                    background-size: 100% 100%;

                }
                .title-wrap {
                    transition: all 1s;
                    // margin-right: 106px;
                    display: flex;
                    align-items: center;
                    .main-title {
                        transition: all 1s;
                        // margin-bottom: 11px;
                        letter-spacing: 16px;
                        font-size: 26px;
                        font-weight: bold;
                        white-space: nowrap;
                    }
                    .sub-title {
                        transition: all 1s;
                        font-size: 14px;
                    }
                }
                .search-wrap {
                    flex: 0 0 201px;
                    display: inline-flex;
                    height: 39px;
                    padding: 9px 12px;
                    border-radius: 2px;
                    border: 1px solid #e6e6e6;
                    input {
                        flex: 1;
                        height: 100%;
                        background-color: transparent;
                    }
                    .suffix-icon {
                        width: 20px;
                        height: 20px;
                        background: url('~@/images/search.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
            .user-info {
                display: flex;
                flex-direction: row;
                align-items: center;
                font-size: 16px;
                margin-right: 50px;
                .org-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .user-name {
                    margin-left: 25px;
                    border: 1px solid #ff6171;
                    background: transparent;
                    font-size: 16px;
                    color: #fff;
                }
            }
        }
        .navigator-wrapper {
            overflow: hidden;
            background-color: #fff;
            // border-top: 1px solid #cccccc;
            border-bottom: 1px solid #cccccc;
        }
    }
</style>
<style lang="less">
    .customer-header-wrapper {
        .search-wrap {
            .ivu-input-wrapper {
                height: 100%;
                .ivu-icon-ios-search {
                    line-height: 2.72rem;
                    color: #fff;
                }
                .ivu-input {
                    height: 100%;
                    line-height: 2.72rem;
                    border-radius: 2px;
                    background-color: transparent;
                    color: #fff;
                    &:hover {
                        border-color: #fff;
                    }
                }
            }
        }
    }
</style>
