"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const PropertyDetailPage = ({ params }) => {
  const { id } = params;
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`/api/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error("Error fetching property:", error);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  return <div>{/* Render your component content here */}</div>;
};

export default PropertyDetailPage;
