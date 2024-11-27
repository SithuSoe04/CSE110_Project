import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import logo from "../assets/logo.png";
import "./PasswordUpdate.css";

const PasswordUpdate = () => {
    const[newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
    const {state} = useLocation();
    const {email} = state;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try{
            const response = await fetch('http://localhost:8080/updatePassword', {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, newPassword})
            });
            if(response.ok){
                alert('Password updated successfully');
                navigate('/login');
            } else{
                const errorData = await response.json();
                alert(errorData.error);
            }
        }catch(error){
            console.error('Error updating password:', error);
            alert('Failed to update password');
        }
    };

    return(
        <div className="password-container">
            <div className="password-logo">
                <img src={logo} alt = "TritonCircles Logo"/>
                <h1>TritonCircles</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="New Password" value={newPassword} onChange={handleChange} required />
                <button type="submit">Update Password</button>
            </form>
        </div>
    );
};

export default PasswordUpdate;