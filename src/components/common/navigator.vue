<template>
  <div class="inline-navigator-wrapper">
    <template v-for="(item, i) of navigatorDataas">
      <div class="navi-item" :key="i" v-if="!item.isHide">
        <div class="navi-title" :class="isSelected(item)" @click="changePage(item)">
          <p class="title-text">{{ item.title }}</p>
        </div>
        <transition name="fade">
          <div
            class="sub-navi-wrap"
            v-show="item.showChildren && item.children.length"
            :class="`width-mode-${item.lineNum}`"
            :style="`width: ${item.width}`"
          >
            <div
              class="sub-navi-item"
              v-for="(subItem, j) of item.children"
              :key="j"
              v-show="(subItem.title !== '数据统计' || (subItem.title === '数据统计' && isJTManager) )"
            >
              <div class="sub-navi-title">
                <span
                  :class="subNaviActive(subItem)"
                  @click="changePage(subItem, true)"
                >{{ subItem.title }}</span>
              </div>
            </div>
            <!-- <div class="sub-navi-item"  v-for="(subItem, j) of item.children" :key="j" v-show="subItem.title !== '数据统计' || (subItem.title === '数据统计' && isJTManager)">
                            <div class="sub-navi-title" v-if="subItem.powerActive">
                                <span  :class="subNaviActive(subItem)" @click="changePage(subItem, true)">{{ subItem.title }}</span>
                            </div>
            </div>-->
          </div>
        </transition>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import util from "@/tools/util";
