import axios from 'axios'
import { XMLParser } from 'fast-xml-parser';

// This function fetches the drone data from the Reaktor API, parses it into JSON and then sorts it. 
export default async function drones(req, res) {
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
    try {
        const drones = await fetchDrones()
        // Sort drones by calculating the distance to the nest
        const violatingDrones = drones.filter(drone => {
            const distance = (Math.sqrt(Math.pow(drone.positionX - 250000, 2) + Math.pow(drone.positionY - 250000, 2)))/1000;
            if (distance <= 100) {}
            return distance <= 100;
        });
        //Return an object containining drones and violatingDrones 
        res.status(200).send({ drones: drones, violatingDrones: violatingDrones })
    }
    catch (error) {
        return res.status(404).send('Drone data not found.')
    }
}
