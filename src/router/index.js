import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import CameraTest from '@/components/CameraTest'
import Detailed from '@/components/Detailed'
import NewForm from '@/components/NewForm'
import NewSubscription from '@/components/NewSubscription'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/camera',
      name: 'Camera',
      component: CameraTest
    },
    {
      path: '/detailed',
      name: 'Detailed View',
      component: Detailed
    },
    {
      path: '/newForm',
      name: 'New Form',
      component: NewForm
    },
    {
      path: '/newSub',
      name: 'New Subscription',
      component: NewSubscription
    }
  ]
})