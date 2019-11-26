<template>
  <div class="test">
    <draggbale v-model="fileArray" :options="{'group': 'name', 'animation': 200, 'draggable': '.image-wrap', 'chosenClass': 'chosenClass', 'dragClass': 'dragClass', 'ghostClass': 'ghostClass', 'fallbackClass': 'fallbackClass'}" class="image-wrapper">
      <div v-for="(file, index) in fileArray" :key="index" class="image-wrap">
        <el-image :src="file.url" class="my-image" lazy :class="{'is-success': file.status === 'success'}"></el-image>
        <div class="delete-btn">
          <img src="../../assets/icon_delete@2x.png" alt="" @click="handleDelete(file)">
        </div>
        <div class="error-bg" v-show="file.status === 'error'" :class="{'is-error': file.status === 'error'}">
          <img src="../../assets/icon_fail@2x.png" alt="">
          <p>上传失败</p>
        </div>
        <div class="uploading-bg" v-show="file.status === 'uploading'" :class="{'is-uploading': file.status === 'uploading'}"> 
          <img src="../../assets/icon_loading@2x.png" alt="">
          <p>正在上传...</p>
        </div>  
      </div>
      <el-upload
        slot="footer"
        ref="upload"
        :file-list="fileArray"
        multiple
        action="/party/file/upload"
        :show-file-list="false"
        list-type="picture-card"
        :headers="{'userid': getLoginUserInfo.account}"
        :before-upload="handleBeforeUpload"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :on-change="handleChange"
        accept="image/png,image/jpeg"
        class="upload-wrapper">
        <div slot="default" class="my-upload">
          <img src="../../assets/icon_upload@2x.png" alt="">
          <p>点击上传</p>
          <p>推荐尺寸为600px*300px</p>
          <p>支持jpg.png格式</p>
          <p>不超过20张图片</p>
        </div>
      </el-upload>  
    </draggbale>
    
    <el-button @click="handlePreview" size="small">预览</el-button>

    <div class="el-image-viewer__wrapper" style="z-index: 2000" v-if="viewerShow">
      <div class="el-image-viewer__mask"></div>
      <span class="el-image-viewer__btn el-image-viewer__close" style="color: #fff;background-color: #606266;font-size: 24px" @click="handleClose">
        <i class="el-icon-close"></i>
      </span>
      <span class="el-image-viewer__btn el-image-viewer__prev" @click="handlePrev">
        <i class="el-icon-arrow-left"></i>
      </span>
      <span class="el-image-viewer__btn el-image-viewer__next" @click="handleNext">
        <i class="el-icon-arrow-right"></i>
      </span>
      <div class="el-image-viewer__canvas">
        <img :src="fileArray[index].url" alt="" class="viewer-img">
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import draggbale from "vuedraggable"
// import $ from "jquery"
// require("webpack-jquery-ui")
// require("webpack-jquery-ui/css")
export default {
  components: {
    draggbale
  },
  data() {
    return {
      fileArray: [],
      index: 0,
      viewerShow: false,
    }
  },
  mounted() {
    let _this = this;
    document.onkeydown = function(e) {
      let code = e.keyCode;
      switch(code) {
        case 37:
        case 38:
          _this.handlePrev();
          break;
        case 39:
        case 40:
          _this.handleNext();
          break
        default:
          break;
      }
    }
  },
  methods: {
    handleBeforeUpload(file) {
      file.status = 'uploading'
    },
    handleProgress(e, file, fileList) {
      file.status = 'uploading'
    },
    handleSuccess(res, file, fileList) {
      file.status = 'success';
    },
    handleChange(file, fileList) {
      if(file.url && !file.isPush) {
        file.isPush = true;
        this.fileArray.push(file)
      }
    },
    handleDelete(file) {
      if(file.status === 'uploading') {
        this.$refs.upload.abort(file);
        // this.$refs.upload.uploadFiles.pop();   
      } else {
        
      }
      this.fileArray.forEach((item, index) => {
        if(item.uid === file.uid) {
          this.fileArray.splice(index, 1)
        }
      })
    },
    handlePreview() {
      console.log(this.fileArray);
      this.viewerShow = true;
    },
    handleNext() {
      if(this.index + 1 === this.fileArray.length) {
        this.index = 0;
      } else {
        this.index++;
      }
    },
    handlePrev() {
      if(this.index === 0) {
        this.index = this.fileArray.length - 1;
      } else {
        this.index--;
      }
    },
    handleClose() {
      this.viewerShow = false;
      this.index = 0;
    }
  },
  computed: {
    ...mapGetters([
        'getLoginUserInfo'
    ])
  }
}
</script>

<style lang="less" scoped>
.test {
  width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 20px;
}
.image-wrapper {
  display: flex;
  flex-wrap: wrap;
  .image-wrap {
    position: relative;
    width: 160px;
    height: 140px;
    margin: 0 30px 20px 0;
    .my-image {
      width: 160px;
      height: 140px;
      border: 1px solid #c0ccda;
      border-radius: 10px;
      // transition: all .5s cubic-bezier(.55,0,.1,1);
      transition: all .5s ease-in-out;
      background-color: #edeef0;
      & /deep/ img {
        object-fit: scale-down;
      }
    }
    .my-image.is-success:hover {
      border-color: #4b81fb;
    }
  }
}

.upload-wrapper {
  margin: 0 0 20px 0;
  & /deep/ .el-upload {
    width: 160px;
    height: 140px;
    background-color: #edeef0;
    border: 1px dashed #707070;
    line-height: 0;
    border-radius: 10px;
    .my-upload {
      width: 158px;
      height: 138px;
      color: #a6a9b2;
      img {
        margin: 16px 0 13px 0;
      }
      p {
        font-size: 12px;
        line-height: 14px;
      }
    }
  }
  & /deep/ .el-upload:hover {
    border-color: #4b81fb;
  }
}


.image-wrap:hover {
  .delete-btn {
    display: block;
  }
}

// .chosenClass {
//   .delete-btn {
//     display: none !important; 
//   }
// }

.dragClass {
  .delete-btn {
    display: none !important;
  }
}

.ghostClass {
  .delete-btn {
    display: none !important;
  }
}

.fallbackClass {
  .delete-btn {
    display: none !important;
  }
}
.error-bg {
  width: 100%;
  height: 100%;
  line-height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  text-align: center;
  background-color: rgba(0, 0, 0, .4);
  opacity: 0;
  transition: opacity .3s;
  border-radius: 10px;
  img {
    margin-top: 35px;
    margin-bottom: 11px;
  }
  p {
    color: #f05050;
  }
}
.error-bg.is-error {
  opacity: 1;
}

.uploading-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  text-align: center;
  background-color: rgba(0, 0, 0, .4);
  opacity: 0;
  transition: opacity .3s;
  border-radius: 10px;
  img {
    margin-top: 35px;
    margin-bottom: 11px;
    transition: color .15s linear;
    animation: rotating 2s linear infinite
  }
  p {
    color: #fff;
  }
}

.uploading-bg.is-uploading {
  opacity: 1;
}

.delete-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 2;
  display: none;
  img {
    vertical-align: top;
  }
  img:hover {
    cursor: pointer;
  }
}

.viewer-img {
    transform: scale(1) rotate(0deg);
    margin-left: 0px;
    margin-top: 0px;
    max-height: 100%;
    max-width: 100%;
}
</style>