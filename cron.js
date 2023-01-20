const cron = require('node-cron');
const axios = require('axios');
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
});

client.connect();

async function storeData(drone, pilot) {
    try {
      const existingDrone = await client.query(`SELECT * FROM drones WHERE serial_number = $1`, [drone.serialNumber]);
      const distance = Math.round(Math.sqrt(Math.pow(drone.positionX - 250000, 2) + Math.pow(drone.positionY - 250000, 2)) / 1000);
      const serial_number = drone.serialNumber;
      const position_x = parseFloat(drone.positionX);
      const position_y = parseFloat(drone.positionY);
      const first_seen = new Date(pilot.createdDt).toISOString();
      const pilot_id = pilot.pilotId
      const first_name = pilot.firstName
      const last_name = pilot.lastName
      const phone_number = pilot.phoneNumber
      const email = pilot.email
      if (existingDrone.rows.length > 0) {
        // The drone is already in the database, so we just need to update the data
        await client.query(`UPDATE drones SET 
                  position_x = $1, 
                  position_y = $2, 
                  distance = $3, 
                  last_seen = now() 
                  WHERE serial_number = $4`, [position_x, position_y, distance, serial_number]);
      } else {
        // The drone is not in the database, so we need to insert it
        await client.query(`INSERT INTO drones (
                  serial_number, 
                  position_x, 
                  position_y, 
                  distance,  
                  first_seen,
                  last_seen,
                  pilot_id,
                  first_name, 
                  last_name,
                  phone_number,
                  email
              ) VALUES ($1, $2, $3, $4, to_timestamp($5,'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'), now(), $6, $7, $8, $9, $10)`, [serial_number, position_x, position_y, distance, first_seen, pilot_id, first_name, last_name, phone_number, email]);  
        }
    } catch (error) {
        console.error(error);
    }
}

// Fetch drone data
const fetchDrones = async () => {
    const { data } = await axios.get('/api/drones');
    return data
}

// Fetch pilot data
const fetchPilots = async (SN) => {
    const {data} = await axios.get(`/api/pilot?SN=${SN}`);
    return data
}

// schedule a task to fetch drone data every 2 seconds
cron.schedule('*/2 * * * * *', async () => {
    const drones = await fetchDrones();
    const violatingDrones = drones.violatingDrones;
    // iterate over violatingDrones and fetch pilot data
    for (let drone of violatingDrones) {
        const SN = drone.serialNumber
        const pilot = await fetchPilots(SN);
        storeData(drone, pilot);
    }
});
