import {useEffect, useState} from "react";
import axios from 'axios';

const FetchUsers = () => {
    const [Users, setUsers] = useState([]);
    
    useEffect(() => {
        axios.get('/api/Users')
            .then(response => {
                setUsers(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching Users:', error);
            });
    }, []);

    return Users;
}

export default FetchUsers