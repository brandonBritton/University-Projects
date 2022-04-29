import Login from '../../Screens/Login/Login';
import ForgotPassword from '../../Screens/ForgotPassword/ForgotPassword';
import Register from '../../Screens/Register/Register';
import CurrentHotspots from '../../Screens/CurrentHotspots/CurrentHotspots';
import MoreInfo from '../../Screens/MoreInfo/MoreInfo';
import VaccineCenters from '../../Screens/VaccineCenters/VaccineCenters';
import Support from '../../Screens/Support/Support';
import CheckVaccineStatus from '../../Screens/CheckVaccStatus/CheckVaccStatus';
import TermsAndConditions from '../../Screens/TermsAndConditions/TermsAndConditions';
import MarkCovidCase from '../../Screens/MarkCovidCase/MarkCovidCase';
import ChangePassword from '../../Screens/ChangePassword/ChangePassword';
import VenueCode from '../../Screens/VenueCode/VenueCode';
import MyVaccineStatus from '../../Screens/MyVaccineStatus/MyVaccineStatus';
import ConfirmUserVaccination from '../../Screens/ConfirmUserVaccination/ConfirmUserVaccination';
import MyProfile from '../../Screens/MyProfile/MyProfile';
import EditMyProfile from '../../Screens/MyProfile/EditMyProfile';
import MyProfileHealth from '../../Screens/MyProfile/MyProfileHealth';
import EditMyProfileHealth from '../../Screens/MyProfile/EditMyProfileHealth';
import MyProfileBusiness from '../../Screens/MyProfile/MyProfileBusiness';
import EditMyProfileBusiness from '../../Screens/MyProfile/EditMyProfileBusiness';
import CheckIn from '../../Screens/CheckIn/CheckIn';
import AddClinic from '../../Screens/AddClinic/AddClinic';

import PATH from '../../_constants/paths';
import USER_TYPE from '../../_constants/userTypes'; 

const config =  {
    routes: [
        {
            component: Login,
            url: PATH.login,
            roles: [USER_TYPE.UNREGISTERED]
        },
        {
            component: ForgotPassword,
            url: PATH.forgotPassword,
            roles: [USER_TYPE.UNREGISTERED]
        },
        {
            component: Register,
            url: PATH.register,
            roles: [USER_TYPE.UNREGISTERED]
        },
        {
            component: CurrentHotspots,
            url: PATH.currentHotspots,
            roles: [USER_TYPE.UNREGISTERED, USER_TYPE.GENERAL]
        },
        {
            component: MoreInfo,
            url: PATH.moreInfo,
            roles: null
        },
        {
            component: VaccineCenters,
            url: PATH.vaccineCenters,
            roles: [USER_TYPE.UNREGISTERED, USER_TYPE.GENERAL]
        },
        {
            component: Support,
            url: PATH.support,
            roles: null
        },
        {
            component: CheckVaccineStatus,
            url: PATH.checkVaccineStatus,
            roles: [USER_TYPE.UNREGISTERED]
        },
        {
            component: TermsAndConditions,
            url: PATH.termsAndConditions,
            roles: null
        },
        {
            component: MarkCovidCase,
            url: PATH.markCovidCase,
            roles: [USER_TYPE.HEALTH]
        },
        {
            component: ChangePassword,
            url: PATH.changePassword,
            roles: [USER_TYPE.HEALTH, USER_TYPE.BUSINESS, USER_TYPE.GENERAL]
        },
        {
            component: VenueCode,
            url: PATH.venueCode,
            roles: [USER_TYPE.BUSINESS]
        },
        {
            component: MyVaccineStatus,
            url: PATH.myVaccineStatus,
            roles: [USER_TYPE.GENERAL]
        },
        {
            component: MyVaccineStatus,
            url: PATH.myVaccineStatus,
            roles: [USER_TYPE.GENERAL]
        },
        {
            component: ConfirmUserVaccination,
            url: PATH.confirmUserVaccination,
            roles: [USER_TYPE.HEALTH]
        },
        {
            component: MyProfile,
            url: PATH.myProfile,
            roles: [USER_TYPE.GENERAL]
        },
        {
            component: EditMyProfile,
            url: PATH.editMyProfile,
            roles: [USER_TYPE.GENERAL]
        },
        {
            component: MyProfileHealth,
            url: PATH.myProfileHealth,
            roles: [USER_TYPE.HEALTH]
        },
        {
            component: EditMyProfileHealth,
            url: PATH.editMyProfileHealth,
            roles: [USER_TYPE.HEALTH]
        },
        {
            component: MyProfileBusiness,
            url: PATH.myProfileBusiness,
            roles: [USER_TYPE.BUSINESS]
        },
        {
            component: EditMyProfileBusiness,
            url: PATH.editMyProfileBusiness,
            roles: [USER_TYPE.BUSINESS]
        },
        {
            component: CheckIn,
            url: PATH.checkIn,
            roles: [USER_TYPE.UNREGISTERED, USER_TYPE.GENERAL]
        },
        {
            component: AddClinic,
            url: PATH.addClinic,
            roles: [USER_TYPE.HEALTH]
        }
    ]
};

export default config;
