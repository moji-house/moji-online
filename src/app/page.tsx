"use client";
import Footer from "@/components/layout/Footer";
import PropertiesList from "../components/properties/PropertiesList";
import StatusBar from "@/components/layout/StatusBar";

export default function Home() {
  return (
    <>
      <StatusBar />
      <PropertiesList />
      <Footer />
    </>
  );
}
