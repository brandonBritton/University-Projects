import { useEffect, useState } from 'react';
import { _getVenueInfo } from '../../_helpers/endPoints';
import { useAuth, useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import { logout } from '../../_helpers/sharedFunctions';
import { Spin } from 'antd';

const VenueCode = () => {
    const [venueInfo, setVenueInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const auth = useAuth();
    const updateAuth = useAuthUpdate();

    useEffect(() => {
        setLoading(true);

        _getVenueInfo(auth.token)
        .then(res => {
            setLoading(false);
            setVenueInfo(res.data);
            console.log(res.data)
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            if(err.response.status === 401) logout(updateAuth, auth.token, auth.type);
            else setError(true);
        })
    }, [auth.token, updateAuth, auth.type]);

    return(
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>My Venue Code</h1>
            </div>
            
            <div>
                <h1 style={{marginTop:"1%" ,textAlign:'Center',fontWeight:'normal',fontSize:'20px',color: "#0E5F76"}}>
                    <span >Please print the contents of this page</span>
                    <br/>
                    <span >Crop as necessary</span> 
                </h1>
            </div>

            <div style={{width:"100%",height:'30px'}} >   </div>

            <div style={{color: "#0E5F76",backgroundColor: "#FDC500",fontSize:'20px',textAlign:'Center',padding:'10px'}}>
                <span >Help stop the spread. Please go to the following web</span>
                <br/>
                <span >page and enter the code shown below. Create an</span> 
                <br/>
                <span>account for faster sign in next time.</span>
                <br/>
                <span style={{fontSize:'32px',fontWeight:'bolder',margin:'10px'}}>www.COVIDGuard.com</span>
            </div>

            {
                error
                ?
                <div style={{textAlign: 'center'}}>Error loading data. Please try refreshing page or contact support.</div>
                :
                <div style={{fontSize:'40px',textAlign:'center',padding:'15px'}}> 
                    <Spin spinning={loading} size="large"/>
                    <div>{venueInfo.businessName}</div>
                    <div>{venueInfo.businessCode}</div>
                </div>
            }  
        </div>
    );
}

export default VenueCode;