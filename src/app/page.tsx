"use client";
import Footer from "@/components/layout/Footer";
import PropertiesList from "../components/properties/PropertiesList";
import StatusBar from "@/components/layout/StatusBar";
import RoleSelectionModal from "@/components/auth/RoleSelectionModal";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { isModalOpen, assignRole } = useRoleCheck();

  // If the user is not logged in, we don't need to show the modal
  const showRoleModal = session && isModalOpen;

  return (
    <>
      <StatusBar />
      <PropertiesList />
      <Footer />
      
      {/* Role selection modal */}
      <RoleSelectionModal 
        isOpen={!!showRoleModal} 
        onRoleSelected={assignRole} 
      />
    </>
  );
}
