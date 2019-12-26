import types from './mutation-types'
import { reject } from '_any-promise@1.3.0@any-promise';

const actions = {
    changeSpinStatus({commit, state}, status){
        commit(types.SET_SPIN_STATUS, status);
    },
    changeNaviPath({commit, state}, navi){
        commit(types.SET_CURRENT_NAVI, navi);
    },
    changeSubNaviPath({commit, state}, subNavi){
        commit(types.SET_CURRENT_SUBNAVI, subNavi);
    },
    changeHeaderMode({commit, state}, mode){
        commit(types.SET_HEADERMODE, mode);
    },
    changeDataListDefaultTab({commit, state}, defaultTab){
        commit(types.SET_DATALIST_DEFAULTTAB, defaultTab);
    },
    setLoginUserInfoForLocal({commit, state}, userInfo){
       
        commit(types.SET_LOGIN_USERINFO, userInfo);
    },
    getUserInfoByAccount({commit, state}, params){
        return new Promise((resolve, reject) => {
            let query = [];
            if(typeof params.account != 'undefined'){
                query.push(`account=${params.account}`);
            }
            $axios.get(`/party/emp/getEmpInfo${'?'+query.join('&')}`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getLoginUserData({commit, state}, params){
        
        return new Promise((resolve) => {
            $axios.get(`/party/reg/getInfoByAccount`).then((response) => {
                if(response.data.success){
                    commit(types.SET_LOGIN_USERINFO, response.data.data.emp);
                }
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        })
    },
    getIsManager({commit, state}, params){
        return new Promise((resolve) => {
            $axios.get(`/party/emp/isManager`).then((response) => {
                if(response.data.success){
                    commit(types.SET_IS_MANAGER, response.data.data.isManager);
                }
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        })
    },
    getHotNews(){
        return new Promise((resolve, reject) => {
            $axios.get('/party/essay/getEssayHeadLine').then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getBannerData(){
        return new Promise((resolve, reject) => {
            $axios.get('/party/essay/getEssayBanner').then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getPartyInfoDatas(){
        return new Promise((resolve, reject) => {
            $axios.get('/party/essay/indexPartyPC').then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getPartyInfoListByType({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/essay/partyInfo`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getMyOrgListByType({commit, state}, params){
        return new Promise((resolve, reject) => {
            let query = [];
            if(typeof params.channelCode != 'undefined'){
                query.push(`channelCode=${params.channelCode}`);
            }
            if(typeof params.account != 'undefined'){
                query.push(`account=${params.account}`);
            }
            if(typeof params.currentPage != 'undefined'){
                query.push(`currentPage=${params.currentPage}`);
            }
            $axios.get(`/party/essay/getMyOrgList${'?'+query.join('&')}`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getOrganizationList({commit, state}, params){
        return new Promise((resolve, reject) => {
            
            
            $axios.get(`/party/org/getDeptByAdd${'?type='+params.type}`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getOrgsData(){
        return new Promise((resolve, reject) => {
            $axios.get('/party/org/getOrgs').then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    findOrgByAcc({commit, state}, params){
        return new Promise((resolve, reject) => {
            let query = [];
            if(typeof params.type != 'undefined'){
                query.push(`type=${params.type}`);
            }
            $axios.get(`/party/org/findOrgByAcc${'?'+query.join('&')}`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getEmpInfo({commit, state}, params){
        let query = [];
        if(typeof params.account != 'undefined'){
            query.push(`account=${params.account}`);
        }
        return new Promise((resolve, reject) => {
            $axios.get(`/party/emp/getEmpInfo${'?'+query.join('&')}`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getCheckDatumList({commit, state}, params){
        let query = [];
        if(typeof params.status != 'undefined'){
            query.push(`status=${params.status}`);
        }
        if(typeof params.isMyDatum != 'undefined'){
            query.push(`isMyDatum=${params.isMyDatum}`);
        }
        if(typeof params.currentPage != 'undefined'){
            query.push(`currentPage=${params.currentPage}`);
        }
        return new Promise((resolve, reject) => {
            $axios.get(`/party/essay/checkDatum${'?'+query.join('&')}`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getWorkPlanList({commit, state}, params){
        delete params.workPlanStatus
        return new Promise((resolve, reject) => {
            $axios.post(`/party/essay/workPlan`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getMyWorkPlanList({commit, state}, params){
        delete params.status
        return new Promise((resolve, reject) => {
            $axios.post(`/party/essay/myWorkPlan`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getWorkPlanListByOrgid({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/essay/workPlanByOrgId`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    attachUpload({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/file/upload`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    attachDownload({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/file/download`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    attachDelete({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/file/delFile`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getPowerList({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.get(`/party/power/getOwnedOrg`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    submitWorkPlan({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/essay/saveEssay`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getSecondChannelData(){
        return new Promise((resolve, reject) => {
            $axios.get(`/party/channel/getSecondChannel`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getThirdChannelData({commit, state}, params){
        let query = [];
        if(typeof params.upperCode != 'undefined'){
            query.push(`upperCode=${params.upperCode}`);
        }
        return new Promise((resolve, reject) => {
            $axios.get(`/party/channel/getThirdChannel${'?'+query.join('&')}`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getWorkPlanChannel(){
        return new Promise((resolve, reject) => {
            $axios.get(`/party/channel/getWorkPlanChannel`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    searchDataByKeyword({commit, state}, params){
        let query = [];
        if(typeof params.keyword != 'undefined'){
            query.push(`keyword=${params.keyword}`);
        }
        if(typeof params.currentPage != 'undefined'){
            query.push(`currentPage=${params.currentPage}`);
        }
        return new Promise((resolve, reject) => {
            $axios.get(`/party/essay/fuzzyQuery${'?'+query.join('&')}`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getDataInfoDetail({commit, state}, params){
        let query = [];
        if(typeof params.id != 'undefined'){
            query.push(`id=${params.id}`);
        }
        return new Promise((resolve, reject) => {
            $axios.get(`/party/essay/partyInfoDetail${'?'+query.join('&')}`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    organizationOptions({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/org/OrgEmpOperation`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    batchDelRelation({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/org/delRelationAboutEmp`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    singleDelRelation({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/relation/delEnshrine`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    addtoEnshrine({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/relation/toEnshrine`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    delWorkPlan({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/essay/delWorkPlan`, params).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    checkDatumById({commit, state}, params){
        let query = [];
        if(typeof params.id != 'undefined'){
            query.push(`id=${params.id}`);
        }
        if(typeof params.status != 'undefined'){
            query.push(`status=${params.status}`);
        }
        return new Promise((resolve, reject) => {
            $axios.get(`/party/essay/checkDatumById${'?'+query.join('&')}`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    getCountByType({commit, state}, params){
        let query = [];
        if(typeof params.type != 'undefined'){
            query.push(`type=${params.type}`);
        }
        if(typeof params.isMyWorkPlan != 'undefined'){
            query.push(`isMyWorkPlan=${params.isMyWorkPlan}`);
        }
        if(typeof params.isOrgIdWorkPlan != 'undefined'){
            query.push(`isOrgIdWorkPlan=${params.isOrgIdWorkPlan}`);
        }
        if(typeof params.isMyDatum != 'undefined'){
            query.push(`isMyDatum=${params.isMyDatum}`);
        }
        return new Promise((resolve, reject) => {
            $axios.get(`/party/essay/getCountByType${'?'+query.join('&')}`).then(response => {
                resolve(response.data);
            }).catch(error => {
                reject(error);
            })
        });
    },
    // 获取管理员表格数据
    getAdminByType({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/power/getAdminByType`, params).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 删除管理员
    delAuth({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/power/delAuth`, params).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 人名模糊搜索
    getEmpByDim({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/power/getEmpByDim`, params).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取权限
    getAllPower({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.get(`/party/power/getAll`, params).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加管理员
    addAuth({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.post(`/party/power/addAuth`, params).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取组织层级树
    getOrgsRemSome({commit, state}, params){
        return new Promise((resolve, reject) => {
            $axios.get(`/party/org/getOrgsRemSome?id=${params.id}`).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 组织排序
    orgSort({commit, state}, params) {
        return new Promise((resolve, reject) => {
            $axios.post(`/party/org/addOrgWeight`, params).then(response => {
                resolve(response.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取我的上传数据
    getMyUpload({commit, state}, params) {
        console.log(params);
        let query = [];
        if(params.channelCode !== '' && typeof params.channelCode != 'undefined'){
            query.push(`channelCode=${params.channelCode}`);
        }

        if(typeof params.currentPage != 'undefined'){
            query.push(`currentPage=${params.currentPage}`);
        }

        if(typeof params.channelCode != 'undefined'){
            query.push(`pageSize=${params.pageSize}`);
        }
        return new Promise((resolve, reject) => {
            $axios.get(`/party/essay/getMyUploadEssay${'?'+query.join('&')}`).then(response => {
                resolve(response.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 撤回
    essayChange({commit, state}, params) {
        console.log(params);
        let query = [];
        if(typeof params.id != 'undefined') {
            query.push(`id=${params.id}`);
            query.push(`isDraft=1`);
        } 
        return new Promise((resolve, reject) => {
            $axios.get(`/party/essay/essayChange${'?'+query.join('&')}`).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取草稿箱数据
    getDrafts({commit, state}, params) {
        console.log('123');
        return new Promise((resolve, reject) => {
            $axios.get(`/party/essay/getDrafts`).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    empTransDept({commit, state}, params) {
        return new Promise((resolve, reject) => {
            $axios.post(`/party/emp/empTransDept`, params).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    setReportAttachment({commit, state}, params) {
        return new Promise((resolve, reject) => {
            $axios.post(`/party/essay/setReportAttachment`, params).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    setNoExecutedToNonExecution({commit, state}, params) {
        return new Promise((resolve, reject) => {
            $axios.get(`/party/essay/setNoExecutedToNonExecution?essayId=${params.essayId}`).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getCountDetail({commit, state}, params) {
        return new Promise((resolve, reject) => {
            $axios.post(`/party/csv/getCountDetail`, params).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getCSV({commit, state}, params) {
        return new Promise((resolve, reject) => {
            $axios({
                url: '/party/csv/getCSV',
                method: 'post',
                data: params,
                responseType: 'blob',
            }).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default actions