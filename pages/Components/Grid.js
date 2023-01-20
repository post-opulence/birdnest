import React, {  useState, useRef } from 'react';
import { useQuery } from 'react-query'

function Grid() {
  const [gridData, setGridData] = useState([]);
  const imageRef = useRef(null);

  const { data, status } = useQuery('drones', async () => {
    const response = await fetch('/api/drones');
    const data = await response.json();
    return data
  }, {
    refetchInterval: 2000,
    onSuccess: (data) => {
      setGridData(data.drones);
    }
  });

  return (
    <div className='grid'>
      <img ref={imageRef} src='/Grid.png' alt='grid' className='image' />
      <div>
        {gridData.map((drone, index) => {
          let posX = (drone.positionX * (imageRef.current.clientWidth / 500000));
          let posY = (drone.positionY * (imageRef.current.clientHeight / 500000));
          let distance = (Math.sqrt(Math.pow(drone.positionX - 250000, 2) + Math.pow(drone.positionY - 250000, 2))) / 1000;
          if (distance <= 100) {
            return (
              <img
                key={index}
                src='/red.svg'
                alt='drone'
                className={`drone drone-${drone.serial_number}`}
                style={{ position: 'absolute', left: posX + 'px', top: posY + 'px', maxWidth: '5%', maxHeight: '5%' }}
              />
            )
          } else {
            return (
              <img
                key={index}
                src='/white.svg'
                alt='drone'
                className={`drone drone-${drone.serial_number}`}
                style={{ position: 'absolute', left: posX + 'px', top: posY + 'px', maxWidth: '5%', maxHeight: '5%' }}
              />
            )
          }
        })}
      </div>
    </div>
  );

}

export default Grid;