<template>
    <div class="video-detail-warp">

        <div class="video-detail-header">
            视频直播
        </div>
        <div class="lines"></div>

        <div class="video-detail-content">
            <div class="content-title">
                习近平：切实贯彻落实新时代党的组织路线，全党努力把党建设得更加坚强有力
            </div>
            <div class="content-name-time">
                <div class="name">发布人：xxx</div>
                <div class="time">发布时间：2019-08-29</div>
            </div>
            <div class="content-video">

            </div>
        </div>

        <div class="video-detail-header active">
            视频回顾
        </div>
        <div class="lines"></div>

        <div class="video-list-row">
            <div class="list-item" v-for="(item,index) in videoDataList" :key="index">
                <div class="item-video">
                    <img :src="item.img" />
                </div>
                <div class="item-content">
                    {{ item.title }}
                </div>
                <div class="item-type-time">
                    <div class="item-type">{{ item.type }}</div>
                    <div class="item-time">{{ item.time }}</div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import img from "@/images/videoList.png"
    export default {
        data() {
            return {
                videoDataList: []
            }
        },
    }
</script>

<style lang="less" scoped>
    
    .video-detail-warp{
        width: 1100px;
        height: 100%;
        margin: 0 auto;
        padding-top: 51px;
        background: #ffffff;
        .video-detail-header{
            font-size: 30px;
            color: #d11528;
            text-align: left;
        }
        .active{
            position: relative;
            &::before{
                content: '';
                position: absolute;
                left: 0;
                bottom: -13px;
                width: 142px;
                height: 3px;
                background-color: #d11528;
            }
        }
        .lines{
            border-bottom: solid 1px #d9d9d9;
            margin-top: 10px;
            margin-bottom: 38px;
        }
        .video-detail-content{
            .content-title{
                font-size: 26px;
                line-height: 85.7px;
                color: #333333;
            }
            .content-name-time{
                font-size: 18px;
                line-height: 85.7px;
                color: #999999;
                display: flex;
                flex-direction: row;
                justify-content: center;
                .name{
                    margin-right: 90px;
                }
                .time{

                }
            }
            .content-video{
                width: 810px;
                height: 380px;
                background-color: #000000;
                border-radius: 6px;
                margin: auto;
                margin-bottom: 54px;
            }
        }
        .video-list-row{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .list-item{
                width: 353px;
                margin-bottom: 32px;
                margin-right: 20px;
                &:nth-child(3n+3){
                    margin-right: 0px;
                }
                .item-video{
                    width: 353px;
                    height: 164px;
                    img{
                        width: 353px;
                        height: 164px;
                    }
                }
                .item-content{
                    font-size: 20px;
                    line-height: 30px;
                    color: #333333;
                    margin: 18px 13px 24px 19px;
                    text-align: left;
                    word-break: break-all;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .item-type-time{
                    display: flex;
                    flex-direction: row;
                    font-size: 16px;
                    line-height: 18.7px;
                    letter-spacing: 0px;
                    color: #999999;
                    .item-type{
                        margin-right: 20px;
                    }
                }
            }
        }
    }
</style>