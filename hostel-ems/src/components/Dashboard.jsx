import RoomCard from './UI/RoomCard';

export default function Dashboard() {
  const roomData = { /* ... your data ... */ };

  return (
    <div>
      <RoomCard 
        room={roomData} 
        light={roomData.light} 
        fan={roomData.fan} 
        delay={0.1}
      />
    </div>
  );
}