import { Menu } from 'antd';
import logo_basic from '../../Assets/Images/logo_basic.png';
import history from '../../_helpers/history';
import PATH from '../../_constants/paths';

const { Item } = Menu;

const Footer = () => {
    return (
        <div>
            <Menu style ={{backgroundColor: "#0E5F76"}} mode="horizontal" >
                <Item onClick={() => {history.push(PATH.home)}}>
                    <div className='navbar-menuitem-text'>Home</div>
                </Item>

                <Item onClick={() => {history.push(PATH.support)}}>
                    <div className='navbar-menuitem-text'>Support</div>
                </Item>

                <Item onClick={() => {history.push(PATH.moreInfo)}}>
                    <div className='navbar-menuitem-text'>More Info</div>
                </Item>

                <Item onClick={() => {history.push(PATH.termsAndConditions)}}>
                    <div className='navbar-menuitem-text'>Terms and Conditions</div>
                </Item>
                
                <Item onClick={() => { history.push(PATH.home)}} style={{float: 'right'}}>
                    <img width={50} src={logo_basic} alt="Logo" />
                </Item>
            </Menu>
        </div>
    );
}

export default Footer;