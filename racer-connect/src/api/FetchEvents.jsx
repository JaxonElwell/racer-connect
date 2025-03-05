import {useEffect, useState} from "react";
import axios from 'axios';

const FetchEvents = () => {
    const [Events, setEvents] = useState([]);
    
    useEffect(() => {
        axios.get('/api/Events')
            .then(response => {
                setEvents(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching Events:', error);
            });
    }, []);

    return Events;
}

export default FetchEvents