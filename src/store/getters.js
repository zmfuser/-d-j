let getters = {
    getLoginUserInfo: state => state.loginUserInfo,
    getIsManager: state => state.isManager,
    getCurrentNavi: state => state.currentNavi,
    getCurrentSubNavi: state => state.currentSubNavi,
    getHeaderMode: state => state.headerMode,
    getDataListDefaultTab: state => state.dataListDefaultTab,
    getSpinStatus: state => state.spinStatus,
}

export default getters