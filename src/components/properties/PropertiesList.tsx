"use client";

import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { FaSpinner } from "react-icons/fa";
import ISerializedProperty from "@/app/types/frontend";

export default function PropertyList() {
  const [properties, setProperties] = useState<ISerializedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/properties");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ISerializedProperty[] = await response.json();
        const sortedProperties = data.sort((a, b) => {
          const pointsA = a.points || 0;
          const pointsB = b.points || 0;
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
