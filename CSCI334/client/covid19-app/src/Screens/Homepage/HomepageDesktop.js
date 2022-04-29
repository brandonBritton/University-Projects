import { Row, Col, Card } from 'antd';
import { cardDiv, iconStyle} from './InlineStyles';
import { 
    FireOutlined, 
    FileDoneOutlined, 
    FormOutlined, 
    FrownOutlined, 
    MedicineBoxFilled, 
    GlobalOutlined, 
    PlusCircleOutlined, 
    FileSearchOutlined, 
    ExperimentOutlined, 
    UserOutlined,
    BranchesOutlined,
    InsertRowLeftOutlined
} from '@ant-design/icons';
import './Homepage.css';

const HomepageDesktop = props => {
    const businessSummary = props.businessesSummary;
    const checkinsSummary = props.checkinsSummary;
    const covidSummary = props.covidSummary;
    const usersSummary = props.usersSummary;
    const vaccinationsSummary = props.vaccinationsSummary;

    return(
        <div>
            <div className="homepage-section-banner">
                <h1 className="homepage-section-banner-h1"><BranchesOutlined/> COVID-19 Summary </h1>
            </div>

            <Row gutter={0}>
                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={covidSummary.totalCurrentHotspotVenues}
                        extra={<FireOutlined style={iconStyle}/>}  
                        headStyle={{color: '#0E5F76'}}
                    >
                        <p>Total number of venues marked as a hotspot</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={covidSummary.totalDeaths}  
                        extra={<FrownOutlined style={iconStyle}/>}  
                        headStyle={{ color: '#0E5F76'}}
                    >
                        <p>Total number of deaths</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>

                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={covidSummary.totalHospitalised}  
                        extra={<MedicineBoxFilled style={iconStyle}/>}  
                        headStyle={{color: '#0E5F76'}}
                    >
                        <p>Total number of people hospitalised</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={covidSummary.totalOverseasCasesLast24Hours}  
                        extra={<GlobalOutlined style={iconStyle}/>}  
                        headStyle={{ color: '#0E5F76'}}
                    >
                        <p>Number of overseas cases in the past 24 hours</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
            </Row>

            <div style={{marginTop: '3%'}}/>

            <Row gutter={0}>
                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={covidSummary.totalPositiveCases}  
                        extra={<PlusCircleOutlined style={iconStyle}/>}  
                        headStyle={{color: '#0E5F76'}}
                    >
                        <p>Total number of positive cases</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
                <Col  className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={covidSummary.totalPositiveCasesLast24Hours}  
                        extra={<PlusCircleOutlined style={iconStyle}/>}  
                        headStyle={{ color: '#0E5F76'}}
                    >
                        <p>Number of positive cases in the past 24 hours</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>

                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={covidSummary.totalTests}  
                        extra={<FileSearchOutlined style={iconStyle}/>}  
                        headStyle={{color: '#0E5F76'}}
                    >
                        <p>Total number of COVID-19 tests undertaken</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
                <Col  className="gutter-row" span={5}>
                    <Card
                        className="card-shadow-hoverable" 
                        title={covidSummary.totalTestsLast24Hours} 
                        extra={<FileSearchOutlined style={iconStyle}/>}  
                        headStyle={{ color: '#0E5F76'}}
                    >
                        <p>Number of COVID-19 tests undertaken in the past 24 hours</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
            </Row>

            <div style={{marginTop: '1%'}}/>
       



            <div className="homepage-section-banner">
                <h1 className="homepage-section-banner-h1"> <InsertRowLeftOutlined /> Business Summary</h1>
            </div>

            <Row gutter={0}>
                <Col className="gutter-row" span={5}>
                    <Card className="card-shadow-hoverable" 
                        title={businessSummary.businessesDeemedHotspot24Hours}  
                        extra={<FireOutlined style={iconStyle}/>}  
                        headStyle={{ color: '#0E5F76'}}
                    >
                        <p>Businesses deemed a hotspot in the past 24 hours</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={businessSummary.totalBusinessesRegistered}  
                        extra={<FileDoneOutlined style={iconStyle}/>}  
                        headStyle={{color: '#0E5F76'}}
                    >
                        <p>Total number of businesses registered with COVID Guard</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
            </Row>

            <div style={{marginTop: '1%'}}/>




            <div className="homepage-section-banner">
                <h1 className="homepage-section-banner-h1"><FormOutlined /> Check-in Summary</h1>
            </div>

            <Row gutter={0}>
                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={checkinsSummary.checkinsLast24Hours}  
                        extra={<FormOutlined style={iconStyle}/>}  
                        headStyle={{color: '#0E5F76'}}
                    >
                        <p>Number of check-ins in the past 24 hours</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
                <Col  className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={checkinsSummary.totalCheckins} 
                        extra={<FormOutlined style={iconStyle}/>}  
                        headStyle={{ color: '#0E5F76'}}
                    >
                        <p>Total number of check-ins</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
            </Row>

            <div style={{marginTop: '1%'}}/>




            <div className="homepage-section-banner">
                <h1 className="homepage-section-banner-h1"> <UserOutlined/> User Summary</h1>
            </div>

            <Row gutter={0}>
                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={usersSummary.totalRegisteredGeneralPublicUsers}  
                        extra={<FileDoneOutlined style={iconStyle}/>}  
                        headStyle={{color: '#0E5F76'}}
                    >
                        <p>Total number of registered general public users</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
            </Row>

            <div style={{marginTop: '1%'}}/>




            <div className="homepage-section-banner">
                <h1 className="homepage-section-banner-h1"> <ExperimentOutlined/> Vaccination Summary</h1>
            </div>

            <Row gutter={0}>
                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={vaccinationsSummary.totalVaccinationCentres}  
                        extra={<ExperimentOutlined style={iconStyle}/>}  
                        headStyle={{color: '#0E5F76'}}
                    >
                        <p>Total number of registered vaccination centres</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={vaccinationsSummary.totalVaccinations}  
                        extra={<ExperimentOutlined style={iconStyle}/>}  
                        headStyle={{ color: '#0E5F76'}}
                    >
                        <p>Total number of vaccinations administered</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
                <Col className="gutter-row" span={5}>
                    <Card 
                        className="card-shadow-hoverable" 
                        title={vaccinationsSummary.vaccinationsYesterday}  
                        extra={<ExperimentOutlined style={iconStyle}/>}  
                        headStyle={{ color: '#0E5F76'}}
                    >
                        <p>Number of vaccinations administered yesterday</p>
                        <div style={cardDiv}/>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default HomepageDesktop;
