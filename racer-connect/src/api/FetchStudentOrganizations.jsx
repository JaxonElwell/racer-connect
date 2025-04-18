import {useEffect, useState} from "react";
import axios from 'axios';

const FetchStudentOrganizations = () => {
    const [StudentOrganizations, setStudentOrganizations] = useState([]);
    
    useEffect(() => {
        axios.get('/api/StudentOrganizations')
            .then(response => {
                setStudentOrganizations(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching StudentOrganizations:', error);
            });
    }, []);

    return StudentOrganizations;
}

export default FetchStudentOrganizations