import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "./SignupInfo.css";
import logo from "../assets/logo.png";
import {useAuth} from '../context/AuthContext';

const SignupInfo: React.FC =() => {
    const [userInfo, setUserInfo] = useState({
        major: '', college: '', year:'', minor: ''
    });
    const navigate = useNavigate();

    const handleChange= (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const {setIsAuthenticated} = useAuth();
    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const user_id = localStorage.getItem('user_id');
        console.log('Retrieved userID in SignupInfo:', user_id);
        if(!user_id){
            console.error('No user ID found');
            return;
        }
        try{
            const response=await fetch('http://localhost:8080/updateUserInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id,
                    ...userInfo
                })
            });

            if(!response.ok){
                throw new Error ('Failed to update user information');
            }
            setIsAuthenticated(true);
            navigate('/profile');
        } catch(error){
            console.error('Error during information update:', error);
        }
    };

    return(
        <div className = "signup-info-container">
            <div className = "signup-logo">
                <img src={logo} alt="TritonCircles Logo" />
                <h1>TritonCircles</h1>
            </div>
            <form onSubmit = {handleSubmit}>
                <input
                    type="text"
                    name="major"
                    placeholder="Major (ex.Computer Science)"
                    value = {userInfo.major}
                    onChange={handleChange}
                    required
                />
                <select name="college" value={userInfo.college} onChange={handleChange} required>
                    <option value= "">Select College</option>
                    <option value="Eigth">Eighth College</option>
                    <option value="ERC">Eleanor Roosevelt College</option>
                    <option value="Muir">John Muir College</option>
                    <option value="Revelle">Revelle College</option>
                    <option value="Sixth">Seventh College</option>
                    <option value="Sixth">Sixth College</option>
                    <option value="Marshall">Thurgood Marshall College</option>
                    <option value="Warren">Warren College</option>
                </select>
                <select name="year" value={userInfo.year} onChange={handleChange} required>
                    <option value="">Select Year</option>
                    <option value="First">First Year Student</option>
                    <option value="Second">Second Year Student</option>
                    <option value="Third">Third Year Student</option>
                    <option value="Fourth">Fourth Year Student</option>
                </select>
                <input
                    type="text"
                    name="minor"
                    placeholder="Minor (ex.Communication, No Minor)"
                    value = {userInfo.minor}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Done</button>
            </form>
        </div>
    );
};
export default SignupInfo;