const cron = require('node-cron');
import axios from 'axios';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  async function storeData(drone, pilot) {
    try {
      const existingDrone = await supabase.from('drones').select('*').where({ serial_number: drone.serialNumber });
      const distance = Math.round(Math.sqrt(Math.pow(drone.positionX - 250000, 2) + Math.pow(drone.positionY - 250000, 2)) / 1000);
      const data = {
        serial_number: drone.serialNumber,
        position_x: parseFloat(drone.positionX),
        position_y: parseFloat(drone.positionY),
        distance: distance,
        first_seen: new Date(pilot.createdDt).toISOString(),
        pilot_id: pilot.pilotId,
        first_name: pilot.firstName,
        last_name: pilot.lastName,
        phone_number: pilot.phoneNumber,
        email: pilot.email,
      }
  
      if (existingDrone.length > 0) {
        await supabase.from('drones').update(data).where({ serial_number: drone.serialNumber });
        
      } else {
        await supabase.from('drones').insert(data);
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
