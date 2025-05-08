"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import { FaSpinner } from "react-icons/fa";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/properties");
        // Sort properties by points in descending order (highest first)
        const sortedProperties = response.data.sort((a, b) => {
          // If points don't exist, default to 0
          const pointsA = a.points || 0;
          const pointsB = b.points || 0;
          // Sort in descending order (highest first)
          return pointsB - pointsA;
        });
        setProperties(sortedProperties);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No properties found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
