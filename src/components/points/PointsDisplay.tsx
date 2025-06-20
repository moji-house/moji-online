"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ICoinBalanceContext, useCoinBalance } from "@/context/CoinBalanceContext";
import { UserSession } from "@/app/types/auth";
import ISerializedProperty from "@/app/types/frontend";

export default function PointsDisplay({ propertyData }: { propertyData: ISerializedProperty }) {
  const { data: session } = useSession();
  const typedSession = session as UserSession;
  const [isVoting, setIsVoting] = useState(false);
  const [propertyPoints, setPropertyPoints] = useState(
    propertyData.points || 0
  );
  const router = useRouter();
  const { setCoinBalance } = useCoinBalance() as ICoinBalanceContext;

  const handleVote = async (profileId: string, value: number) => {
    if (!typedSession) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำการโหวต");
      return;
    }

    setIsVoting(true);
    try {
      console.log(`Voting for profile ${profileId} with ${value} points`);

      const coinDeductionSuccess = await handleCoinDecrement(value, profileId);
      if (!coinDeductionSuccess) {
        return Promise.reject(
          new Error("Failed to deduct coins for voting")
        );
      }

      const response = await fetch(`/api/properties/${profileId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voteType: "vote",
          points: value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit vote");
      }
    } catch (error: any) {
      console.error("Error submitting vote:", error);
      alert(error.message || "เกิดข้อผิดพลาดในการลงคะแนน กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsVoting(false);
    }
  };

  const handleCoinDecrement = async (amount: number, propertyId: string) => {
    if (!typedSession) {
      console.error("User not logged in");
      alert("กรุณาเข้าสู่ระบบก่อนทำการโหวต");
      return false;
    }

    try {
      const response = await fetch("/api/coins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: typedSession.user.id,
          amount: -amount,
          type: "vote",
          description: `โหวตให้ประกาศ`,
          propertyId: propertyId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error deducting coins:", error);
        alert(error.error || "เกิดข้อผิดพลาดในการหักเหรียญ");
        return false;
      }

      await response.json();
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error deducting coins:", error);
      alert("เกิดข้อผิดพลาดในการหักเหรียญ");
      return false;
    }
  };

  const displayProfiles = propertyData ? [propertyData] : [];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg shadow-md p-1">
      <div className="space-y-4">
        {displayProfiles.map((profile) => (
          <div key={profile.id} className="border-b pb-0 last:border-0">
            <div className="flex justify-between items-center mb-0">
              <div>
                <div className="flex items-center text-sm text-white">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span>{propertyPoints || 0} Vote Points</span>
                </div>
              </div>

              <div className="flex items-center text-white">
                <input
                  id={`vote-input-${profile.id}`}
                  type="number"
                  min="1"
                  max="10000"
                  defaultValue="1"
                  className="w-16 h-8 px-2 border border-gray-300 rounded-md text-center"
                  disabled={!typedSession || isVoting}
                />

                <button
                  onClick={() => {
                    const input = document.getElementById(
                      `vote-input-${profile.id}`
                    ) as HTMLInputElement;
                    if (!input) {
                      console.error(
                        `Input element for profile ${profile.id} not found`
                      );
                      return;
                    }

                    const value = parseInt(input.value, 10);
                    if (isNaN(value) || value < 1 || value > 10000) {
                      toast.error("กรุณาป้อนค่าตั้งแต่ 1 ถึง 10000");
                      return;
                    }

                    handleVote(profile.id, value)
                      .then(() => {
                        setPropertyPoints((prev) => prev + value);
                        setCoinBalance((prev) => prev - value);
                        toast.success("โหวตสำเร็จ");
                        input.value = "1"; // Reset after voting
                      })
                      .catch((error) => {
                        console.error("Error during voting:", error);
                        toast.error("เกิดข้อผิดพลาดในการโหวต");
                      });
                  }}                  className="ml-2 px-2 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={!typedSession || isVoting}
                >
                  Vote
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!typedSession && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm text-gray-600 text-center">
          กรุณาเข้าสู่ระบบเพื่อทำการโหวต
        </div>
      )}
    </div>
  );
}
