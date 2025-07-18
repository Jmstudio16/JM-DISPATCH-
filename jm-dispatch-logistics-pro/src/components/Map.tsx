import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import { useEffect, useState } from "react";

interface Props {
  origin: string;
  destination: string;
}

export default function Map({ origin, destination }: Props) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!origin || !destination) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Erreur itinéraire :", status);
        }
      }
    );
  }, [origin, destination]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ height: "400px", width: "100%" }}
        center={{ lat: 25.774, lng: -80.19 }} // Position par défaut (Miami)
        zoom={5}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
}
