import axios from 'axios'
import { XMLParser } from 'fast-xml-parser';
import { createClient } from '@supabase/supabase-js'
var cron = require('node-cron'); 

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  


export default async function drones(req, res) {
    
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
      
    // This function fetches the drone data from the Reaktor API, parses it into JSON and then sorts it. 
    async function fetchDrones() {
        const xmlData = await axios.get('https://assignments.reaktor.com/birdnest/drones', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/xml'
            }
        });
        // Use fast-xml-parser to parse the XML data into JSON
        const parser = new XMLParser();
        const parsedData = parser.parse(xmlData.data)
        return parsedData.report.capture.drone
    }

    async function fetchPilot(serialNumber) {
        const pilot =  axios.get(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`, {
             headers: {
                 'Access-Control-Allow-Origin': '*',
                 'Content-Type': 'application/json'
             }
         })
         console.log(pilot)
         return pilot
     }

     cron.schedule('*/2 * * * * *', async () => {
    try {
        const drones = await fetchDrones();
        console.log(drones)
        const violatingDrones = drones.filter(drone => {
            const distance = (Math.sqrt(Math.pow(drone.positionX - 250000, 2) + Math.pow(drone.positionY - 250000, 2)))/1000;
            if (distance <= 100) {}
            return distance <= 100;
        })
        for (let drone of violatingDrones) {
            const serialNumber = drone.serialNumber
            const pilot = await fetchPilot(serialNumber);
            storeData(drone, pilot);
        }
        //Return an object containining drones and violatingDrones 
        res.status(200).send({ drones: drones, violatingDrones: violatingDrones })
    }
    catch (error) {
        return res.status(404).send('Drone data not found.')
    }
})
}
