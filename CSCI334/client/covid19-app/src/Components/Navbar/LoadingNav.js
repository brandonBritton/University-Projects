import { Menu } from 'antd';
import logo from '../../Assets/Images/logo.png';

const { Item } = Menu;

const LoadingNav = () => {
    return (
        <div >
            <Menu style ={{backgroundColor: "#0E5F76"}} mode="horizontal" >
                <Item>
                    <img width={200} src={logo} alt="Logo" />
                </Item>
            </Menu>
        </div>
    );
}

export default LoadingNav;