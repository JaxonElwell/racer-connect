import React, {useEffect, useState} from "react";
import axios from 'axios';

const url = 'http://localhost:5000/api/jobs';

const GetStudentOrganizations = () => {
    const [StudentOrganizations, setStudentOrganizations] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/StudentOrganizations')
            .then(response => {
                setStudentOrganizations(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching StudentOrganizations:', error);
            });
    }, []);

    return StudentOrganizations
}

export default DatabaseAPI