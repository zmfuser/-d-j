<template>
    <div class="live-video-warp">

        <listHeader :listTitle="listTitle" style="margin-bottom: 20px;">
            <div class="slot-opts-wrap collection-opts" slot="headOpts">
                <div class="opt-item">
                    <div class="icon"></div>
                    <div class="title">历史视频</div>
                </div>
            </div>
        </listHeader>

        <div class="video-list-row">
            <div class="list-item" v-for="(item,index) in videoDataList" :key="index" @click="videoDetails(item)">
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

        <div class="page-footer-wrap">
            <pagers :totalCount="100"></pagers>
        </div>

    </div>
</template>

<script>
    import listHeader from '@/components/common/listHeader'
    import img from "@/images/videoList.png"
    import pagers from '@/components/common/pagers'
    import {mapGetters, mapActions} from 'vuex'
    export default {
        components: {
            listHeader,
            pagers
        },
        data() {
            return {
                listTitle:'视频直播',
                videoDataList: []
            }
        },
        computed: {
            ...mapGetters([
                'getCurrentNavi'
            ])
        },
        mounted(){
            let {name} = this.$route;
            if(this.getCurrentNavi != name){
                this.changeNaviPath(name);
            }
        },
        methods: {
            videoDetails() {
                this.$router.push("liveVideoDetail");
            },
            ...mapActions([
                'changeNaviPath'
            ])
        },
    }
</script>

<style lang="less" scoped>
    .live-video-warp{
        width: 1100px;
        margin: 0 auto;
        .slot-opts-wrap {
            .opt-item {
                border: 1px solid #d11528;
                color: #d11528;
                >.icon {
                    background: url('~@/images/sp_icon_ls.png') no-repeat;
                    background-size: 100% 100%;
                }
                width: inherit;
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
                    font-size: 16px;
                    line-height: 30px;
                    color: #333333;
                    margin: 14px 14px 20px;
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
                    font-size: 14px;
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