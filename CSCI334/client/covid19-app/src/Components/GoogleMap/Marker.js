import { Avatar } from 'antd';

export const Marker = props => {
    const markerColour = props.props.markerColour;
    const letter = props.props.userLetter;
    return <Avatar style={{backgroundColor: markerColour}} size={20}><b>{letter}</b></Avatar>
} 

