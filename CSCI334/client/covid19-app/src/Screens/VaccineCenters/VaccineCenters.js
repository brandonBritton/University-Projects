
import './VaccineCenters.css';
import { Input, Spin } from 'antd';
import Center from './Center';
import { useEffect, useState } from 'react';
import { filterCenters } from './Functions';
import { _getVaccineCenters } from '../../_helpers/endPoints';

const VaccineCenters = () => {
    const [centers, setCenters] = useState([]); 
    const [centerFilter, setCenterFilter] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        let unmounted = false;
        if(centers.length === 0 && centerFilter.length === 0 && !unmounted){
            setLoading(true);
            _getVaccineCenters()
            .then(res => {
                setLoading(false);
                setCenters(res.data.vaccinationCentres);
                setCenterFilter(res.data.vaccinationCentres);
            })
            .catch(err => {
                setLoading(false);
                setError(true);
                console.log(err);
            });
        }
        return () => { unmounted = true };
    }, [centers.length, centerFilter.length]);
    
    return (
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>COVID-19 Vaccine Centers</h1>
            </div>

            {
                error
                ? 
                <div style={{textAlign: 'center'}}>Error loading data. Please try refreshing page or contact support. </div>
                :
                <div>
                    <div id="vaccine-center-upper-body">
                        <div className="vaccine-center-column-left">
                            <div>
                                <span style={{color: "#0E5F76", fontSize: "28px"}}>Nation wide COVID-19 Vaccination Centers</span>

                                <div style={{width: '300px', paddingTop: "1%"}}>
                                    <Input onChange={e => { filterCenters(e, setCenters, centers.length, centerFilter) }} placeholder="Enter your postcode"/>
                                </div>
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
                            <div id='vaccine-center-wrapper'>
                                {
                                    centers.map((center, i) => {
                                        return <Center key={i} {...center}/>
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

export default VaccineCenters;