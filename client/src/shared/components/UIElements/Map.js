import React, { useRef, useEffect } from "react";
import "./Map.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1Ijoia291c2hpay12YWR1cmkiLCJhIjoiY2xidDVseTdyMGZlOTNxcW5sZnZicGQ1NiJ9.zQv3f6u8kJYXSfSScZe8yw";

const Map = (props) => {
  const mapContainer = useRef(null);
  // const map = useRef(null);
  const { center, zoom } = props;
  const { lng, lat } = center;

  // useEffect(() => {
  //   if (map.current) return; // initialize map only once
  //   map.current = new mapboxgl.Map({
  //     container: mapContainer.current,
  //     style: "mapbox://styles/mapbox/streets-v12",
  //     center: [lng, lat],
  //     zoom: zoom,
  //   });
  //   map.addControl(new mapboxgl.NavigationControl());
  //   // const marker1 = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
  // });
  // useEffect(() => {
  //   if (!map.current) return; // wait for map to initialize
  //   map.current.on("move", () => {
  //     setLng(map.current.getCenter().lng.toFixed(2));
  //     setLat(map.current.getCenter().lat.toFixed(2));
  //     setZoom(map.current.getZoom().toFixed(2));
  //   });
  // });

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
      });
      new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
      map.addControl(new mapboxgl.NavigationControl());
    }
  }, [lng, lat, zoom]);

  return (
    <>
      <div className="sidebar">
        Longitude: {lng.toFixed(2)} | Latitude: {lat.toFixed(2)} | Zoom: {zoom}
      </div>
      <div
        ref={mapContainer}
        className={`map ${props.className}`}
        style={props.style}
        id="map"
      />
    </>
  );
};
export default Map;

// WITHOUT MAPBOX

// const Map = (props) => {
//   const mapRef = useRef();

//   const { center, zoom } = props;

//   useEffect(() => {
//     new window.ol.Map({
//       target: mapRef.current.id,
//       layers: [
//         new window.ol.layer.Tile({
//           source: new window.ol.source.OSM(),
//         }),
//       ],
//       view: new window.ol.View({
//         center: window.ol.proj.fromLonLat([center.lng, center.lat]),
//         zoom: zoom,
//       }),
//     });
//   }, [center, zoom]);

//   return (
//     <div
//       ref={mapRef}
//       className={`map ${props.className}`}
//       style={props.style}
//       id="map"
//     ></div>
//   );
// };
//

// WITHOUT MAPBOX
