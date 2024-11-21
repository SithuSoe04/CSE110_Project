import React, { useState } from 'react';
import "./Signup.css";
import logo from "../assets/logo.png";
import {useNavigate} from 'react-router-dom';

interface SignupData{
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
}

const Signup: React.FC = () => {
    const [userData, setUserData] = useState<SignupData>({email: '', name: '', password: '', confirmPassword: ''});
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        if(userData.password !== userData.confirmPassword){
            setError("Passwords do not match.");
            return;
        }

        console.log("Submitting data:", JSON.stringify(userData));

        try{
            const response = await fetch('http://localhost:8102/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: userData.email, 
                    name: userData.name,
                    password: userData.password
                })
            });
            
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || 'Signup failed');
            }
            const result = await response.json();
            console.log('Signup successful:', result);
            localStorage.setItem('userID', result.userID);
            console.log('Stored userId in localStorage:', localStorage.getItem('userID'));
            navigate('/signup-info');
        }catch (error){
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className ="signup-container">
            <div className = "signup-logo">
                <img src={logo} alt="TritonCircles Logo" />
                <h1>TritonCircles</h1>
            </div>
            <form onSubmit = {handleSubmit}>
                <div>
                    <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleInputChange} required />
                </div>
                <div>
                    <input type="text" name="name" placeholder="Name" value={userData.name} onChange={handleInputChange} required />
                </div>
                <div>
                    <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleInputChange} required />
                </div>
                <div>
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" value={userData.confirmPassword} onChange={handleInputChange} required />
                </div>
                {error && <div className = "error">{error}</div>}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};
export default Signup;