export default {
  data() {
    return {
      // 测试数据
      powerlist: {
        public: true,
        change: true
      },
      navigatorDataas: [
        {
          title: "首页",
          href: "home",
          width: "0",
          children: [],
          lineNum: 0,
          selected: true,
          showChildren: false,
          isHide: false
        },
        {
          title: "党建信息",
          href: "partyInfo",
          width: "189px",
          children: [
            {
              title: "经验交流",
              href: "partyInfo",
              isActive: false,
              prop: { type: "experience" }
            },
            {
              title: "党内培训",
              href: "partyInfo",
              isActive: false,
              prop: { type: "train" }
            },
            {
              title: "民主管理",
              href: "partyInfo",
              isActive: false,
              prop: { type: "democratic" }
            }
          ],
          lineNum: 2,
          selected: false,
          showChildren: false,
          isHide: false
        },
        {
          title: "组织架构",
          href: "organization",
          width: "0",
          children: [],
          lineNum: 0,
          selected: false,
          showChildren: false,
          isHide: false
        },
        {
          title: "我的组织",
          href: "myOrganization",
          width: "272px",
          prop: { type: "life" },
          children: [
            {
              title: "组织生活",
              href: "myOrganization",
              isActive: false,
              prop: { type: "life" }
            },
            {
              title: "党内活动",
              href: "myOrganization",
              isActive: false,
              prop: { type: "activity" }
            },
            {
              title: "党内关怀",
              href: "myOrganization",
              isActive: false,
              prop: { type: "care" }
            },
            {
              title: "考核管理",
              href: "myOrganization",
              isActive: false,
              prop: { type: "kaohe" }
            },
            {
              title: "党员风采",
              href: "myOrganization",
              isActive: false,
              prop: { type: "fengcai" }
            },
            {
              title: "收藏",
              href: "myOrganization",
              isActive: false,
              prop: { type: "collection" }
            }
          ],
          lineNum: 3,
          selected: false,
          showChildren: false,
          isHide: false
        },
        {
          title: "工作计划",
          href: "workPlanList",
          width: "0",
          children: [],
          lineNum: 0,
          selected: false,
          showChildren: false,
          isHide: false
        },
        {
          title: "管理中心",
          href: "manageCenter",
          width: "272px",
          children: [
            {
              title: "信息发布",
              href: "informationPublish",
              isActive: false,
              powerActive: false
            },
            {
              title: "上传计划",
              href: "workPlanUpload",
              isActive: false,
              powerActive: true
            },
            {
              title: "我的上传",
              href: "myUpload",
              isActive: false,
              powerActive: true
            },
            {
              title: "审核资料",
              href: "examineDataList",
              isActive: false,
              powerActive: true
            },
            // {
            //     title: '工作计划',
            //     href: 'workPlanList',
            //     isActive: false,
            // },
            {
              title: "草稿箱",
              href: "draftBox",
              isActive: false,
              powerActive: true
            },
            {
              title: "数据统计",
              href: "statistics",
              isActive: false,
              powerActive: true
            }
          ],
          lineNum: 3,
          selected: false,
          showChildren: false,
          isHide: false
        } /* , {
                        title: '视频直播',
                        href: 'liveVideo',
                        children: [
                            {
                                title: '历史视频',
                                href: 'liveVideo'
                            }
                        ],
                        lineNum: 2,
                        selected: false,
                        showChildren: false
                    } */,
        {
          title: "管理员设置",
          href: "managerSetting",
          width: "0",
          children: [],
          lineNum: 0,
          selected: false,
          showChildren: false,
          isHide: false
        }
      ],
      powerCodesList: [],
      once: 0
    };
  },
  created() {
    // if(!this.isJTManager) {
    //     this.navigatorDataas[4].lineNum = 3;
    //     this.navigatorDataas[4].width = '272px';
    // } else {
    //     this.navigatorDataas[4].lineNum = 4;
    //     this.navigatorDataas[4].width = '355px';
    // }
  },
  computed: {
    isNormalEmp() {
      let { roleType } = this.getLoginUserInfo;

      if (roleType == "0") {
        return true;
      } else {
        return false;
      }
    },
    isJTManager() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType == "1") {
        return true;
      } else {
        return false;
      }
    },
    isDWManager() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType == "2") {
        return true;
      } else {
        return false;
      }
    },
    isZBManager() {
      let { roleType } = this.getLoginUserInfo;
      if (roleType == "3") {
        return true;
      } else {
        return false;
      }
    },

    ...mapGetters(["getCurrentNavi", "getCurrentSubNavi", "getLoginUserInfo"])
  },
  mounted() {
    this.splitGetuserinfo();
    this.$nextTick(() => {
      if (this.isNormalEmp) {
        for (const menu of this.navigatorDataas) {
          if (menu.title == "管理中心" || menu.title == "管理员设置") {
            menu.isHide = true;
          }
        }
        console.log(this.navigatorDataas);
      }

      if (this.isZBManager) {
        for (const menu of this.navigatorDataas) {
          if (menu.title == "管理员设置") {
            menu.isHide = true;
            break;
          }
        }
      }
      if (this.isDWManager) {
        for (const menu of this.navigatorDataas) {
          if (menu.title == "管理员设置") {
            menu.isHide = true;
            break;
          }
        }
      }
    });
  },
  methods: {
    splitGetuserinfo() {
      let { powerCodes } = this.getLoginUserInfo;
      if (powerCodes) {
        this.powerCodesList = powerCodes.split(",");
        var result = this.powerCodesList.includes("info");
        if (!result) {
          for (const menu of this.navigatorDataas) {
            if (menu.title == "管理中心") {
              menu.children.forEach(function(item, index) {
                if (item.title == "信息发布") {
                  menu.children.splice(index, 2);
                }
              });
            }
          }
        }
      }
    },
    changePage(menu, isSubMenu = false) {
      if (!isSubMenu) {
        for (const item of this.navigatorDataas) {
          item.showChildren = false;
        }
        if (menu.children && menu.children.length) {
          menu.showChildren = true;
        }
      }
      if (menu.href) {
        if (menu.href != "home") {
          this.$emit("changeHeadMode", "mode-2");
        } else {
          this.$emit("changeHeadMode", "");
        }
        if (menu.href) {
          if (isSubMenu) {
            if (!util.isEmptyObject(menu.prop)) {
              this.changeSubNaviPath(menu.prop.type);
              this.changeDataListDefaultTab({
                dataListType: menu.href,
                tabType: menu.prop.type
              });
            } else {
              this.changeSubNaviPath(menu.href);
            }
          } else {
            this.changeNaviPath(menu.href);
            if (menu.children.length && menu.title != "管理中心") {
              let firstChild = menu.children[0];
              if (!util.isEmptyObject(firstChild.prop)) {
                this.changeSubNaviPath(firstChild.prop.type);
              } else {
                this.changeSubNaviPath(firstChild.href);
              }
            } else if (!menu.children.length) {
              this.changeSubNaviPath("");
            }
          }

          if (menu.prop && menu.prop.type) {
            this.$router.push({
              path: menu.href,
              query: { type: menu.prop.type }
            });
          } else {
            this.$router.push(menu.href);
          }
        }
      }
    },
    isSelected(menu) {
      let isChildNode = false;
      for (const child of menu.children) {
        if (child.href == this.getCurrentNavi) {
          isChildNode = true;
          break;
        }
      }
      if (menu.href != this.getCurrentNavi && !isChildNode) {
        menu.showChildren = false;
        return "";
      } else if (menu.href == this.getCurrentNavi || isChildNode) {
        menu.showChildren = true;
        return "selected";
      } else {
        menu.showChildren = false;
        return "";
      }
    },
    subNaviActive(menu) {
      let ret = "";
      if (this.getCurrentSubNavi == menu.href) {
        ret = "active";
      } else if (!util.isEmptyObject(menu.prop)) {
        if (this.getCurrentSubNavi == menu.prop.type) {
          ret = "active";
        }
      }
      return ret;
    },
    ...mapActions([
      "changeNaviPath",
      "changeSubNaviPath",
      "changeDataListDefaultTab"
    ])
  },
  watch: {
    changeNaviPath(newValue, oldValue) {
      let data = util.deepClone(this.navigatorDataas);
      // this.navigatorDataas = [];
      this.navigatorDataas = data;
    },
    getLoginUserInfo() {
      if (this.isNormalEmp) {
        for (const menu of this.navigatorDataas) {
          if (menu.title == "管理中心" || menu.title == "管理员设置") {
            menu.isHide = true;
          }
        }
      }

      if (this.isZBManager) {
        for (const menu of this.navigatorDataas) {
          if (menu.title == "管理员设置") {
            menu.isHide = true;
            break;
          }
        }
      }
      if (this.isDWManager) {
        for (const menu of this.navigatorDataas) {
          if (menu.title == "管理员设置") {
            menu.isHide = true;
            break;
          }
        }
      }

      // if(!this.isJTManager) {
      //     this.navigatorDataas[4].lineNum = 3;
      //     this.navigatorDataas[4].width = '272px';
      // } else {
      //     this.navigatorDataas[4].lineNum = 4;
      //     this.navigatorDataas[4].width = '355px';
      // }
    },
    $route(to, from) {
      if (to.name == "manageCenter") {
        this.splitGetuserinfo();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.inline-navigator-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 134px;
  width: 1100px;
  margin: 0 auto;
  border-left: 0;
  border-right: 0;
  .navi-item {
    display: inline-flex;
    height: 100%;
    border-left: 1px solid #ccc;
    // &:last-child {
    //     .navi-title, .sub-navi-wrap {
    //         border-right: 1px solid #ccc;
    //     }
    // }
    .navi-title {
      display: inline-flex;
      align-items: center;
      padding: 0 30px;
      width: 80px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      &:hover,
      &.selected {
        // border-right: 1px solid #ccc;
        background-color: #f5f5f5;
      }

      .title-text {
        color: #000;
        letter-spacing: 2px;
        cursor: pointer;
      }
    }
    .fade-enter-active,
    .fade-leave-active {
      transition: all 0.5s;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
    .sub-navi-wrap {
      display: inline-flex;
      flex-wrap: wrap;
      padding: 30px 20px;
      overflow: hidden;
      border-left: 1px solid #ccc;
      &.width-mode-2 {
        .sub-navi-item:nth-child(even) {
          margin-right: 0;
        }
      }
      &.width-mode-3 {
        .sub-navi-item:nth-child(3n) {
          margin-right: 0;
        }
      }
      &.width-mode-4 {
        .sub-navi-item:nth-child(4n) {
          margin-right: 0;
        }
      }
      .sub-navi-item {
        margin-right: 18px;
        min-width: 65px;
        font-size: 16px;
        a,
        span {
          color: #333333;
          cursor: pointer;
          &:hover,
          &.active {
            color: #d11528;
          }
        }
      }
    }
  }
  .navi-item:last-child {
    border-right: 1px solid #ccc;
  }
}
</style>
