import types from './mutation-types'

const mutations = {
    [types.SET_LOGIN_USERINFO](state, userInfo){
        state.loginUserInfo = userInfo;
    },
    [types.SET_IS_MANAGER](state, flag){
        state.isManager = flag;
    },
    [types.SET_CURRENT_NAVI](state, navi){
        state.currentNavi = navi;
    },
    [types.SET_CURRENT_SUBNAVI](state, subNavi){
        state.currentSubNavi = subNavi;
    },
    [types.SET_HEADERMODE](state, mode){
        state.headerMode = mode;
    },
    [types.SET_DATALIST_DEFAULTTAB](state, defaultTab){
        state.dataListDefaultTab = defaultTab;
    },
    [types.SET_SPIN_STATUS](state, status){
        state.spinStatus = status;
    },
}

export default mutations