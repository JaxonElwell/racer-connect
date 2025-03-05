import {useEffect, useState} from "react";
import axios from 'axios';

const FetchEventAttendees = () => {
    const [EventAttendees, setEventAttendees] = useState([]);
    
    useEffect(() => {
        axios.get('/api/EventAttendees')
            .then(response => {
                setEventAttendees(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching EventAttendees:', error);
            });
    }, []);

    return EventAttendees;
}

export default FetchEventAttendees