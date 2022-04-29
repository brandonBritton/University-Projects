import { useEffect, useState } from 'react';
import { useViewport } from '../../_helpers/viewPort'; 
import HomepageDesktop from './HomepageDesktop';
import HomepageMobile from './HomepageMobile';
import { _getHomepageStats } from '../../_helpers/endPoints';
import SydneyImage from '../../Assets/Images/Sydney.jpg';
import BrisbaneImage from '../../Assets/Images/Brisbane.jpg';
import MelbourneImage from '../../Assets/Images/Melbourne.jpg';
import ImageNotFound from '../../Assets/Images/image-not-found.jpg';
import { Carousel, Spin } from 'antd'; 
import { contentStyle } from './InlineStyles';
import { initStats } from './InitialStats';
import Printable from './Printable';
import { formatDate } from '../../_helpers/sharedFunctions';

const Homepage = () => {
    const breakpoint = 900;
    const { width } = useViewport();
    const [statistics, setStatistics] = useState(initStats);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [printable, setPrintable] = useState(false);
    const date = new Date();
    const formattedDate = formatDate(date);

    useEffect(() => {
        setLoading(true);

        _getHomepageStats()
        .then(res => {
            setLoading(false);
            setStatistics(res.data.stats);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            setError(true);
        });
    }, []);

    return(
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 className="homepage-main-banner">Home</h1>
            </div>

            {
                printable
                ?
                <div style={{textAlign: 'center'}}>
                    <h1>Australian COVID-19 Statistics: {formattedDate}</h1>
                </div>
                :
                <div>
                    <Carousel autoplay dotPosition="left">
                        <div >
                            <div style={contentStyle}>
                                <img className="homepage-banner-image" src={SydneyImage} alt={ImageNotFound}/>
                            </div>
                        </div>
                        <div>
                            <div style={contentStyle}>
                                <img className="homepage-banner-image" src={BrisbaneImage} alt={ImageNotFound}/>
                            </div>
                        </div>
                        <div>
                            <div style={contentStyle}>
                                <img className="homepage-banner-image" src={MelbourneImage} alt={ImageNotFound}/>
                            </div>

                        </div>
                    </Carousel>

                    <div style={{backgroundColor: "#0E5F76", height: '10px'}}/>
                </div>
            }

            

            {
                loading
                ?
                <div style={{textAlign: 'center'}}>
                    <Spin size='large'/>
                </div>
                :
                error
                ?
                <div style={{textAlign: 'center'}}>Error loading data. Please try refreshing page or contact support. </div>
                :
                printable
                ?
                <Printable {...statistics}/>
                :
                width > breakpoint
                ?
                <HomepageDesktop {...statistics}/>
                :
                <HomepageMobile {...statistics}/>
            }

            <div style={{marginTop: '3%'}}/>

            <div style={{textAlign: 'center'}} className="homepage-section-banner">
                {
                    printable && !loading
                    ?
                    <h3 className="homepage-section-banner-h1">Change view to normal version <u style={{cursor: 'pointer'}} onClick={() => {setPrintable(false); window.scrollTo(0, 0)}}>here</u></h3>
                    :
                    !loading
                    ?
                    <h3 className="homepage-section-banner-h1">Change view to printable version <u style={{cursor: 'pointer'}} onClick={() => {setPrintable(true); window.scrollTo(0, 0)}}>here</u></h3>
                    :
                    <></>

                }
            </div>
        </div>
    );
}

export default Homepage;