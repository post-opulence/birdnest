import axios from "axios"

export default async function pilot(req, res) {
    const SN = req.query.SN
    async function FetchData() {
       return await axios.get(`https://assignments.reaktor.com/birdnest/pilots/${SN}`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        })
    }    
    try {
       const pilot = await FetchData()
       res.status(200).send(pilot.data)
    }
    catch (error) {
       return res.status(404).send('404: Pilot data not found.')
    }
 }

 //url : http://localhost:3000/api/pilot?serialNumber=SN-oKllF60VOt