# Project Birdnest

This is my solution to Reaktor's 2022 Summer Trainee assignment. The complete assignment brief can be found [here](https://web.archive.org/web/20221220105911/https://assignments.reaktor.com/birdnest/).
This repository is the front-end of the project. The backend repository is available [here](https://github.com/post-opulence/birdnest-backend). 
The frontend is hosted on Vercel and is available at : https://monadikuikka-gamma.vercel.app/

## Description

The frontend is built using Next.js 13. The two main components here are the Pilots list and the "live" 2D image of the drones positions.
The list is built with AntD and the data is fetched in real-time from the database using Supabase client API. 
The "live" map renders each drone on a different color based on its last known position. It then transitions for 2 seconds to the drones new position. 
Data for the map is fetched every 2 seconds using react-query as the database only stores drones violating the No Drone Zone (NDZ). The map displays all the drones, not just the ones found violating it. This can be simply fixed by storing every drone's data on the database. However, since I'm using Supabase' free tier, I chose to limit the amount of data I stored. 

## Dependencies

    react-query
    axios
    antd
    date-fns

## Run locally 

Clone the repository

```git clone https://github.com/post-opulence/birdnest.git```

Install the dependencies

```npm install```

Create a .env file in the root directory with the correct credentials:

```
NEXT_PUBLIC_SUPABASE_URL=[supabaseURL],
NEXT_PUBLIC_SUPABASE_ANON_KEY=[yourKEY]
```

Run the app

```npm run dev```



