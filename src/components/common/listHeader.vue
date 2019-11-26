<template>
    <div class="header" :class="headerClass" v-show="listTitle">
        <h1 class="title">{{ listTitle }}<span class="sub-title">{{subTitle}}</span></h1>
        <div class="opts-wrapper">
            <slot name="headOpts"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            listTitle: {
                type: String,
                default: ''
            },
            subTitle: {
                type: String,
                default: ''
            },
            openMarginBotton: {
                type: Boolean,
                default: false
            },
            lessPadding: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            headerClass(){
                let ret = [];
                if(this.openMarginBotton){
                    ret.push('add-margin-bottom');
                }
                if(this.lessPadding){
                    ret.push('less-padding');
                }
                return ret.join(' ');
            }
        }
    }
</script>

<style lang="less" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 20px 25px 0;
    background-color: #fff;
    &.less-padding {
        padding: 25px 20px 10px 0;
    }
    &.add-margin-bottom {
        margin-bottom: 15px;
    }
    >.title {
        position: relative;
        padding-left: 20px;
        font-size: 26px;
        color: #333333;
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: -15px;
            width: 4px;
            height: 30px;
            background-color: #d11528;
        }
        .sub-title {
            color: #999999;
            font-weight: normal;
        }
    }
    
}
</style>