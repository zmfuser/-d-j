<template>
  <div class="banner-wrapper">
    <div class="scroll-container">
      <Slider :height="'480px'" :interval="3000" :indicators="false" @change="changePage">
        <SliderItem v-for="(i, index) in list" :key="index" :style="i" @click="gotoDetail(i)">
          <p class="image">
            <img :src="i.url" style="max-height: 480px;margin: 0 auto;vertical-align: middle" />
          </p>
          <div class="summary">
            <span>{{ i.title }}</span>
          </div>
        </SliderItem>
      </Slider>
      <div class="banner-pages">
        <div>
          <span class="current">{{ currentBannerIndex }}</span>/
          <span class="total">{{ list.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { Slider, SliderItem } from "vue-easy-slider";
export default {
  props: {
    actionUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      list: [],
      currentBannerIndex: 1
    };
  },
  components: {
    Slider,
    SliderItem
  },
  watch: {
    getLoginUserInfo: {
      handler(val) {
        this.getBannerData()
          .then(res => {
            if (res.success) {
              this.list = res.data.map(item => {
                // item.width = '100%';
                // item.height = '360px';
                // item.background = `url(${item.url}) no-repeat`;
                // item.backgroundSize = '100% 100%';
                return item;
              });
            }
          })
          .catch(error => {
            console.log("error: ", error);
          });
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["getLoginUserInfo"])
  },
  mounted() {
    this.getBannerData()
          .then(res => {
            if (res.success) {
              this.list = res.data.map(item => {
                // item.width = '100%';
                // item.height = '360px';
                // item.background = `url(${item.url}) no-repeat`;
                // item.backgroundSize = '100% 100%';
                return item;
              });
            }
          })
          .catch(error => {
            console.log("error: ", error);
          });
  },
  methods: {
    gotoDetail(banner) {
      this.$router.push({
        name: "details",
        query: { id: banner.id, from: "index" }
      });
    },
    changePage(index) {
      this.currentBannerIndex = index + 1;
    },
    ...mapActions(["getBannerData"])
  }
};
</script>
<style lang="less" scoped>
.banner-wrapper {
  // padding: 0 20px;
  // padding-bottom: 77px;
  background-color: #fff;
  overflow: hidden;
  .scroll-container {
    position: relative;
    height: 480px;
    // border-radius: 6px;
    margin: 0 auto;
    background: #d11528;
    .image {
      line-height: 480px;
      height: 480px;
    }
    .summary {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 30px 245px 31px 115px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-radius: 0px 0px 6px 6px;
      background-color: rgba(0, 0, 0, 0.3);
      font-size: 26px;
      color: #ffffff;
      display: flex;
    }
    .banner-pages {
      position: absolute;
      bottom: 30px;
      left: 38px;
      font-size: 22px;
      color: #ffffff;
      z-index: 99;
      .current {
        font-size: 32px;
        color: #d11528;
      }
    }
  }
}
</style>
<style lang="less">
.banner-wrapper {
  .slider {
    .slider-btn-left {
      left: 40px;
      background: none;
    }
    .slider-btn-right {
      right: 40px;
      background: none;
    }
    .slider-icon {
      width: 22px;
      height: 22px;
      border-left: 4px solid #fff;
      border-bottom: 4px solid #fff;
      border-radius: 4px;
    }
    .slider-item {
      border-radius: 6px;
      margin: 0 auto;
      text-align: center;
      // vertical-align: middle;
      // line-height: 480px;
      // height: 480px;
    }
  }
}
</style>

