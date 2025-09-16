import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './FantasyPage.css';
import { toast } from 'react-toastify';
import Footer from '../../components/Footer/Footer';

const FantasyPage = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversResponse, teamsResponse] = await Promise.all([
          fetch('/data/drivers.json'),
          fetch('/data/teams.json')
        ]);
        const driversData = await driversResponse.json();
        const teamsData = await teamsResponse.json();
        setDrivers(driversData);
        setTeams(teamsData);
      } catch (error) {
        console.error("Data loading error:", error);
      }
    };
    fetchData();
  }, []);

  const handleDriverSelect = (driverId) => {
    setSelectedDriver(driverId);
    if(selectedDriver === driverId){
      setSelectedDriver(null)
    }    
    console.log(drivers);
    console.log(user.id);
    
    console.log('Selected driver:', driverId);
  };

  const handleTeamSelect = (teamId) => {
    setSelectedTeam(teamId);
    if(selectedTeam === teamId){
      setSelectedTeam(null)
    }
    console.log('Selected team:', teamId);
  };

  async function handleSaveSelection(){
    if (selectedDriver && selectedTeam) {
      try {
        const foundDriver = drivers.find((el)=> el.id === selectedDriver);
        const foundTeam = teams.find((el)=> el.id === selectedTeam);
        console.log(foundDriver);
        console.log(foundTeam);  
        const res = await axios.post(`/api/users/favorite`, {
          userId: user.id,
          favoriteDriver: {
            id: foundDriver.id,
            name: foundDriver.name,
            team: foundDriver.teamId,
            avatar: foundDriver.image
        }, favoriteTeam: {
          id: foundTeam.id,
          name: foundTeam.name,
          logo: foundTeam.image
        }})
        toast.success(res.data.message)
      } catch (error) {
        
      }
    } else {
      toast.error('Please select both a driver and a team')
    }
  }

  

  return (
    <>
    <div className="fantasy-container">
      {/* Drivers */}
      <section className="drivers-section">
        <h2>2025 DRIVER LINEUP</h2>
        <p className="section-subtitle">Select your favorite driver and team to build your ultimate Formula 1 profile. Your choices will be displayed on your personal dashboard and used for personalized content throughout the platform.</p>
        <div className="drivers-grid">
          {drivers.map(driver => (
            <div 
              key={driver.id}
              className={`driver-card ${selectedDriver === driver.id ? 'selected' : ''}`}
              onClick={() => handleDriverSelect(driver.id)}
            >
              <div className="driver-image-container">
                <img 
                  src={driver.image} 
                  alt={driver.name}
                  className="driver-photo"
                />
                <div className="driver-number">#{driver.number}</div>
              </div>
              <div className="driver-info">
                <h3>{driver.name}</h3>
                <p className="driver-team">{teams.find(team => team.id === driver.teamId)?.name}</p>
                <p className="driver-country">{driver.country}</p>
              </div>
              {selectedDriver === driver.id && (
                <div className="selection-badge">✓</div>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* Teams */}
      <section className="teams-section">
        <h2>CONSTRUCTORS CHAMPIONSHIP</h2>
        <p className="section-subtitle">Select your preferred constructor team - this choice will be featured in your profile and used for team-based analytics</p>
        <div className="teams-grid">
          {teams.map(team => (
            <div 
              key={team.id}
              className={`team-card ${selectedTeam === team.id ? 'selected' : ''}`}
              onClick={() => handleTeamSelect(team.id)}
            >
              <img 
                src={team.image} 
                alt={team.name}
                className="team-logo"
              />
              <div className="team-info">
                <h3>{team.name}</h3>
                <p className="team-principal">Team Principal: {team.principal}</p>
                <p className="team-car">Chassis: {team.car}</p>
                <p className="team-country">Based in: {team.country}</p>
              </div>
              {selectedTeam === team.id && (
                <div className="selection-badge">✓</div>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* Selection Actions */}
      <div className="selection-actions">
        <div className="selection-summary">
          {selectedDriver && selectedTeam ? (
            <p className="summary-text">
              Your selection: <strong>{drivers.find(d => d.id === selectedDriver)?.name}</strong> with <strong>{teams.find(t => t.id === selectedTeam)?.name}</strong>
            </p>
          ) : (
            <p className="summary-text">Select both a driver and team to complete your profile configuration</p>
          )}
        </div>
        <button 
          className="save-button"
          onClick={handleSaveSelection}
          disabled={!selectedDriver || !selectedTeam}
        >
          SAVE TO PROFILE
        </button>
        <p className="selection-note">
          Your choices will be visible on your public profile and used for personalized content recommendations. You can update your selection at any time.
        </p>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default FantasyPage;