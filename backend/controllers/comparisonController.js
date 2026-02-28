import axios from "axios";
import asyncHandler from "../utils/asyncHandler.js";

let uberAccessToken = null;
let uberTokenExpiry = null;

// ================= UBER TOKEN WITH CACHING =================
const getUberAccessToken = async () => {
  // Reuse token if still valid
  if (uberAccessToken && uberTokenExpiry && Date.now() < uberTokenExpiry) {
    return uberAccessToken;
  }

  const params = new URLSearchParams();
  params.append("client_id", process.env.UBER_CLIENT_ID);
  params.append("client_secret", process.env.UBER_CLIENT_SECRET);
  params.append("grant_type", "client_credentials");
  params.append("scope", "estimates");

  const { data } = await axios.post(
    "https://auth.uber.com/oauth/v2/token",
    params
  );

  uberAccessToken = data.access_token;
  uberTokenExpiry = Date.now() + data.expires_in * 1000;

  return uberAccessToken;
};

// ================= LIVE COMPARISON =================
export const getLiveComparison = asyncHandler(async (req, res) => {
  const { startLat, startLng, endLat, endLng } = req.body;

  const uberToken = await getUberAccessToken();

  const [uberRes, googleRes, weatherRes] = await Promise.allSettled([
    axios.get("https://api.uber.com/v1.2/estimates/price", {
      params: {
        start_latitude: startLat,
        start_longitude: startLng,
        end_latitude: endLat,
        end_longitude: endLng,
      },
      headers: { Authorization: `Bearer ${uberToken}` },
    }),

    axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
      params: {
        origins: `${startLat},${startLng}`,
        destinations: `${endLat},${endLng}`,
        mode: "transit",
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    }),

    axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        lat: startLat,
        lon: startLng,
        appid: process.env.WEATHER_API_KEY,
        units: "metric",
      },
    }),
  ]);

  // SAFELY handle fulfilled/rejected cases

  const distanceKm =
    googleRes.status === "fulfilled"
      ? googleRes.value.data?.rows?.[0]?.elements?.[0]?.distance?.value / 1000
      : 0;

  const weather =
    weatherRes.status === "fulfilled"
      ? weatherRes.value.data?.weather?.[0]?.main
      : "Unavailable";

  const uberPrice =
    uberRes.status === "fulfilled"
      ? uberRes.value.data?.prices?.[0]?.estimate
      : null;

  res.status(200).json({
    weather,
    options: [
      {
        mode: "Uber",
        price: uberPrice || "₹" + Math.round(distanceKm * 18),
      },
      {
        mode: "Public Transit",
        price: "₹" + Math.round(distanceKm * 5),
      },
    ],
  });
});