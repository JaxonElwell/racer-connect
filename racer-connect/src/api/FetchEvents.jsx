import {useEffect, useState} from "react";
import axios from 'axios';

const FetchEvents = () => {
    const [Events, setEvents] = useState([]);
    
    useEffect(() => {
        axios.get('http://localhost:5000/api/Events')
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