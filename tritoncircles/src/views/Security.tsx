import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import "./Security.css";
import logo from "../assets/logo.png";
import {useAuth} from '../context/AuthContext';

const Security = () => {
    const [securityData, setSecurityData] = useState({
        securityQuestion: '', 
        securityAnswer: ''
    });
    const navigate = useNavigate();
    const tempId  = localStorage.getItem('tempId');
    const {setIsAuthenticated} = useAuth();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setSecurityData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!tempId){
            console.error('No temporary user ID found');
            return;
        }
        try{
            const response = await fetch('http://localhost:8080/security',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tempId,
                    ...securityData
                })
            });
            if(!response.ok){
                throw new Error ('Failed to update security information');
            }
            console.log('Security info updated successfully');
            const finalizeResponse = await fetch('http://localhost:8080/finalizeSignup', {
                method: 'POST', 
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tempId })
            });
            if(finalizeResponse.ok){
                const finalData = await finalizeResponse.json();
                console.log('User registration finalized successfully', finalData);
                localStorage.setItem('user_id', finalData.user_id);
                setIsAuthenticated(true);
                localStorage.removeItem('tempId');
                navigate('/profile');
            }
            else{
                const errorData = await finalizeResponse.json();
                throw new Error('Failed to finalize registration');
            }
        } catch(error){
            console.error('Error during security update:', error);
        }
    };

    return(
        <div className = "security-container">
            <div className="security-logo">
                <img src={logo} alt = "TritonCircles Logo"/>
                <h1>TritonCircles</h1>
            </div>
            <form onSubmit = {handleSubmit}>
                <select name="securityQuestion" value={securityData.securityQuestion} onChange={handleChange} required>
                    <option value="">Select a Security Question</option>
                    <option value="What is the name of your first childhood pet?">What is the name of your first childhood pet?</option>
                    <option value="What was the first concert you attended?">What was the first concert you attended?</option>
                    <option value="What city were you born in?">What city were you born in?</option>
                    <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                    <option value="What is your high school mascot?">What is your high school mascot?</option>
                    <option value="What is your childhood nickname?">What is your childhood nickname?</option>
                </select>
                <input
                    type="text"
                    name="securityAnswer"
                    placeholder="Answer"
                    value={securityData.securityAnswer}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};
export default Security;