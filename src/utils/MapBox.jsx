import Map, { NavigationControl, Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedIndex } from "@/store/locationSlice";

export default function MapBox() {
  const myToken = import.meta.env.VITE_PUBLIC_TOKEN;
  const data = useSelector((state) => state.locations);
  const dispatch = useDispatch();
  const [viewState, setViewState] = useState({
    longitude: 108.2772,
    latitude: 14.0583,
    zoom: 2,
  });

  const handleMarkerClick = useCallback(
    (index) => {
      if (data.selectedIndex === index) dispatch(updateSelectedIndex(null));
      else dispatch(updateSelectedIndex(index));
    },
    [data.selectedIndex, dispatch]
  );

  useEffect(() => {
    if (
      data.goToLocation.latitude != null &&
      data.goToLocation.longitude != null
    ) {
      setViewState({
        latitude: data.goToLocation.latitude,
        longitude: data.goToLocation.longitude,
        zoom: 12,
      });
    }
  }, [data.goToLocation]);

  return (
    <Map
      mapboxAccessToken={myToken}
      {...viewState}
      onMove={(e) => setViewState(e.viewState)}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
    >
      <NavigationControl position="top-right" />
      {data.locations.length != 0 &&
        data.locations.map((location, index) => {
          return (
            <Marker
              latitude={location.location.lat}
              longitude={location.location.lng}
              key={index}
              anchor="bottom"
            >
              <MapPin
                onClick={() => handleMarkerClick(index)}
                className={`cursor-pointer transition active:-translate-y-1 ease-in-out duration-200 w-6 h-6 text-white ${
                  data?.selectedIndex == index
                    ? "fill-[#0BE50B]"
                    : "fill-[#FF0000]"
                }`}
              />
            </Marker>
          );
        })}

      {data.selectedIndex !== null && data.locations[data.selectedIndex] && (
        <Popup
          longitude={data.locations[data.selectedIndex].location.lng}
          latitude={data.locations[data.selectedIndex].location.lat}
          anchor="top"
          onClose={() => dispatch(updateSelectedIndex(null))}
          closeOnClick={false}
          className="!min-w-[12.5rem] !max-w-md text-lg"
        >
          <div className="space-y-2">
            <div className="flex items-baseline">
              <h4 className="font-semibold text-xl text-gray-900 leading-tight mr-4">
                {data.locations[data.selectedIndex].name}
              </h4>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className=" text-gray-900 ml-1">
                {data.locations[data.selectedIndex].rating}
              </span>
            </div>
            <p className=" text-gray-600 leading-relaxed">
              {data.locations[data.selectedIndex].description}
            </p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
