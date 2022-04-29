import { Menu } from 'antd';
import logo from '../../Assets/Images/logo.png';
import './Navbar.css';
import { logout } from '../../_helpers/sharedFunctions';
import { useAuth, useAuthUpdate } from '../AuthContext/AuthContext';
import history from '../../_helpers/history';
import PATH from '../../_constants/paths';

const { Item } = Menu;

const GeneralNav = () => {
    const updateAuth = useAuthUpdate();
    const auth = useAuth();

    return (
        <div>
            <Menu style ={{backgroundColor: "#0E5F76"}} mode="horizontal" >
                <Item onClick={() => { history.push(PATH.home); window.location.reload()}}>
                    <img width={200} src={logo} alt="Logo" />
                </Item>
                <Item onClick={() => {history.push(PATH.checkIn)}} >
                    <div className='navbar-menuitem-text'>Venue Check-In</div>
                </Item>
                <Item onClick={() => {history.push(PATH.vaccineCenters)}}>
                    <div className='navbar-menuitem-text'>Vaccine Centres</div>
                </Item>
                <Item onClick={() => {history.push(PATH.currentHotspots)}}>
                    <div className='navbar-menuitem-text'>Current Hotspots</div>
                </Item>
                <Item onClick={() => {history.push(PATH.myProfile)}}>
                    <div className='navbar-menuitem-text'>My Profile</div>
                </Item>
                <Item onClick={() => {history.push(PATH.myVaccineStatus)}}>
                    <div className='navbar-menuitem-text'>My Status</div>
                </Item>
                <Item  onClick={() => {logout(updateAuth, auth.token, auth.type)}} style={{float: 'right', paddingTop: '3px'}}>
                    <div className='navbar-menuitem-text'>Logout</div>
                </Item>
            </Menu>
        </div>
    );
}

export default GeneralNav;