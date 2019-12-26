<template>
  <div class="container-back">
    <banner></banner>
    <div class="home-view-container">
      <hotNews></hotNews>

      <div class="djxw">
        <div class="djxw-title">
          <img src="../../images/home_icon_dj_title_L.png" alt />
          <span>党&nbsp;建&nbsp;信&nbsp;息</span>
          <img src="../../images/home_icon_dj_title_R.png" alt />
        </div>
        <div class="djxw-more" @click="$router.push('partyInfo')">
          <span>更多>></span>
        </div>
      </div>

      <!-- <sectionView :sectionTitle="experienceDatas.sectionTitle" :moreLink="experienceDatas.moreLink" :contentData="experienceDatas.contentData"></sectionView>
            <sectionView :sectionTitle="trainDatas.sectionTitle" :moreLink="trainDatas.moreLink" :contentData="trainDatas.contentData"></sectionView>
      <sectionView :sectionTitle="democraticDatas.sectionTitle" :moreLink="democraticDatas.moreLink" :contentData="democraticDatas.contentData"></sectionView>-->
      <div class="djxw-section">
        <div class="section-view" style="margin-right: 16px;margin-bottom: 50px;">
          <div class="section-img">
            <img src="../../images/home_icon_dj_jy.png" alt />
          </div>
          <div class="section-content">
            <div class="section-title">{{experienceDatas.sectionTitle}}</div>
            <div class="content-item" v-if="experienceDatas.contentData.length > 0">
              <p
                v-for="item in experienceDatas.contentData"
                :key="item.id"
                @click="gotoDetail(item)"
              >
                <span class="circle"></span>
                <span class="title">【{{item.channelName}}】{{item.title}}</span>
              </p>
            </div>
            <div class="section-none" v-else>
              <div>
                <img src="../../images/home_icon_zwsj.png" alt />
              </div>
              <div>暂无数据</div>
            </div>
          </div>
        </div>
        <div class="section-view" style="margin-bottom: 50px;">
          <div class="section-img">
            <img src="../../images/home_icon_dj_px.png" alt />
          </div>
          <div class="section-content">
            <div class="section-title">{{trainDatas.sectionTitle}}</div>
            <div class="content-item" v-if="trainDatas.contentData.length > 0">
              <p v-for="item in trainDatas.contentData" :key="item.id" @click="gotoDetail(item)">
                <span class="circle"></span>
                <span class="title">【{{item.channelName}}】{{item.title}}</span>
              </p>
            </div>
            <div class="section-none" v-else>
              <div>
                <img src="../../images/home_icon_zwsj.png" alt />
              </div>
              <div>暂无数据</div>
            </div>
          </div>
        </div>
        <div class="section-view" style="margin-right: 16px;">
          <div class="section-img">
            <img src="../../images/home_icon_dj_gl.png" alt />
          </div>
          <div class="section-content">
            <div class="section-title">{{democraticDatas.sectionTitle}}</div>
            <div class="content-item" v-if="democraticDatas.contentData.length > 0">
              <p
                v-for="item in democraticDatas.contentData"
                :key="item.id"
                @click="gotoDetail(item)"
              >
                <span class="circle"></span>
                <span class="title">【{{item.channelName}}】{{item.title}}</span>
              </p>
            </div>
            <div class="section-none" v-else>
              <div>
                <img src="../../images/home_icon_zwsj.png" alt />
              </div>
              <div>暂无数据</div>
            </div>
          </div>
        </div>
        <div class="section-view">
          <img src="../../images/home_img_s_banner.png" alt style="width:538px;margin-top: 20px;" />
        </div>
      </div>

      <div class="advertisement">
        <img src="../../images/home_img_s_banner1.png" alt />
      </div>
      <div class="djxw">
        <div class="djxw-title">
          <img src="../../images/home_icon_dj_title_L.png" alt />
          <span>我&nbsp;的&nbsp;组&nbsp;织</span>
          <img src="../../images/home_icon_dj_title_R.png" alt />
        </div>
        <div class="djxw-more" @click="$router.push('myOrganization')">
          <span>更多>></span>
        </div>
      </div>

      <!-- <sectionView :sectionTitle="experienceDatas.sectionTitle" :moreLink="experienceDatas.moreLink" :contentData="experienceDatas.contentData"></sectionView>
            <sectionView :sectionTitle="trainDatas.sectionTitle" :moreLink="trainDatas.moreLink" :contentData="trainDatas.contentData"></sectionView>
      <sectionView :sectionTitle="democraticDatas.sectionTitle" :moreLink="democraticDatas.moreLink" :contentData="democraticDatas.contentData"></sectionView>-->
      <div class="djxw-section">
        <div class="section-view" style="margin-right: 16px;margin-bottom: 50px;">
          <div class="section-img">
            <img src="../../images/home_icon_dj_jy.png" alt />
          </div>
          <div class="section-content">
            <div class="section-title">组织生活</div>
            <div class="content-item" v-if="orgLive.length > 0">
              <p v-for="item in orgLive" :key="item.id" @click="gotoOrgDetail(item)">
                <span class="circle"></span>
                <span class="title">【{{item.channelName}}】{{item.title}}</span>
              </p>
            </div>
            <div class="section-none" v-else>
              <div>
                <img src="../../images/home_icon_zwsj.png" alt />
              </div>
              <div>暂无数据</div>
            </div>
          </div>
        </div>
        <div class="section-view" style="margin-bottom: 50px;">
          <div class="section-img">
            <img src="../../images/home_icon_dj_px.png" alt />
          </div>
          <div class="section-content">
            <div class="section-title">党内活动</div>
            <div class="content-item" v-if="dangActive.length > 0">
              <p v-for="item in dangActive" :key="item.id" @click="gotoOrgDetail(item)">
                <span class="circle"></span>
                <span class="title">【{{item.channelName}}】{{item.title}}</span>
              </p>
            </div>
            <div class="section-none" v-else>
              <div>
                <img src="../../images/home_icon_zwsj.png" alt />
              </div>
              <div>暂无数据</div>
            </div>
          </div>
        </div>
        <div class="section-view" style="margin-right: 16px;">
          <div class="section-img">
            <img src="../../images/home_icon_dj_gl.png" alt />
          </div>
          <div class="section-content">
            <div class="section-title">党内关怀</div>
            <div class="content-item" v-if="dangCare.length > 0">
              <p v-for="item in dangCare" :key="item.id" @click="gotoOrgDetail(item)">
                <span class="circle"></span>
                <span class="title">【{{item.channelName}}】{{item.title}}</span>
              </p>
            </div>
            <div class="section-none" v-else>
              <div>
                <img src="../../images/home_icon_zwsj.png" alt />
              </div>
              <div>暂无数据</div>
            </div>
          </div>
        </div>
        <div class="section-view" style="margin-bottom: 50px;">
          <div class="section-img">
            <img src="../../images/home_icon_dj_gl.png" alt />
          </div>
          <div class="section-content">
            <div class="section-title">党员风采</div>
            <div class="content-item" v-if="dangElegant.length > 0">
              <p v-for="item in dangElegant" :key="item.id" @click="gotoOrgDetail(item)">
                <span class="circle"></span>
                <span class="title">【{{item.channelName}}】{{item.title}}</span>
              </p>
            </div>
            <div class="section-none" v-else>
              <div>
                <img src="../../images/home_icon_zwsj.png" alt />
              </div>
              <div>暂无数据</div>
            </div>
          </div>
        </div>
      </div>
      <div class="org-and-plan">
        <!-- <div class="org-left">
                    <div class="org">
                        <img src="../../images/home_icon_dj_title_L.png" alt="">
                        <span>我手动阀手动阀&nbsp;的&nbsp;组&nbsp;织</span>
                        <img src="../../images/home_icon_dj_title_R.png" alt="">
                    </div>
                    <div class="org-router">
                        <div class="router-item" v-for="(item, index) in allOrgRouter" :key="index" @click="orgRouteGo(item)">
                            <p></p>
                            <p>{{item.name}}</p>
                            <p></p>
                        </div>
                    </div>
        </div>-->
        <div class="plan-right">
          <div class="plan-title">
            <img src="../../images/home_img_s_gzjh.png" alt />
          </div>
          <div class="plan-router">
            <div
              class="router-item"
              v-for="(item, index) in allPlanRouter"
              :key="index"
              @click="planRouteGo(item)"
            >
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import hotNews from "./components/hotNews";
import banner from "@/components/common/banner";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      newaccount: "",
      experienceDatas: {
        sectionTitle: "经验交流",
        moreLink: "experience",
        contentData: []
      },
      trainDatas: {
        sectionTitle: "党内培训",
        moreLink: "train",
        contentData: []
      },
      democraticDatas: {
        sectionTitle: "民主管理",
        moreLink: "democratic",
        contentData: []
      },
      allOrgRouter: [
        {
          name: "组织生活",
          type: "life"
        },
        {
          name: "党内活动",
          type: "activity"
        },
        {
          name: "党内关怀",
          type: "care"
        },
        {
          name: "考核管理",
          type: "kaohe"
        },
        {
          name: "党员风采",
          type: "fengcai"
        }
      ],
      allPlanRouter: [
        {
          name: "待执行",
          curTab: "nonexecution"
        },
        {
          name: "执行中",
          curTab: "executing"
        },
        {
          name: "已执行",
          curTab: "executed"
        },
        {
          name: "未执行",
          curTab: "noexecuted"
        }
      ],
      filterFormInfo: {
        startTime: "",
        endTime: "",
        channelCode: 0,
        accounts: []
      },
      orgLive: {},
      dangActive: {},
      dangCare: {},
      dangElegant: {}
    };
  },
  components: {
    hotNews,
    banner
  },
  computed: {
    ...mapGetters(["getLoginUserInfo"])
  },
  watch: {
    getLoginUserInfo: {
      handler(val) {
        this.getListData(1030);
        // 组织生活
        this.getListData(1020);
        // 党内关怀
        this.getListData(1060);
        // 党员风采
        this.getListData(1050);

        this.getPartyInfoDatas()
        .then(res => {
          if (res.success) {
            this.translateData(res.data);
          }
        })
        .catch(error => {});
      },
      deep: true
    },
  },

  mounted() {
    this.getListData(1030);
        // 组织生活
        this.getListData(1020);
        // 党内关怀
        this.getListData(1060);
        // 党员风采
        this.getListData(1050);

        this.getPartyInfoDatas()
        .then(res => {
          if (res.success) {
            this.translateData(res.data);
          }
        })
        .catch(error => {});
    // this.testForFace();
  },
  methods: {
    // 获取组织信息
    getListData(channelCode) {
      let _this = this;
      this.$Spin.show();

      let params = {
        account: "",
        channelCode: channelCode,
        currentPage: 1,
        filter: {
          accounts: [],
          channelCode: 0,
          endTime: "",
          startTime: ""
        },
        pageSize: 4
      };
      params.account = this.getLoginUserInfo.account;
      this.$store
        .dispatch("getMyOrgListByType", params)
        .then(res => {
          if (res.success) {
            switch (channelCode) {
              case 1020:
                // _this.$set()
                this.$set(_this, "orgLive", res.data.rows.slice(0, 4));
                _this.$nextTick(function() {
                  console.log(1, _this.orgLive);
                });
                break;
              case 1030:
                this.$set(_this, "dangActive", res.data.rows.slice(0, 4));
                _this.$nextTick(function() {
                  console.log(2, _this.dangActive);
                });
                break;
              case 1050:
                this.$set(_this, "dangElegant", res.data.rows.slice(0, 4));

                _this.$nextTick(function() {});
                break;
              case 1060:
                this.$set(_this, "dangCare", res.data.rows.slice(0, 4));
                _this.$nextTick(function() {});
                break;

              default:
                break;
            }
          }

          this.$Spin.hide();
        })
        .catch(error => {
          console.log("error: ", error);
        });

      this.$Spin.hide();
    },
    testForFace() {
      axios({
        url: "/gatewayApi/aiplatform/auth",
        method: "post",
        data: {
          username: "fangke",
          password: "qweasd@1"
        },
        headers: {
          "Content-Type": "application/json"
          // "Access-Control-Allow-Origin": "*"
        }
      }).then(res => {});
    },
    translateData(data) {
      this.experienceDatas.contentData = [];
      this.trainDatas.contentData = [];
      this.democraticDatas.contentData = [];
      if (data.length) {
        for (const item of data) {
          if (item.upperCode == 20) {
            this.experienceDatas.contentData = item.upperList;
          } else if (item.upperCode == 30) {
            this.trainDatas.contentData = item.upperList;
          } else {
            this.democraticDatas.contentData = item.upperList;
          }
        }
      }
    },
    orgRouteGo(item) {
      this.$router.push({ path: "myOrganization", query: { type: item.type } });
    },
    planRouteGo(item) {
      this.changeNaviPath("workPlanList");
      // this.changeNaviPath('manageCenter');
      // this.changeSubNaviPath('workPlanList');
      this.$router.push({
        name: "workPlanList",
        query: { curTab: item.curTab }
      });
    },
    gotoDetail(item) {
      this.changeNaviPath("partyInfo");
      this.$router.push({
        name: "details",
        query: { id: item.id, from: "index" }
      });
    },
    gotoOrgDetail(item) {
      this.changeNaviPath("myOrganization");
      this.$router.push({
        name: "details",
        query: { id: item.id, from: "index" }
      });
    },
    ...mapActions([
      "getPartyInfoDatas",
      "changeNaviPath",
      "changeSubNaviPath",
      "postAuth"
    ])
  }
};
</script>
<style lang="less" scoped>
.container-back {
  background-color: #f7f7f7;
  overflow: hidden;
  .home-view-container {
    width: 1100px;
    margin: 0 auto 80px;
  }
}
.djxw {
  position: relative;
  .djxw-title {
    display: flex;
    height: 136px;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    span {
      margin: 0 21px;
      color: #333333;
    }
  }
  .djxw-more {
    position: absolute;
    top: 48px;
    right: 3px;
    font-size: 20px;
    color: #333333;
  }
  .djxw-more {
    cursor: pointer;
  }
}
.djxw-section {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 30px;
  .section-view {
    display: flex;
    width: 542px;
    height: 297px;
    .section-content {
      margin-left: 20px;
      width: 447px;
      .section-title {
        margin-top: 9px;
        margin-bottom: 26px;
        margin-left: 20px;
        font-size: 22px;
        color: #333333;
      }
      .content-item {
        p {
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          .circle {
            margin-left: 20px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #cccccc;
          }
          .title {
            width: 378px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 24px;
            height: 22px;
            line-height: 22px;
            font-size: 16px;
            color: #333333;
          }
        }
        p:hover {
          background: #ebebeb;
          cursor: pointer;
          .title {
            color: #d11528;
          }
        }
      }
      .section-none {
        display: flex;
        height: 240px;
        width: 538px;
        margin-left: -94px;
        line-height: 120px;
        flex-direction: column;
        align-items: center;
        // text-align: center;
        vertical-align: middle;
        div:last-child {
          // align-self: flex-start
          margin-top: -40px;
          font-size: 16px;
          color: #999;
        }
      }
    }
  }
}

