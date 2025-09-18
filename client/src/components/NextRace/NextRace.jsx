import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NextRace.css';

const NextRace = () => {
  const [ raceData, setRaceData ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ countdown, setCountdown ] = useState('');
  const [ currentTime, setCurrentTime ] = useState('');
  const [ isExpanded, setIsExpanded ] = useState(false);

  useEffect(() => {
    const fetchNextRace = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.jolpi.ca/ergast/f1/current/next.json');
        const race = response.data.MRData.RaceTable.Races[0];
        setRaceData(race);
      } catch (err) {
        console.error('Error fetching next race:', err);
        setError('Failed to load next race information');
      } finally {
        setLoading(false);
      }
    };

    fetchNextRace();
  }, []);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }));

      if (!raceData) return;
      const raceDateTime = new Date(`${raceData.date}T${raceData.time}`);
      const timeDiff = raceDateTime - now;

      if (timeDiff <= 0) {
        setCountdown('LIVE');
        return;
      }
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setCountdown(`${days} DAY${days > 1 ? 'S' : ''}`);
      } else if (hours > 0) {
        setCountdown(`${hours}H ${minutes}M`);
      } else {
        setCountdown(`${minutes}M`);
      }
    };
    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, [raceData]);

  const formatSessionTime = (dateString, timeString) => {
    const date = new Date(`${dateString}T${timeString}`);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getRaceDates = () => {
    if (!raceData) return '';
    const start = new Date(`${raceData.FirstPractice.date}T${raceData.FirstPractice.time}`);
    const end = new Date(`${raceData.date}T${raceData.time}`);
    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = start.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    if (startDay === endDay) {
      return `${startDay} ${month}`;
    }
    return `${startDay}~${endDay} ${month}`;
  };

  if (loading) {
    return (
      <div className="next-race-compact">
        <div className="next-race-loading">Loading next race...</div>
      </div>
    );
  }

  if (error || !raceData) {
    return (
      <div className="next-race-compact">
        <div className="next-race-error">No race data</div>
      </div>
    );
  }

  return (
    <>
      {/* Black line */}
      <div className="next-race-compact">
        <div className="compact-content">
          <div className="race-info-compact">
            <span className="race-round-compact">Round {raceData.round}</span>
            <span className="race-dates">{getRaceDates()}</span>
            <span className="race-name-compact">{raceData.raceName}</span>
          </div>

          <div className="track-info-compact">
            <span className="track-location">@ {raceData.Circuit.Location.locality}</span>
            <span className="track-name">{raceData.Circuit.circuitName}</span>
          </div>

          <div className="time-info">
            <span className="current-time">MYTIME {currentTime}</span>
            <span className="countdown-compact">{countdown}</span>
            <button 
              className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          </div>
        </div>
      </div>

      {/* Full information */}
      {isExpanded && (
        <div className="next-race-expanded">
          <div className="expanded-content">
            <div className="schedule-full">
              <div className="schedule-header">WEEKEND SCHEDULE</div>
              
              <div className="schedule-item-full">
                <span className="session-type-full">Practice 1</span>
                <span className="session-time-full">
                  {formatSessionTime(raceData.FirstPractice.date, raceData.FirstPractice.time)}
                </span>
              </div>

              <div className="schedule-item-full">
                <span className="session-type-full">Practice 2</span>
                <span className="session-time-full">
                  {formatSessionTime(raceData.SecondPractice.date, raceData.SecondPractice.time)}
                </span>
              </div>

              {raceData.ThirdPractice && (
                <div className="schedule-item-full">
                  <span className="session-type-full">Practice 3</span>
                  <span className="session-time-full">
                    {formatSessionTime(raceData.ThirdPractice.date, raceData.ThirdPractice.time)}
                  </span>
                </div>
              )}

              <div className="schedule-item-full">
                <span className="session-type-full">Qualifying</span>
                <span className="session-time-full">
                  {formatSessionTime(raceData.Qualifying.date, raceData.Qualifying.time)}
                </span>
              </div>

              <div className="schedule-item-full race-session">
                <span className="session-type-full">Race</span>
                <span className="session-time-full">
                  {formatSessionTime(raceData.date, raceData.time)}
                </span>
              </div>
            </div>

            <div className="circuit-info-full">
              <div className="circuit-name-full">{raceData.Circuit.circuitName}</div>
              <div className="circuit-location-full">
                {raceData.Circuit.Location.locality}, {raceData.Circuit.Location.country}
              </div>
              <a 
                href={raceData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="wiki-link"
              >
                Circuit Info
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(NextRace);