import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/home/home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home'
    }, {
        path: '/home',
        name: 'home',
        component: Home
    }, {
        path: '/searchResult',
        name: 'searchResult',
        component: () => import('./views/home/searchResult.vue'),
        props: (route) => ({ type: route.query.keyword })
    }, {
        path: '/partyInfo',
        name: 'partyInfo',
        component: () => import('./views/partyInfo/partyInfo.vue'),
        props: (route) => ({ type: route.query.type })
    }, {
        path: '/organization',
        name: 'organization',
        component: () => import('./views/organization/organization.vue')
    }, {
        path: '/myOrganization',
        name: 'myOrganization',
        component: () => import('./views/myOrganization/myOrganization.vue')
    }, {
        path: '/manageCenter',
        name: 'manageCenter',
        component: () => import('./views/manageCenter/manageCenter.vue')
    }, {
        path: '/workPlanList',
        name: 'workPlanList',
        component: () => import('./views/manageCenter/workPlanList.vue'),
        props: (route) => ({ type: route.query.type })
    }, {
        path: '/workPlanUpload',
        name: 'workPlanUpload',
        component: () => import('./views/manageCenter/workPlanUpload.vue')
    }, {
        path: '/examineDataList',
        name: 'examineDataList',
        component: () => import('./views/manageCenter/examineDataList.vue')
    }, {
        path: '/examineDetail',
        name: 'examineDetail',
        component: () => import('./views/manageCenter/examineDetail.vue')
    }, {
        path: '/informationPublish',
        name: 'informationPublish',
        component: () => import('./views/manageCenter/informationPublish.vue')
    }, {
        path: '/liveVideo',
        name: 'liveVideo',
        component: () => import('./views/liveVideo/liveVideo.vue')
    },{
      path: '/liveVideoDetail',
      name: 'liveVideoDetail',
      component: () => import('./views/liveVideo/liveVideoDetail.vue')
    },{
      path: '/details',
      name: 'details',
      component: () => import('./components/common/details.vue'),
      props: (route) => ({ type: route.query.id })
    },{
        path: '/managerSetting',
        name: 'managerSetting',
        component: () => import('./views/managerSetting/ManagerSetting.vue')
    },{
        path: '/myUpload',
        name: 'myUpload',
        component: () => import('./views/manageCenter/myUpload.vue')
    },{
        path: '/draftBox',
        name: 'draftBox',
        component: () => import('./views/manageCenter/draftBox.vue')
    }, {
        path: '/statistics',
        name: 'statistics',
        component: () => import('./views/manageCenter/statistics.vue')
    }, {
        path: '/test',
        name: 'test',
        component: () => import('./views/test/test.vue')
    }
  ]
})
