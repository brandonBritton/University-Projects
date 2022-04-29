import { CheckOutlined } from '@ant-design/icons';
import { formatDate } from '../../_helpers/sharedFunctions';

const CheckedIn = props => {
    const date = props.date;
    const businessName = props.businessName;

    return(
        <div>
            <div style = {{textAlign: 'center'}}>
                <h1 style = {{fontSize: '1.8rem', color: '#0E5F76'}}>{businessName} <CheckOutlined style={{fontSize: '30px', color: 'green'}} /></h1>
                <div style = {{fontSize: '1.2rem'}}> <b>Checked in: </b> {`${formatDate(date)} at ${date.getHours()}:${date.getMinutes()}`}</div>
                <div style = {{fontSize: '1.2rem', paddingTop: "1%"}}>{`You can show this page to the venue operator if required`}</div>
            </div>
        </div>
    );
}

export default CheckedIn;