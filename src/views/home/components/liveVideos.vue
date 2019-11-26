<template>
    <div class="live-video-wrapper">
        <div class="video-container">
            <div class="title-wrap">
                <h1 class="section-title">视频直播</h1>
                <div class="more">
                    <span>更多>></span>
                </div>
            </div>
            <div class="video-list-wrap">
                <div class="video-item bigger">
                    <div class="pic-wrap"></div>
                    <p class="video-title" :title="firstVideoOfList.title">
                        <span>{{ firstVideoOfList.title }}</span>
                    </p>
                </div>
                <div class="normal-wrap">
                    <template v-for="(item, i) of videoList">
                        <div class="video-item normal"  v-if="i > 0" :key="i">
                            <div class="pic-wrap"></div>
                            <p class="video-title" :title="item.title">
                                <span>{{ item.title }}</span>
                            </p>
                        </div>
                    </template>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                videoList: []
            }
        },
        computed: {
            firstVideoOfList(){
                let ret = {};
                if(this.videoList.length){
                    ret = this.videoList[0];
                }
                return ret;
            }
        }
    }
</script>
<style lang="less" scoped>
    .live-video-wrapper {
        background-color: #fff;
        .video-container {
            width: 1100px;
            margin: 0 auto;
            padding-bottom: 70px;
            .title-wrap {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 20px;
                margin-bottom: 30px;
                .section-title {
                    position: relative;
                    padding-left: 20px;
                    color: #333333;
                    text-align: left;
                    font-size: 30px;
                    &::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 50%;
                        margin-top: -15px;
                        width: 4px;
                        height: 30px;
                        background-color: #d11528;
                    }
                }
                .more {
                    font-size: 18px;
                    color: #999999;
                }
            }
            .video-list-wrap {
                display: flex;
                flex-wrap: wrap;
                padding: 0 20px;
                .video-item {
                    position: relative;
                    margin-right: 20px;
                    &.bigger {
                        flex: 0 0 690px;
                        .pic-wrap {
                            height: 380px;
                        }
                    }
                    &.normal {
                        flex: 0 0 350px;
                        .pic-wrap {
                            height: 180px;
                        }
                    }
                    .pic-wrap {
                        background-color: cadetblue
                    }
                    .video-title {
                        position: absolute;
                        display: flex;
                        align-items: center;
                        padding: 0 10px;
                        height: 116px;
                        width: 100%;
                        background-color: rgba(0, 0, 0, .3);
                        color: #fff;
                        font-size: 28px;
                        bottom: 0;
                        span {
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            max-width: 55%;
                        }
                    }
                }
                .normal-wrap {
                    display: inline-flex;
                    flex-wrap: wrap;
                    flex: 0 0 350px;
                    .video-item {
                        margin-bottom: 18px;
                        &:nth-child(even) {
                            margin-right: 0;
                        }
                        &:last-child {
                            margin-bottom: 0;
                        }
                        .video-title {
                            position: absolute;
                            height: 58px;
                            font-size: 18px;
                        }
                    }
                    
                }
            }
        }
    }
</style>
