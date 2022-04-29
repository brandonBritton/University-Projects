import './CurrentHotspots.css';
import { Input, Spin } from 'antd';
import Hotspot from './Hotspot';
import { useEffect, useState } from 'react';
import { filterHotspots } from './Functions';
import { _getCurrentHotspots } from '../../_helpers/endPoints'; 

const CurrentHotspots = () => {
    const [hotspots, setHotspots] = useState([]); 
    const [hotspotsFilter, setHotspotFilter] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        let unmounted = false;

        if(hotspots.length === 0 && hotspotsFilter.length === 0 && !unmounted){
            setLoading(true);
            _getCurrentHotspots()
            .then(res => {
                setHotspots(res.data.hotspots);
                setHotspotFilter(res.data.hotspots);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setError(true);
            });
        }
        return () => { unmounted = true };
        
    }, [hotspots.length, hotspotsFilter.length]);

    
    return (
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Current Hotspots</h1>
            </div>

            {
                error
                ? 
                <div style={{textAlign: 'center'}}>Error loading data. Please try refreshing page or contact support. </div>
                :
                <div>
                    <div id="current-hotspot-upper-body">
                        <div className="current-hotspots-column-left">
                            <div>
                                <span style={{color: "#0E5F76", fontSize: "28px"}}>Current National Hotspots</span>

                                <div style={{width: '300px', paddingTop: "1%"}}>
                                    <Input onChange={e => { filterHotspots(e, setHotspots, hotspots.length, hotspotsFilter) }} placeholder="Enter your postcode"/>
                                </div>
                            </div>
                        </div>
                        
                        <div className="current-hotspots-column-right">
                            <div style={{paddingTop: "1%"}}>
                                <b style={{color: "#0E5F76", fontSize: "20px"}}>Have you been to one of these locations?</b>
                            </div>
                            <div>
                                <span style={{color: "#0E5F76"}}>
                                    If you have been to one of these locations on the date specified, you must immediately self-quarantine, ring your local state health hotline and identify yourself as a potential close contact.
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{clear: "both", paddingTop: "1%"}}>
                        {
                            loading
                            ? 
                            <div style={{textAlign: 'center'}}>
                                <Spin size='large'/>
                            </div> 
                            :
                            <div id='current-hotspot-wrapper'>
                                {
                                    hotspots.map((hotspot, i) => {
                                        return <Hotspot key={i} {...hotspot}/>
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default CurrentHotspots;