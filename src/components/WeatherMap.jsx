import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function WeatherMap({ lat, lon }) {
  if (!lat || !lon) return <p>Loading map...</p>;

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={13}
      style={{ height: "300px", width: "100%", borderRadius: "10px" }}
    >
      {/* 🌍 Map Tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 📍 User Marker */}
      <Marker position={[lat, lon]}>
        <Popup>You are here 📍</Popup>
      </Marker>
    </MapContainer>
  );
}

export default WeatherMap;