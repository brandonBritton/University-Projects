import { printableDivStyle } from './InlineStyles';

const Printable = props => {
    const businessSummary = props.businessesSummary;
    const checkinsSummary = props.checkinsSummary;
    const covidSummary = props.covidSummary;
    const usersSummary = props.usersSummary;
    const vaccinationsSummary = props.vaccinationsSummary;

    return (
        <div style = {{paddingLeft: '5%'}}>
            <h3>COVID-19 Summary</h3>

            <b>Total number of venues marked as a hotspot</b>
            <div style={printableDivStyle}>{covidSummary.totalCurrentHotspotVenues}</div>

            <b>Total number of deaths</b>
            <div style={printableDivStyle}>{covidSummary.totalDeaths}</div>

            <b>Total number of people hospitalised</b>
            <div style={printableDivStyle}>{covidSummary.totalHospitalised}</div>

            <b>Number of overseas cases in the past 24 hours</b>
            <div style={printableDivStyle}>{covidSummary.totalOverseasCasesLast24Hours}</div>

            <b>Total number of positive cases</b>
            <div style={printableDivStyle}>{covidSummary.totalPositiveCases}</div>

            <b>Number of positive cases in the past 24 hours</b>
            <div style={printableDivStyle}>{covidSummary.totalPositiveCasesLast24Hours}</div>

            <b>Total number of COVID-19 tests undertaken</b>
            <div style={printableDivStyle}>{covidSummary.totalTests}</div>

            <b>Number of COVID-19 tests undertaken in the past 24 hours</b>
            <div style={printableDivStyle}>{covidSummary.totalTestsLast24Hours}</div>




            <h3>Business Summary</h3>

            <b>Businesses deemed a hotspot in the past 24 hours</b>
            <div style={printableDivStyle}>{businessSummary.businessesDeemedHotspot24Hours}</div>

            <b>Total number of businesses registered with COVID Guard</b>
            <div style={printableDivStyle}>{businessSummary.totalBusinessesRegistered}</div>




            <h3>Check-in Summary</h3>

            <b>Number of check-ins in the past 24 hours</b>
            <div style={printableDivStyle}>{checkinsSummary.checkinsLast24Hours}</div>

            <b>Total number of check-ins</b>
            <div style={printableDivStyle}>{checkinsSummary.totalCheckins}</div>




            <h3>User Summary</h3>

            <b>Total number of registered general public users</b>
            <div style={printableDivStyle}>{usersSummary.totalRegisteredGeneralPublicUsers}</div>



            <h3>Vaccination Summary</h3>

            <b>Total number of registered vaccination centres</b>
            <div style={printableDivStyle}>{vaccinationsSummary.totalVaccinationCentres}</div>

            <b>Total number of vaccinations administered</b>
            <div style={printableDivStyle}>{vaccinationsSummary.totalVaccinations}</div>

            <b>Number of vaccinstions administered yesterday</b>
            <div style={printableDivStyle}>{vaccinationsSummary.vaccinationsYesterday}</div>
        </div>
    );
}

export default Printable;