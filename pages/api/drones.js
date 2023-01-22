import axios from 'axios'
import { XMLParser } from 'fast-xml-parser';

export default async function drones(req, res) {
    try {
        const xmlData = await axios.get('https://assignments.reaktor.com/birdnest/drones', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/xml'
            }
        });
        const parser = new XMLParser();
        const parsedData = parser.parse(xmlData.data)
        res.status(200).send(parsedData.report.capture.drone)
    }
    catch (error) {
        return res.status(404).send('Drone data not found.')
    }
}
