import monthNames from '../../_constants/months';
import { Menu, Dropdown } from 'antd';
import GoogleMap from '../../Components/GoogleMap/GoogleMap';
import { useState } from 'react';
import { useViewport } from '../../_helpers/viewPort';
import { nth } from '../../_helpers/sharedFunctions';

const Hotspot = props => {
    const [mapVisible, setVisible] = useState(false);
    const { width } = useViewport();
    
    const city = props.city;
    const state = props.state;
    const postcode = props.postcode;
    const venueName = props.venueName;
    const addressLine1 = props.addressLine1;
    const date = new Date(props.date);
    const dataFormatted = `${date.getDate()}${nth(date.getDate())} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    const googleMapProps = {
        lat: props.coordinates.latitude,
        lng: props.coordinates.longitude,
        size: '300px',
        userLetter: venueName[0],
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
                    {city}, {state}
                </div>    
            </Menu.Item>
            <Menu.Item >
                <div>
                    Date published: {dataFormatted}
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
                        <b>{venueName}</b>
                        <span>, {addressLine1}</span>
                    </td>
                    <td >
                        <b>{city}</b>
                        <span>, {state}, {postcode}</span>
                    </td>
                    <td>
                        {dataFormatted}
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
                    <b style ={{fontSize: "25px", cursor: 'pointer'}}>{venueName}, {postcode}</b>
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

export default Hotspot;
