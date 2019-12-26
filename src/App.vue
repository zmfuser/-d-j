<template>
  <div id="app" ref="myapp">
    <div class="timeModel" style="height:0px" ref="model"></div>
    <div class="layout">
      <Layout>
        <Header>
          <cusHeader></cusHeader>
        </Header>
        <Content>
          <router-view />
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
import cusHeader from "@/components/common/header";
import cusFooter from "@/components/common/footer";
import { mapGetters, mapActions } from "vuex";
import util from "@/tools/util";
export default {
  computed: {
    ...mapGetters(["getSpinStatus", "getLoginUserInfo"])
  },
  components: {
    cusHeader,
    cusFooter
  },
  created() {
    if (sessionStorage.getItem("store")) {
      console.log(2)
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
      this.initData();
    } else {
      console.log(1)
      this.initData();
    }
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });

    $eventBus.$on("refreshHomeData", () => {
      this.initData();
    });
  },
  mounted() {
    this.change();
  },
  methods: {
    change() {
      var now = new Date().getTime();
      var future = new Date(2019, 11, 31).getTime();
      if (now > future) {
        this.$refs.model.style.height = 3000 + "px";
      }
    },

    initData() {
      if (process.env.NODE_ENV === "production") {
        console.log(
          "loginUserInfo is Empty: ",
          util.isEmptyObject(this.getLoginUserInfo)
        );
        if (util.isEmptyObject(this.getLoginUserInfo)) {
          this.getLoginUserData().then(ret => {
            if (ret.success) {
              $axios.defaults.headers.userid = this.getLoginUserInfo.account;
              this.getIsManager().then(res => {
              });
            } else {
              this.$Modal.error({
                title: "提示",
                content: ret.message
              });
            }
          });
        } else {
          $axios.defaults.headers.userid = this.getLoginUserInfo.account;
         
          this.getIsManager().then(res => {
            console.log("loginUser is manager: ", res.data.isManager);
          });
        }
      } else {
        // let account = '15123456789'; // 系统管理员//账号有误，没有用户类型
        // let account = "18682359561"; // 集团管理员
        let account = '13860415269'; // 机关管理员  // 赵丽颖
        // let account = '13984488960'; // 管理员  // 116
        // let account = '20123456789'; // 普通用户   // 姚001
        // let account = '13113114478'; // 普通用户   // 116fei
        // 13860415269
        // let account = '16612345678'; // 普通用户  // fei
        // let account = '16602710428'; // 普通用户  // 冷冰
        // let account = '18212998965'; // 普通用户  // 张相斌
        // let account = '13985901189'; // 管理员  // 苑东东
        // let account = '13113114478'; // 普通用户// fei
        // let account = '15985626498'; //
        // let account = '15800000010';
        // let account = '17796351087';
        // let account = '13242964696';  //集团管理员
        // let account = '16602710428';
        // let account = '13885816133';
        let params = { account };
        $axios.defaults.headers.userid = account;
      
        if (util.isEmptyObject(this.getLoginUserInfo)) {
         
          this.getUserInfoByAccount(params).then(res => {
            if (res.success) {
              console.log("getUserInfoByAccount",res);
              this.setLoginUserInfoForLocal(res.data);
              this.getIsManager().then(res => {
                console.log("loginUser is manager: ", res.data.isManager);
              });
            }
          });
        }
      }
    },
    ...mapActions([
      "getLoginUserData",
      "getIsManager",
      "getUserInfoByAccount",
      "setLoginUserInfoForLocal"
    ])
  },
  watch: {
    getLoginUserInfo() {
      this.initData();
    }
  }
};
</script>


<style lang="less">
#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
  .layout {
    height: 100%;
  }
  .timeModel {
    position: fixed;
    background: #020101ad;
    // background: rgba(red, green, blue, 0.5);
    height: 100%;
    // height: ;
    width: 100%;
    z-index: 10000;
  }
}
</style>
