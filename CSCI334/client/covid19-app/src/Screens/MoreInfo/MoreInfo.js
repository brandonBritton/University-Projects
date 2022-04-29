
import './MoreInfo.css';

const MoreInfo = () => {

    return(
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>More Info</h1>
            </div>
            <div className = 'moreInfoMainContent'> 
          
                <div style = {{textAlign: 'center'}}> <br/>
                    <h1 style = {{fontSize: '1.8rem', color: '#0E5F76'}}>COVID Guard Additional Information</h1>
                    <div style = {{fontSize: '1.2rem'}}>for more information regarding COVID-19, please use the following links:</div> <br/>
                </div>
                
                <div style = {{paddingLeft: '5%'}}>
                    <div><b>National COVID information</b></div>
                    <div>Department of Health: <a href="https://www.health.gov.au" className = 'govtLinks'><u>health.gov.au</u></a></div> <br/>

                    <div> <b>State COVID Information:</b></div>
                    <div> Queensland: <a href="https://www.covid19.qld.gov.au" className = 'govtLinks'><u>covid19.qld.gov.au</u></a> </div>
                    <div> New South Wales: <a href="https://www.nsw.gov.au/covid-19/latest-news-and-updates" className = 'govtLinks'><u>nsw.gov.au/covid19</u></a></div>
                    <div> Victoria: <a href="https://www.dhhs.vic.gov.au/coronavirus-covid-19-daily-update"className = 'govtLinks'><u>dhhs.vic.gov.au/coronavirus</u></a></div>
                    <div> South Australia: <a href="https://www.covid-19.sa.gov.au" className = 'govtLinks'><u>covid-19.sa.gov.au</u></a></div>
                    <div> Western Australia: <a href="https://www.healthywa.wa.gov.au/coronavirus" className = 'govtLinks'><u>healthywa.wa.gov.au/coronavirus</u></a></div>
                    <div> Northern Territory: <a href="https://coronavirus.nt.gov.au" className = 'govtLinks'><u>coronavirus.nt.gov.au</u></a></div>
                    <div> Tasmania: <a href="https://coronavirus.tas.gov.au" className = 'govtLinks'><u>coronavirus.tas.gov.au</u></a></div>
                </div>
                
            </div>
        </div>

    );
}
export default MoreInfo;