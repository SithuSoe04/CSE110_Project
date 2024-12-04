import React, {useState, useEffect} from "react";
import "./Profile.css";
import defaultImage from "../assets/profile.jpeg";
import editIcon from "../assets/edit.png";
import edit1Icon from "../assets/edit1.png";
import checkIcon from "../assets/check.png";
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

interface Interest{
    id: number;
    interest: string;
}

const Profile = () => {
    const [profileImage, setProfileImage] = useState<string>(defaultImage);
    const [bio, setBio] = useState<string>("This is your bio.");
    const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [newInterest, setNewInterest] = useState<string>("");
    const [isAddingInterest, setIsAddingInterest] = useState<boolean>(false);
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        name: '',
        major: '',
        college: '',
        year: '',
        minor: '',
        bio: "This is your bio."
    });

    useEffect(() => {
        if(!isAuthenticated){
            navigate('/login');
            return;
        }
        const fetchProfileData = async () => {
            const user_id = localStorage.getItem('user_id');
            try{
                const response = await fetch(`http://localhost:8080/user?user_id=${user_id}`);
                const data = await response.json();
                if(response.ok){
                    setProfileData(data);
                    if(data.profile_pic){
                        setProfileImage(data.profile_pic);
                    }
                }
                else{
                    throw new Error(data.message);
                }
            }
            catch(error){
                console.error('Failed to fetch profile data:', error);
            }
        };
        const fetchInterests = async () => {
            const user_id = localStorage.getItem('user_id');
            const response = await fetch(`http://localhost:8080/getInterests?user_id=${user_id}`);
            if (response.ok){
                const data: Interest [] = await response.json();
                setInterests(data);
            }else{
                const errorData = await response.json();
                console.error('Failed to fetch interests:', errorData.error);
            }
        }
        fetchProfileData();
        fetchInterests();
    }, [navigate, isAuthenticated]);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("File input changing.");
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            console.log("File selected:", file.name);
            const user_id = localStorage.getItem('user_id');
            if (!user_id){
                alert("User not properly identified, please log in again.");
                return;
            }
            formData.append('user_id', user_id);
            formData.append('profileImage', file);

             const response = await fetch('http://localhost:8080/uploadProfilePic', {
                method: 'POST', 
                body: formData,
            })
            .then(response => response.json())
            .then(data=>{
                if(data.filepath){
                    setProfileImage(data.filepath);
                }
            })
            .catch(error=> console.error('Error uploading image:', error));
        }
    };

    const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData(prevData => ({...prevData, bio: event.target.value}));
    };

    const saveBio = async () => {
        const user_id = localStorage.getItem('user_id');
        try{
            const response = await fetch (`http://localhost:8080/updateBio`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({user_id, bio: profileData.bio})
            });
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update bio');
            }
            const result = await response.json();
            console.log('Bio updated successfully:', result.message);
            setProfileData(prevData => ({...prevData, bio: profileData.bio}));
            setIsEditingBio(false);
        }catch(error){
            console.error('Error saving bio: error');
        }
    }

    const toggleEditBio = () => {
        setIsEditingBio(!isEditingBio);
    };

    const addInterest = async () => {
        if(newInterest.trim() !== ""){
            const user_id = localStorage.getItem('user_id');
            const response = await fetch('http://localhost:8080/addInterest', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user_id, interest: newInterest.trim()})
            });
            if(response.ok){
                const newInterestData: Interest = await response.json();
                setInterests(prevInterests => [...prevInterests, newInterestData]
                );
                setNewInterest("");
            } else{
                console.error('Failed to add interest');
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            addInterest();
        }
    };

    const toggleAddInterest = () => {
        setIsAddingInterest(!isAddingInterest);
    };

    const removeInterest = async (index:number) => {
        const interestId = interests[index].id;
        const response = await fetch('http://localhost:8080/removeInterest', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: interestId})
        });
        if (response.ok){
            setInterests(current => current.filter((_, i)=> i !== index));
        }else{
            console.error('Failed to remove interest');
        }
    };

    return (
        <div className = "profile-container"> 
            <div className = "profile-header">
                <div className = "profile-avatar">
                    <img src = {`${profileImage}?${new Date().getTime()}` || defaultImage} alt="Profile" className = "profile-image"/>
                    <label htmlFor = "profile-image-upload" className = "upload-label">
                        <img src={edit1Icon} alt="Edit Profile Picture" title = "Click to change profile picture." className = "edit-icon" style={{cursor: 'pointer'}}/>
                    </label>
                    <input 
                            type = "file"
                            accept = "image/*"
                            onChange = {handleImageChange}
                            className = "upload-image"
                            style = {{display:'block', opacity: 0}}
                        />
                </div>
                <div className = "profile-info">
                    <h2>{profileData.name}</h2>
                    <div className = "bio-section">
                        {isEditingBio ? (
                            <>
                                <input 
                                    type ="text"
                                    value={profileData.bio}
                                    onChange={handleBioChange}
                                    className = "bio-input"
                                    placeholder = "Enter your bio"
                                />
                                <img 
                                    src={checkIcon}
                                    alt = "save"
                                    onClick = {saveBio}
                                    className = "icon_save"
                                />
                            </>
                        ) : (
                            <>
                                <p className = "bio-text"> {profileData.bio} </p>
                                <img 
                                    src = {editIcon}
                                    alt = "edit"
                                    onClick = {toggleEditBio}
                                    className = "icon_edit"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className = "profile-details">
                <div className ="profile-detail">
                    <img title = "Major" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAASpJREFUaEPtWVsOwkAIpCdTT6aeTG+mkmhiaLOdzmJLzexPf2CZB9RYBtv5GXaO30RgawdRB45mdjYzf655rq9il1ZBhMBtA+AR8+mF4T5FZI5ABfCO28E7idFpEXDrvG0qnBQCs/2YzPQR7psUu+UAdEEy6O/roPoi8A8ORKtZTrEbVmshEXhbJgdi70I9yDY8kAfV12sUUJINkQOQAqy8QB5UXzMAKMmGyAFIAVZeIA+qrxkAlGRD5ACkACsvkAfV1wwASrIhciDrryLrQMzr/i6UBYS9RwRY5bLyuh1Y+9soRLzy70A3gbgbmNslQAWzg1qgIoHdtZDvw5xElbN4iB14lRWTY6EIVHKBIvBpH9+XHTbeVnYRqDIHIxwlX41L1BKBJWr9IvYJHqNLMSW9rb4AAAAASUVORK5CYII="/>
                    <h3>{profileData.major}</h3>
                </div>
                <div className ="profile-detail">
                    <img title = "College" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAVRJREFUaEPtmeEOgjAMhMeb6ZOpT6ZvpoxIYnTsOr4OJOl+kTRX7q7dUtiQDr6Gg/NPIWDvCtIKnFJKl7eI/Oy9bmPCay0pFfD0ZryQ75xSepRiREB2Zna/t45MPov4WUTAVu5n0psIIGaUzP02qJifvNT0AtBbpvwh4MNhYsZftpBqARqfRBPXKAGKDwHUQYrvXgFwgk5QJTAEmBwCZTDl73kKAe5+LUTn/do8rxxWcdMe8Jo4S/O8IqjiUoDnvF8ahxVBFZcCvNxfmucVQRVvFtC64U0EKjvdhK+RMiWgBCg+BFAHKZ5UQLVY7zjexL0JqvwhQDnUO44roIY1JcAFTzaxC4E9T6EQIBwwtWC0EO1hio8KUAcpvqUC6tTpHW++H/D8IvMQ1yzgPl7t9Lh5XCNm1RXT/EtlbxGZfP49435LucZJd0zrh7o7AZowBFAHKf4FgzZ3McK7OekAAAAASUVORK5CYII="/>
                    <h3>{profileData.college} College</h3>
                </div>
                <div className = "profile-detail">
                    <img title = "Year" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAl5JREFUaEPtmUtOxDAMhj0bVqy4EHAguAKw4QIcCDgQrFixAX4pRiF1/EjczlSiEqqY1vH/2c6zB9r5ddi5fvoHOHYGMzNwVWDuKij+7aX89lru91ngGQAQc0lELNarDVAAmoKZAYDjOtpe4dJ7D6MgIwCI9POMWsU2DBIFyIx6jyMEEQHYQjxDuSG8AFuKD0F4AI4h3g1hARxTPENc/wzRPI8s+o0F8LXSaBNttqtTAziF6JulpAGcSvQZQtTaA8iOPmoYQyOuup4xKeLPM6OLQ2sPADNtvbaB0+hah8XCcbcTVp3BChraQIf+c/UA2vLh9ywn3DhH3CO81aT5WIxIEkDbgJQ6aQXKYr0Rt0YiCSQNwHKe9byFWJSRlIG2/rWJ5JyIzoraTyL6cCr32rUr31SAi7KGvymin8r/7wZExG4IoNeBa12I4CMRsXh+BohbBWDETtUjlZAHAFF86wjVJscRuzCApw+MCAFv1G6ohDwAI6UAgKjdagAcTQxza3Zic06S6tWkdg6VGa+lAECItW/IECu1YQ4o3sWcuitaSb05C2uRldYhW2ehjX5oOQ04VwMbRb8b7OiWcotSkk7+uudEVllI28q1ISSfQ5t6pE2KhrgzSigl3lq2Oz/1lM7KAHT1dkiZmegdGJtHjB4ADcJ04MhML0Cutr0AGgSeuZw1MNoxvbu9CIAFwSC48/6Y73Vd4whFO+Fwix9dInhPJhzVs3gl3K+iGag9ZoKEol6LmAHgdnb7kU8qEf7iiK+WPI/UfULqJyOl9muTkYEpAbPG/wCzEZy1330GvgGvVp4x5fqrZgAAAABJRU5ErkJggg=="/>
                    <h3>{profileData.year}-Year Student</h3>
                </div>
                <div className = "profile-detail">
                    <img title = "Minor" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAARBJREFUaEPtmUEWwiAMRNOTqSdTT6Y30+a9uqEVhtKR4Bs23aTpzHzogkw2+JoG128y0JsgSuBsZlcz8+cv133+2C33QcTAo4PwVPNl1vDcMlIyEEG863bxbmK1cgYcnW+bKGtT618beEWJftFRTUAGDiZII1D6k6E+SsRl4FuSIrAk020LoXu8tY52BlqFoe/LAJoUq04EWMmifUUATYpVJwKsZNG+IoAmxaoTAVayaF8RQJNi1YkAK1m0rwigSbHqmgkU7+pZynN9c1ci6S3BUdcnh/rMiUpnA8MbGG4L+TzMKURZ1YfYhUcZMbmWXQYiUdhl4LN9fF526jytbDIQ5RysdIT8NdakJQM1aTFq349mMTGBy/vUAAAAAElFTkSuQmCC"/>
                    <h3>{profileData.minor}</h3>
                </div>
            </div>
            <div className ="profile-section">
                <h3>Interests</h3>
                <div className = "interests-container">
                    {interests.map((interest: Interest, index: number) => (
                        <span key={interest.id} className = "interest-tag" onClick={()=> removeInterest(index)}> 
                            {interest.interest} 
                            <span className = "remove-tag" onClick ={(e) => {
                                e.stopPropagation();
                                removeInterest(index);
                            }}>x</span>
                        </span>
                    ))}
                    {isAddingInterest && (
                        <input 
                        type="text"
                        value={newInterest}
                        onChange={(e : React.ChangeEvent<HTMLInputElement>)=> setNewInterest(e.target.value)}
                        onKeyDown = {handleKeyDown}
                        className="interest-input"
                        placeholder = "Add new interest"
                        />
                    )}
                    
                    <button onClick = {toggleAddInterest} className ="add-interest"> + </button>
                </div>
            </div>
            {/* <div className = "profile-section">
                <h3>Clubs</h3>
                <div className = "clubs-container">
                    <div className = "club-card">
                        <div className = "club-icon"></div>
                        <p>Club</p>
                    </div>
                    <div className = "club-card">
                        <div className = "club-icon1"></div>
                        <p>Club</p>
                    </div>
                    <div className = "club-card">
                        <div className = "club-icon2"></div>
                        <p>Club</p>
                    </div>
                    <div className = "club-card">
                        <div className = "club-icon3"></div>
                        <p>Club</p>
                    </div>
                    <div className = "club-card">
                        <div className = "club-icon4"></div>
                        <p>Club</p>
                    </div>
                    <div className = "club-card">
                        <div className = "club-icon5"></div>
                        <p>Club</p>
                    </div>
                    <div className = "club-card">
                        <div className = "club-icon6"></div>
                        <p>Club</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default Profile;