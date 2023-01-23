import React, { useState, useRef } from 'react';
import { useQuery } from 'react-query'

function Grid() {
  const [gridData, setGridData] = useState([]);
  const imageRef = useRef(null);

  const { data, status } = useQuery('drones', async () => {
    const response = await fetch('/api/drones');
    const data = response.json();
    return data
  }, {
    refetchInterval: 2000,
    onSuccess: (data) => {
      setGridData(data);
    }
  });

  const gridPositions = (gridData) => {
    return gridData.map((drone, index) => {
        const posX = (drone.positionX * (imageRef.current.clientWidth / 500000));
        const posY = (drone.positionY * (imageRef.current.clientHeight / 500000));
        const distance = (Math.sqrt(Math.pow(drone.positionX - 250000, 2) + Math.pow(drone.positionY - 250000, 2))) / 1000;
        const color = distance <= 100 ? 'red' : 'white'
        return (
          <img
            key={index}
            src={`/${color}.svg`}
            alt={`${color} drone`}
            className={`drone drone-${drone.serial_number}`}
            style={{ position: 'absolute', left: posX + 'px', top: posY + 'px', maxWidth: '5%', maxHeight: '5%' }}
          />
        )
      })
  }

  return (
    <div className='grid'>
      <img ref={imageRef} src='/Grid.png' alt='grid' className='image' />
      <div>
        {gridPositions(gridData)}
      </div>
    </div>
  );
}

export default Grid;