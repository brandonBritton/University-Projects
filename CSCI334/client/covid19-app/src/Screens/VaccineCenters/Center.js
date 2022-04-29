import { Menu, Dropdown } from 'antd';
import GoogleMap from '../../Components/GoogleMap/GoogleMap';
import { useState } from 'react';
import { useViewport } from '../../_helpers/viewPort';

const Center = props => {
    const [mapVisible, setVisible] = useState(false);
    const { width } = useViewport();
    
    const city = props.city;
    const state = props.state;
    const postCode = props.postcode;
    const suburb = props.suburb;
    const clinicName = props.clinicName;
    const addressLine1 = props.addressLine1;
    const phone = props.phone;
    const coordinates = props.coordinates;

    const googleMapProps = {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
        size: '300px',
        userLetter: clinicName[0],
        markerColour: "#0E5F76"
    }

    const addressMenu = (
        <Menu>
            <Menu.Item >
                <div>
                    <GoogleMap {...googleMapProps}/>
                </div>    
            </Menu.Item>
        </Menu>
    );

    const mobileMenu = (
        <Menu>
            <Menu.Item >
                <div>
                    {addressLine1}
                </div>    
            </Menu.Item>
            <Menu.Item >
                <div>
                    {suburb}, {city}, {state}
                </div>    
            </Menu.Item>
            <Menu.Item >
                <div>
                    Phone: {phone}
                </div>    
            </Menu.Item>
            <Menu.Item >
                <div>
                    <GoogleMap {...googleMapProps} />
                </div>    
            </Menu.Item>
        </Menu>
    );

    const desktop = (
        <table id="vaccine-center-table">
            <tbody>
                <tr>
                    <td>
                        <b>{clinicName}</b>
                        <span>, {addressLine1}</span>
                    </td>
                    <td >
                        <b>{suburb}</b>
                        <span>, {city}, {state}, {postCode}</span>
                    </td>
                    <td>
                        {phone}
                    </td>
                    <td>
                        <Dropdown 
                            overlay={addressMenu} 
                            placement="bottomRight"
                            visible={mapVisible} 
                            onVisibleChange={ flag => { setVisible(flag) }}
                        >
                            <u style={{cursor: 'pointer'}}>Map</u>
                        </Dropdown>
                    </td>
                </tr>
            </tbody>
        </table>
    );

    const mobile = (
        <div style={{paddingBottom: '10px', paddingTop: '10px'}}>
            <Dropdown 
                    overlay={mobileMenu} 
                    placement="bottomRight"
                    visible={mapVisible} 
                    title="Map" 
                    onVisibleChange={ flag => { setVisible(flag) }}
                >
                    <b style ={{fontSize: "25px", cursor: 'pointer'}}>{clinicName}, {postCode}</b>
            </Dropdown>
        </div>
    );

    return(
        <div>
            {
                width < 900
                ? mobile
                : desktop   
            }
        </div>
    );
}

export default Center;
