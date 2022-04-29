import { useState, useEffect } from "react";
import { _getVaccinationStatus, _getGeneralProfile } from '../../_helpers/endPoints';
import { useAuth, useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import { formatDate, nameEndingInS, logout } from '../../_helpers/sharedFunctions';
import { Spin } from 'antd';





const MyVaccineStatus = () => {
    const auth = useAuth();
    const updateAuth = useAuthUpdate();

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
    });

    const [vaccinationRecord, setVaccinationRecord] = useState({
        vaccinationCode: "d",
        vaccinationType: "d",
        vaccinationStatus: "d",
        dateAdministered: "d"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [noRecord, setNoRecord] = useState(false);

    const dateAdministeredFormatted = formatDate(vaccinationRecord.dateAdministered);
    const lastName = nameEndingInS(user.lastName);




    
    useEffect(() => {
        let unmounted = false;
        setLoading(true);
        
        Promise.all([_getVaccinationStatus(auth.token), _getGeneralProfile(auth.token)])
        .then(resArr => {
            if(!unmounted){
                const recordRes = resArr[0].data.vaccinationRecords;
                if(recordRes.length > 0){
                    const recentRecord = recordRes.reduce((a, b) => {
                        return new Date(a.dateAdministered) > new Date(b.dateAdministered) ? a : b;
                    });
                    setVaccinationRecord(recentRecord);
                }
                else setNoRecord(true);
                
                const userRes = resArr[1];
                setUser(userRes.data);
                setLoading(false);
            }
        })
        .catch(err => {
            console.log(err);
            if(err.response.status === 401) logout(updateAuth, auth.token, auth.type); 
            if(!unmounted){
                setError(true);
                setLoading(false);
            }
        });

        return () => { unmounted = true };
    }, [auth.token, updateAuth, auth.type]);




    
    return(
        <div>
            <h1 style = {{color: "#0E5F76", textAlign: "left", backgroundColor: "#FDC500", paddingLeft: "1%"}}>My Vaccination Status</h1>
            <h1 style = {{color: "#0E5F76", padding: "2%", textAlign: "center"}}>{`${user.firstName} ${lastName} Vaccination Status`}</h1>

            {
                loading
                ?
                <div style={{textAlign: "center"}}>
                    <Spin size="large"/>
                </div> 
                :
                error
                ? 
                <div style={{textAlign: 'center'}}>Error loading data. Please try refreshing page or contact support. </div>
                :
                noRecord
                ?
                <div style={{textAlign: 'center'}}>No vaccination records found. </div>
                :
                <div style={{width:"380px", margin: "0 auto", color: '#0E5F76'}}>
                    <div>
                        <b>Vaccine Type: </b>
                        <span>{vaccinationRecord.vaccinationType}</span>
                    </div>
                    <div>
                        <b>Status: </b>
                        <span>{vaccinationRecord.vaccinationStatus}</span>
                    </div>
                    <div>
                        <b>Administered: </b>
                        <span>{dateAdministeredFormatted}</span>
                    </div>
                    <div>
                        <b>Your Code: </b>
                        <span>{vaccinationRecord.vaccinationCode}</span> 
                    </div>
                </div>
            }
        </div>
    );
}

export default MyVaccineStatus;