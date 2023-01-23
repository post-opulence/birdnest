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
        if(error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            console.log(error.request);
            res.status(500).send(error.request);
        } else {
            console.log('Error', error.message);
            res.status(500).send(error.message);
        }
        console.log(error.config);
    }
    
}