.org-and-plan {
  width: 100%;
  display: flex;
  .org {
    width: 585px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    span {
      margin: 0 21px;
    }
  }
  .org-router {
    display: flex;
    justify-content: space-between;
    .router-item {
      width: 101px;
      height: 360px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f0ebe6;
      padding: 45px 0;
      p {
        width: 30px;
        font-size: 26px;
        line-height: 39.5px;
        margin: 45px 0;
      }
      p:first-child,
      p:last-child {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #fff;
        margin: 0;
      }
    }
    .router-item:hover {
      background: #ea3447;
      color: #fff;
      cursor: pointer;
    }
  }
  .plan-right {
    display: flex;

    width: 100%;
    // margin-left: 72px;
    .plan-title {
      width: 40%;
      // margin-top: 50px;
      // margin-bottom: 20px;
    }
    .plan-router {
      display: flex;
      width: 60%;
      // flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      // height: 288px;
      .router-item {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        height: 80%;
        width: 20%;
        background: #fff;
        // text-align: center;
        span {
          line-height: 63px;
          vertical-align: middle;
          color: #333;
          font-size: 22px;
        }
      }
      .router-item:hover {
        background: #ea3447;
        cursor: pointer;
        span {
          color: #fff;
        }
      }
    }
  }
}
</style>
<style lang="less">
.home-view-container {
  .section-view-wrapper {
    &:last-child {
      .section-container {
        padding-bottom: 20px;
      }
    }
  }
}
</style>
