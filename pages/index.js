import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import List from './Components/List';
import Grid from './Components/Grid'


const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL
)


const Index = () => {

  const [drones, setDrones] = useState([])

  useEffect(() => {
    // Load initial data
    supabase
      .from('drones')
      .select('*')
      .order('last_seen', { ascending: false })
      .then((response) => {
        setDrones(response.data)
      });
    // Subscribe to real-time updates
    const channel = supabase
      .channel('public:drones')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drones' }, payload => {
        switch (payload.event) {
          case 'INSERT':
            setDrones((prevData) => [...prevData, payload.data]);
            break;
          case 'UPDATE':
            setDrones((prevData) =>
              prevData.map((violation) =>
                violation.serial_number === payload.data.serial_number
                  ? payload.data
                  : violation
              )
            );
            break;
          case 'DELETE':
            setDrones((prevData) =>
              prevData.filter((violation) => violation.serial_number !== payload.old_data.serial_number)
            );
            break;
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [drones]);

  return (
    <div>
      <div className="description">
        <h2>Welcome to the official website of the Monadikuikka Preservation Agency.</h2>
        <p>We're committed to protecting the Monadikuikka species.</p>
        <p>To ensure the safety of the local Monadikuikka population, we've set up a no drone zone (NDZ) within 100 meters of the nest. We're using state-of-the-art monitoring equipment to track offenders and publicly display their personal information for 10 minutes.</p>
      </div>
      <div className="container">
        <div>
          <p className='titles'>Latest Violations</p>
          <List drones={drones} />
        </div>
        <div className='slide-in-right'>
          <p className='titles'>Live Monitoring</p>
          <div className='info'>          
            <p>
            Drones violating the NDZ are colored in Red.
            </p>
          </div>

          <Grid drones={drones} />
        </div>
      </div>
    </div>
  );


}

export default Index