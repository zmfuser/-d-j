<template>
  <div id="app">
    <div class="layout">
        <Layout>
            <Header>
                <cusHeader></cusHeader>
            </Header>
            <Content>
                <router-view/>
            </Content>
            <Footer>
                <cusFooter></cusFooter>
            </Footer>
        </Layout>
    </div>
    <Spin size="large" fix v-if="getSpinStatus"></Spin>
  </div>
</template>

<script>
    import cusHeader from '@/components/common/header'
    import cusFooter from '@/components/common/footer'
    import {mapGetters, mapActions} from 'vuex'
    import util from '@/tools/util'
    export default {
        computed: {
            ...mapGetters([
                'getSpinStatus',
                'getLoginUserInfo'
            ])
        },
        components: {
            cusHeader,
            cusFooter
        },
        created(){
            if(sessionStorage.getItem("store")){
                this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))));
                this.initData();
            }else{
                this.initData();
            }
            window.addEventListener("beforeunload", () => {
                sessionStorage.setItem("store", JSON.stringify(this.$store.state));
            });

            $eventBus.$on('refreshHomeData', () => {
                console.log('init');
                this.initData()
            })
        },
        mounted(){
            
        },
        methods: {
            initData(){
                if(process.env.NODE_ENV === 'production'){
                    console.log('loginUserInfo is Empty: ', util.isEmptyObject(this.getLoginUserInfo));
                    if(util.isEmptyObject(this.getLoginUserInfo)){
                        this.getLoginUserData().then(ret => {
                            console.log('loginUserData: ', ret);
                            if(ret.success){
                                $axios.defaults.headers.userid = this.getLoginUserInfo.account;
                                this.getIsManager().then(res => {
                                    console.log('loginUser is manager: ', res.data.isManager);
                                });
                            }else{
                                this.$Modal.error({
                                    title: '提示',
                                    content: ret.message
                                })
                            }
                        });
                    }else{
                        $axios.defaults.headers.userid = this.getLoginUserInfo.account;
                        this.getIsManager().then(res => {
                            console.log('loginUser is manager: ', res.data.isManager);
                        });
                    }
                }else{
                    // let account = '15123456789'; // 系统管理员
                    let account = '18682359561'; // 集团管理员
                    // let account = '13860415269'; // 党委管理员  // 姚琛
                    // let account = '13984488960'; // 支部管理员
                    // let account = '13113114478'; // 普通用户
                    // let account = '15623456789'; // 支部管理员
                    // let account = '15985626498'; // 
                    // let account = '15800000010';
                    // let account = '17796351087';

                    // let account = '13242964696';

                    // let account = '16602710428';

                    // let account = '13885816133';

                    
                    let params = {account};
                    $axios.defaults.headers.userid = account;
                    if(util.isEmptyObject(this.getLoginUserInfo)){
                        this.getUserInfoByAccount(params).then(res => {
                            if(res.success){
                                console.log(res);
                                this.setLoginUserInfoForLocal(res.data);
                                this.getIsManager().then(res => {
                                    console.log('loginUser is manager: ', res.data.isManager);
                                });
                            }
                        });
                    }
                }
            },
            ...mapActions([
                'getLoginUserData',
                'getIsManager',
                'getUserInfoByAccount',
                'setLoginUserInfoForLocal'
            ])
        },
        watch: {
            getLoginUserInfo() {
                this.initData();
            }
        },
    }
</script>


<style lang="less">
#app {
    height: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    .layout {
        height: 100%;
    }
}

</style>
