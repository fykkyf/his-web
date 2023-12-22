import Vue from 'vue'
import VueRouter from 'vue-router'
import moment from 'moment';

import VueI18n from 'vue-i18n' // 引入国际化的插件包
import locale from 'element-ui/lib/locale'
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
Vue.use(VueI18n) // 全局注册国际化包

import MainMenu from '../views/MainMenu.vue';
import Login from '../views/Login.vue'
import PatientPay from '../views/PatientPay.vue'
import DocStation from '../views/DocStation.vue'
import Registration from '../views/Registration.vue'
import ClinicPay from "../views/ClinicPay.vue";
import ClinicRefund from "../views/ClinicRefund.vue";
import ClinicOrder from '../views/ClinicOrder.vue'
import ClinicDoctor from '../views/ClinicDoctor.vue'
import DoctorOrder from '../views/DoctorOrder.vue'
import UploadPic from '../views/UploadPic.vue'
import CheckOrder from '../views/CheckOrder.vue'
import Index from '../views/Index.vue'
import OmdVisitor from '../views/OmdVisitor.vue'
import ClinicMed from '../views/ClinicMed.vue'
import PatientMed from '../views/PatientMed.vue'
import ManageMed from '../views/ManageMed.vue'
import PatientInfo from '../views/PatientInfo.vue'
import Discharge from '../views/Discharge.vue'
import PatientDailyOrder from '../views/PatientDailyOrder.vue'
import AddLocation from '../views/AddLocation.vue'
import RegularTest from "../views/RegularTest.vue"
import SetLocation from "../views/SetLocation.vue";
import SetUnit from "../views/SetUnit.vue";
import SetDosage from "../views/SetDosage.vue";
import SetAdministration from "../views/SetAdministration.vue";
import SelectClinicMed from '../views/SelectClinicMed.vue'
import SetEmployee from "../views/SetEmployee.vue";
import SelectPatientMed from '../views/SelectPatientMed.vue'
import SetTrestment from '../views/SetTrestment.vue'
import ClinicLab from '../views/ClinicLab.vue'
import PatientLab from '../views/PatientLab.vue'
import ClinicTable from '../views/ClinicTable.vue'
import PatientOrder from '../views/PatientOrder.vue'
import SetRole from "../views/SetRole.vue";
import PatientRadio from "../views/PatientRadio.vue";

// 创建国际化插件的实例
const i18n = new VueI18n({
// 指定语言类型 zh表示中文 en表示英文
    locale: 'en',
// 将elementUI语言包加入到插件语言数据里
    messages: {
// 英文环境下的语言数据
        en: {
            ...elementEN
        },
// 中文环境下的语言数据
        zh: {
            ...elementZH
        }
    }
})
// 配置elementUI 语言转换关系
locale.i18n((key, value) => i18n.t(key, value))

Vue.use(moment)
Vue.use(VueRouter)
// 在重写push|replace方法时，先把VueRouter原型对象的push|replace保存一份    
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
/**参数1：告诉原来的push | replace方法，你往那里跳转（传递哪些参数）、参数2：成功回调、 参数3：失败回调**/
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}


const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
    },
    {
        path: '/index',
        name: 'index',
        component: Index,

    },
    {
        path: '/mainMenu',
        name: 'mainMenu',
        component: MainMenu,
        children: [
            {
                path: '/addLocation',
                name: 'addLocation',
                component: AddLocation,
            },
            {
                path: '/checkOrder',
                name: 'checkOrder',
                component: CheckOrder,
            },
            {
                path: '/clinicDoctor',
                name: 'clinicDoctor',
                component: ClinicDoctor,
            },
            {
                path: '/clinicLab',
                name: 'clinicLab',
                component: ClinicLab,
            },
            {
                path: '/clinicMed',
                name: 'clinicMed',
                component: ClinicMed,
            },
            {
                path: '/clinicOrder',
                name: 'clinicOrder',
                component: ClinicOrder,
            },
            {
                path: '/clinicPay',
                name: 'clinicPay',
                component: ClinicPay,
            },
            {
                path: '/clinicRefund',
                name: 'clinicRefund',
                component: ClinicRefund,
            },
            {
                path: '/discharge',
                name: 'discharge',
                component: Discharge,
            },

            {
                path: '/docstation',
                name: 'docstation',
                component: DocStation,
            },
            {
                path: '/doctorOrder',
                name: 'doctorOrder',
                component: DoctorOrder,
            },

            {
                path: '/manageMed',
                name: 'manageMed',
                component: ManageMed,
            },
            {
                path: '/omdvisitor',
                name: 'omdvisitor',
                component: OmdVisitor,
            },
            {
                path: '/patientDailyOrder',
                name: 'patientDailyOrder',
                component: PatientDailyOrder,
            },
            {
                path: '/patientInfo',
                name: 'patientInfo',
                component: PatientInfo,
            },
            {
                path: '/patientLab',
                name: 'patientLab',
                component: PatientLab,
            },

            {
                path: '/patientMed',
                name: 'patientMed',
                component: PatientMed,
            },
            {
                path: '/patientPay',
                name: 'patientPay',
                component: PatientPay,
            },
            {
                path: '/registration',
                name: 'registration',
                component: Registration,
            },
            {
                path: '/regularTest',
                name: 'regularTest',
                component: RegularTest,
            },
            {
                path: '/selectClinicMed',
                name: 'selectClinicMed',
                component: SelectClinicMed,
            },
            {
                path: '/selectPatientMed',
                name: 'selectPatientMed',
                component: SelectPatientMed,
            },
            {
                path: '/setAdministration',
                name: 'setAdministration',
                component: SetAdministration,
            },
            {
                path: '/setDosage',
                name: 'setDosage',
                component: SetDosage,
            },
            {
                path: '/setEmployee',
                name: 'setEmployee',
                component: SetEmployee,

            },
            {
                path: '/setLocation',
                name: 'setLocation',
                component: SetLocation,

            },
            {
                path: '/setRole',
                name: 'setRole',
                component: SetRole,

            },
            {
                path: '/setTrestment',
                name: 'setTrestment',
                component: SetTrestment,

            },
            {
                path: '/setUnit',
                name: 'setUnit',
                component: SetUnit,

            },
            {
                path: '/upload',
                name: 'upload',
                component: UploadPic,
            },
            {
                path: '/patientOrder',
                name: 'patientOrder',
                component: PatientOrder,
            },
            {
                path: '/patientRadio',
                name: 'patientRadio',
                component: PatientRadio,
            },
            {
                path: '/clinicTable',
                name: 'clinicTable',
                component: ClinicTable,
            },

        ],
    },
]
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router