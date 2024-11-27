import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import logo from "../assets/logo.png";
import "./Reset.css";

const Reset = () =>{
    const [resetDetails, setResetDetails] = useState({
        email: '',
        securityQuestion: '',
        securityAnswer: ''
    });
    const navigate = useNavigate();
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setResetDetails(prev => ({...prev, [name]:value}));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try{
            const response = await fetch('http://localhost:8080/verifySecurity', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(resetDetails)
            });
            const data = await response.json();
            if(response.ok){
                navigate('/passwordUpdate', {state: {email: resetDetails.email}});
            } else {
                alert(data.error);
            }
        } catch(error){
            console.error('Error during security verification:', error);
            alert('Failed to verify security details');
        }
    };

    return(
        <div className = "reset-container">
            <div className="reset-logo">
                <img src={logo} alt = "TritonCircles Logo"/>
                <h1>TritonCircles</h1>
            </div>
            <form onSubmit = {handleSubmit}>
                <input type="email" name="email" placeholder= "Email" value={resetDetails.email} onChange={handleChange} required />
                <select name="securityQuestion" value={resetDetails.securityQuestion} onChange={handleChange} required>
                    <option value="">Select a Security Question</option>
                    <option value="What is the name of your first childhood pet?">What is the name of your first childhood pet?</option>
                    <option value="What was the first concert you attended?">What was the first concert you attended?</option>
                    <option value="What city were you born in?">What city were you born in?</option>
                    <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                    <option value="What is your high school mascot?">What is your high school mascot?</option>
                    <option value="What is your childhood nickname?">What is your childhood nickname?</option>
                </select>
                <input type="text" name="securityAnswer" placeholder= "Security Answer" value = {resetDetails.securityAnswer} onChange={handleChange} required/>
                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default Reset;