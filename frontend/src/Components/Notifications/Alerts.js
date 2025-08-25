import axios from 'axios';
import React, { useEffect, useState } from 'react';
import API_URL from '../../Config';
import Sidebar from '../Sidebar/Sidebar';

const Alerts = () => {
    const userId = localStorage.getItem("userId");
    const [alerts, setalerts] = useState({});
    const fetchalerts = async () => {
        try {
            const res = await axios.get(`${API_URL}api/user/getAlerts/${userId}`);
            setalerts(res.data);
            console.log('this is get alert ', alerts);

        } catch (error) {
            console.log('Error fetching actor data', error);
        }
    };
    useEffect(() => {
        fetchalerts();

    }, []);
    const rendernotification = (notification) => {
        return <div>
            <div className="alerts-content">
                <p className='content'>{notification.type}    :    {notification.content}</p>
            </div>
        </div>
    };
    return (
        <div className='alerts-container'>
            <Sidebar />

            <div className="noti-header">
                <h1 className='heading'>Todays Alerts</h1>
            </div>
            {/* <h2>{JSON.stringify(alerts)}</h2> */}
            {alerts?.alerts?.map((notification) => rendernotification(notification))}
            {/* <div className="notification-text">{Notification}</div> */}
            <p className='content'>Cake Count = {alerts.cakeCount}    :    StarCount = {alerts.starCount}</p>
            <style jsx>{`  
         .alerts-container {
            margin-left : 200px;
        }
            .noti-header {
 display: flex;
  align-items: center;
  padding: 15px;
  margin-top: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  background-color: #e8f5e9;
}
  .heading{
  color: #555;
  align-items: center;
  }
  .content{
  color: #555;
  display: flex;
  align-items: center;
  padding: 15px;
  margin-top: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  background-color: #e8f5e9;
  font-size: 25px;
  }

            `}</style>
        </div >
    );
}
export default Alerts;