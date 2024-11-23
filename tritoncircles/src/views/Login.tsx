import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "./Login.css";
import logo from "../assets/logo.png";
import {useAuth} from '../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({email: '', password: ''});
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setCredentials(prev => ({...prev, [name]:value}));
        setError(null);
    };

    const {setIsAuthenticated} = useAuth();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log('Attempting to log in with:', credentials);
        try{
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }
            const result = await response.json();
            console.log('Login successful:', result);
            localStorage.setItem('user_id', result.user_id);
            setIsAuthenticated(true);
            navigate('/profile');
        }catch(error: any){
            console.error('Error during login:', error.message);
            setError(error.message);
        }
    };

    return(
        <div className = "login_container">
            <div className = "login-logo">
                <img src={logo} alt="TritonCircles Logo" />
                <h1>TritonCircles</h1>
            </div>
            <form onSubmit = {handleSubmit}>
                <input
                    type = "email"
                    name = "email"
                    placeholder = "Email"
                    value={credentials.email}
                    onChange = {handleChange}
                    required
                />
                <input
                    type = "password"
                    name = "password"
                    placeholder = "Password"
                    value={credentials.password}
                    onChange = {handleChange}
                    required
                />
                <button type="submit" className = "login">Log In</button>
                <button type = "button" onClick={() => navigate('/signup')} className ="link">Already have an account?</button>
            </form>
        </div>
    );
};
export default Login; 