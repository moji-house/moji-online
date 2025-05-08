"use client";

import Image from "next/image";
import MojiLogo from "@/assets/Moji-Logo.png";
import { useState, useEffect } from "react";

export default function Home() {
  // กำหนดวันที่สิ้นสุด Pre-sale (ปี, เดือน-1, วัน, ชั่วโมง, นาที)
  const endDate = new Date(2025, 5, 1, 0, 0); // 1 พฤษภาคม 2025

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        // ถ้าหมดเวลาแล้ว
        clearInterval(timer);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      } else {
        // คำนวณวัน ชั่วโมง นาที วินาที
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

    return (
    <div className="min-h-screen bg-[#0B1121] text-white relative">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(#93C5FD 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
          opacity: '0.15'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Image
              src={MojiLogo}
              alt="Moji Token Logo"
              className="h-8 w-auto"
              width={32}
              height={32}
            />
            <h1 className="ml-2 text-xl font-bold text-[#5a86c3]">Moji House</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20">
          {/* Hero Section */}
          <div className="container mx-auto px-4 py-2 text-center">
            <div className="mb-8">
              <Image
                src={MojiLogo}
                alt="Moji Token Large Logo"
                width={128}
                height={128}
                className="mx-auto mb-8"
                priority
              />
              <h1 className="text-5xl font-bold mb-4 text-[#60A5FA] py-2">
                Moji Token Pre-sale
              </h1>
              <p className="text-xl text-gray-300">
                Join the future of digital currency. Secure your Moji Tokens
                before public launch.
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-16">
              <button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-8 py-3 rounded-lg font-semibold">
                Buy Tokens Pre-sale Now
              </button>
              {/* <button className="border border-[#60A5FA] text-[#60A5FA] hover:bg-[#60A5FA]/10 px-8 py-3 rounded-lg font-semibold">
                  Learn More
                </button> */}
            </div>

            <div className="mb-16">
              <h2 className="text-xl mb-4">Pre-sale Ends In:</h2>
              <div className="flex justify-center gap-4">
                <div className="bg-[#1E293B] p-4 rounded-lg min-w-[80px]">
                  <div className="text-3xl font-bold text-[#60A5FA]">{timeLeft.days}</div>
                  <div className="text-sm text-gray-400">Days</div>
                </div>
                <div className="bg-[#1E293B] p-4 rounded-lg min-w-[80px]">
                  <div className="text-3xl font-bold text-[#60A5FA]">{timeLeft.hours}</div>
                  <div className="text-sm text-gray-400">Hours</div>
                </div>
                <div className="bg-[#1E293B] p-4 rounded-lg min-w-[80px]">
                  <div className="text-3xl font-bold text-[#60A5FA]">{timeLeft.minutes}</div>
                  <div className="text-sm text-gray-400">Minutes</div>
                </div>
                <div className="bg-[#1E293B] p-4 rounded-lg min-w-[80px]">
                  <div className="text-3xl font-bold text-[#60A5FA]">{timeLeft.seconds}</div>
                  <div className="text-sm text-gray-400">Seconds</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#60A5FA]">{timeLeft.days} Days</div>
                <div className="text-gray-400">Pre-sale Ends</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#60A5FA]">
                  410,256,738.35
                </div>
                <div className="text-gray-400">Tokens Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#60A5FA]">50%</div>
                <div className="text-gray-400">Discount</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-6 py-30">
            <div className="mb-8">
              {/* <Image
                src={MojiLogo}
                alt="Moji Token Large Logo"
                width={128}
                height={128}
                className="mx-auto mb-8"
                priority
              /> */}
              <h1 className="text-center text-5xl font-bold mb-4 text-[#60A5FA] py-2">
                Moji Whitepaper
              </h1>
              <p className="text-center text-xl text-gray-300">Estate Unlimited.</p>
            </div>

          {/* Introduction Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
              </div>

                <h2 className="text-3xl font-bold text-white">
                  Project Introduction
                </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-blue-100 leading-relaxed">
                    ในยุคดิจิทัลที่ตลาดอสังหาริมทรัพย์กำลังเปลี่ยนแปลงไปอย่างรวดเร็ว
                  หลายแพลตฟอร์มเริ่มนำเทคโนโลยีมาปรับใช้เพื่อเพิ่มประสิทธิภาพในการซื้อขาย
                  MOJI HOUSE
                  เป็นหนึ่งในแพลตฟอร์มที่มุ่งมั่นจะเป็นส่วนหนึ่งของการปฏิวัติตลาดอสังหาริมทรัพย์
                  โดยนำเทคโนโลยีบล็อกเชนมาใช้ร่วมกับ MOJI TOKEN
                  ซึ่งเป็นเหรียญดิจิทัลที่ถูกออกแบบมาเพื่อสร้างสมดุลในระบบนิเวศของการซื้อขายอสังหาริมทรัพย์
                  โดยนำเทคโนโลยีบล็อกเชนมาใช้ร่วมกับ MOJI TOKEN
                  ซึ่งเป็นเหรียญดิจิทัลที่ถูกออกแบบมาเพื่อสร้างสมดุลในระบบนิเวศของการซื้อขายอสังหาริมทรัพย์
                  แพลตฟอร์ม MOJI HOUSE
                  ช่วยให้ผู้ใช้สามารถโพสต์ขายอสังหาริมทรัพย์
                  พร้อมทั้งมีระบบโหวตที่ช่วยจัดอันดับความน่าเชื่อถือของโพสต์
                  ทำให้เกิดความโปร่งใสและเพิ่มโอกาสในการซื้อขาย
                  นอกจากนี้ยังเป็นศูนย์กลางที่รวบรวมข้อมูลอสังหาริมทรัพย์จากเจ้าของและตัวแทนที่ได้รับการตรวจสอบแล้ว
                  พร้อมทั้งมอบรางวัลให้กับผู้ใช้ที่เข้าร่วมระบบเพื่อสร้างแรงจูงใจในตลาดที่ขับเคลื่อนด้วยชุมชน
                </p>
              </div>
              <div className="relative h-[500px] rounded-lg overflow-hidden">
                <Image
                  src="/images/digital-transformation.jpg"
                  alt="Digital Transformation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Problem & Solution Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
              </div>
                <h2 className="text-3xl font-bold text-white">
                  Problem & Solution
                </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-blue-700/10 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    ปัญหา:
                  </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        ตลาดอสังหาริมทรัพย์ออนไลน์ยังขาดความโปร่งใสในระบบการจัดอันดับความน่าเชื่อถือ
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        การซื้อขายอสังหาริมทรัพย์ระหว่างประเทศมีค่าธรรมเนียมสูงและมีกระบวนการที่ซับซ้อน
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        ผู้ขายขาดช่องทางดึงดูดผู้ซื้อในแง่ของการสร้างความน่าเชื่อถือ
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        ผู้ซื้อและนักลงทุนมีโอกาสถูกหลอกจากการเข้าถึงแหล่งรวบรวมอสังหาริมทรัพย์ที่ไม่โปร่งใส
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        คริปโตถูกมองว่าเป็นสินทรัพย์ที่จับต้องไม่ได้และมีความเสี่ยงสูง
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        ใน Real World
                        ผู้ซื้อและผู้ขายต้องดำเนินการทุกขั้นตอนด้วยตนเอง
                        ตั้งแต่ติดต่อสอบถาม ตอบคำถาม นัดหมายดูทรัพย์
                        จนกระทั่งสิ้นสุดการขายหรือการเช่า
                        ลดโอกาศในการซื้อขายระหว่างประเทศ
                      </span>
                  </li>
                </ul>
              </div>

                <div className="bg-blue-700/10 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    โซลูชันของ MOJI:
                  </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        ใช้บล็อกเชนในการบันทึกธุรกรรมเพื่อเพิ่มความโปร่งใส
                        ตรวจสอบได้
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        ใช้ระบบโหวตโดยชุมชนที่ขับเคลื่อนด้วย Smart Contract
                        เพื่อช่วยจัดอันดับความน่าเชื่อถือของโพสต์ขายอสังหาริมทรัพย์
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        มีระบบรีวอร์ดจากการโพสต์
                        เพิ่มรายได้นอกเหนือจากคอมมิชชั่นเพื่อจูงใจให้ผู้ขายนำทรัพย์มารวบรวมไว้ในแพลตฟอร์ม
                        ภายใต้การยืนยันตัวตน
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        มีระบบ Property Owner, Agency และ Buyer
                        ที่ช่วยให้ผู้ใช้แพลตฟอร์มแสดงตัวตนอย่างชัดเจน
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        ลดค่าธรรมเนียมการทำธุรกรรมระหว่างประเทศผ่านการใช้ Smart
                        Contract
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        Moji Token
                        เป็นคริปโตเคอเรนซี่ที่ขับเคลื่อนด้วยอสังหาริมทรัพย์ที่จับต้องได้อย่างแท้จริง
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        NFT จากเทคโนโลยี Blockchain
                        จะมาช่วยดูแลทุกธุรกรรมระหว่างผู้เช่าและผู้ให้เช่า
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        เทคโนโลยี AI ในแพลตฟอร์มสามารถแก้ปัญหาเรื่องการถามตอบ
                        การนัดหมาย
                      </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-200">•</span>
                      <span className="text-blue-100">
                        แพลตฟอร์มรองรับการการเยี่ยมชมทรัพย์เสมือนจริง
                        ทำให้ไม่ต้องเดินทางข้ามประเทศ
                      </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Blockchain Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                </svg>
              </div>
                <h2 className="text-3xl font-bold text-white">
                  Blockchain & Smart Contract
                </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/images/blockchain.jpg"
                  alt="Blockchain Technology"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-blue-100 leading-relaxed">
                  ใช้บล็อกเชนในการบันทึกข้อมูลและดำเนินธุรกรรมโดยอัตโนมัติ
                </p>
              </div>
            </div>
          </section>

          {/* Voting System Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Voting System</h2>
            </div>
              <div className="bg-blue-700/10 p-6 rounded-lg">
              <p className="text-blue-100 mb-6">
                  ผู้ใช้สามารถใช้ MOJI TOKEN
                  ในการโหวตให้กับโพสต์อสังหาริมทรัพย์ที่พวกเขาสนใจ โดย 1 MOJI = 1
                  คะแนนโหวต
                </p>
                <p className="text-white font-semibold mb-4">
                  MOJI TOKEN ที่ได้จากการโหวตจะถูกแบ่งเป็น 3 ส่วน:
                </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-blue-200">•</span>
                    <span className="text-blue-100">
                      ส่งไปเป็น Staking Rewards
                    </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-200">•</span>
                    <span className="text-blue-100">
                      ส่งกลับไปหมุนเวียนใน Rewards Pool
                    </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-200">•</span>
                    <span className="text-blue-100">
                      ส่วนที่เหลือจะนำเข้าสู่ระบบหมุนเวียนของการพัฒนาแพลตฟอร์ม
                    </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Reward System Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Reward System</h2>
            </div>
              <div className="bg-blue-700/10 p-6 rounded-lg">
              <p className="text-blue-100">
                  ผู้ใช้แพลตฟอร์มจะได้รับ MOJI Token
                  เป็นรางวัลเมื่อโพสต์ขายอสังหาริมทรัพย์
              </p>
            </div>
          </section>

          {/* Staking System Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Staking System</h2>
            </div>
              <div className="bg-blue-700/10 p-6 rounded-lg">
              <p className="text-blue-100">
                ผู้ถือเหรียญสามารถนำ MOJI มา Staking เพื่อรับรางวัลเพิ่มเติม
              </p>
            </div>
          </section>

          {/* Tokenomics Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Tokenomics</h2>
            </div>
            
              <div className="bg-blue-700/10 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <p className="text-lg font-semibold mb-4 text-white">
                      • สัญลักษณ์โทเค็น: MOJI
                    </p>
                  <p className="text-blue-100 mb-6">
                      Total Supply: 8,205,134,767 Token
                      ซึ่งสอดคล้องกับจำนวนประชากรโลก แนวคิดคือ
                      สมมติให้ทุกคนควรมีบ้านหนึ่งหลัง และจำนวน Token จะค่อย ๆ
                      ลดลงทุกครั้งจากการเผาเหรียญในการแจก Rewards จนเหลือเพียง 1
                      ใน 4 คือ 1 ครัวเรือนต่อสมาชิกประมาณ 4 คน
                      (หรือคำนวณตามอุปสงค์ = จำนวนประชากร / อุปทาน =
                      ปริมาณที่พักอาศัย) และทุกการทำธุรกรรมการโอนออกจะมีการหัก Tax
                      7% เพื่อนำโทเค็นกลับเข้าสู่ Rewards Pool
                  </p>
                </div>
                <div className="relative h-[200px] rounded-lg overflow-hidden">
                  <Image
                    src="/images/tokenomics.jpg"
                    alt="Tokenomics"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

                <h3 className="text-xl font-semibold mb-4 mt-8 text-white">
                  การจัดสรรโทเค็น:
                </h3>
              <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-800/0 backdrop-blur-sm p-4 rounded-lg shadow">
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center text-white">
                      <span>Airdrop</span>
                      <span className="font-bold text-blue-200">2%</span>
                    </li>
                    <li className="flex justify-between items-center text-white">
                      <span>Presale</span>
                      <span className="font-bold text-blue-200">5%</span>
                    </li>
                    <li className="flex justify-between items-center text-white">
                      <span>Public Sale</span>
                      <span className="font-bold text-blue-200">5%</span>
                    </li>
                    <li className="flex justify-between items-center text-white">
                      <span>Activate Rewards Pool</span>
                      <span className="font-bold text-blue-200">5%</span>
                    </li>
                  </ul>
                </div>
                  <div className="bg-blue-800/0 backdrop-blur-sm p-4 rounded-lg shadow">
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center text-white">
                      <span>Locking Rewards Pool 1st</span>
                      <span className="font-bold text-blue-200">25%</span>
                    </li>
                    <li className="flex justify-between items-center text-white">
                      <span>Locking Rewards Pool 2nd</span>
                      <span className="font-bold text-blue-200">25%</span>
                    </li>
                    <li className="flex justify-between items-center text-white">
                      <span>Locking Rewards Pool 3rd</span>
                      <span className="font-bold text-blue-200">25%</span>
                    </li>
                    <li className="flex justify-between items-center text-white">
                      <span>Team & Advisors</span>
                      <span className="font-bold text-blue-200">8%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Roadmap Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Roadmap</h2>
            </div>
            
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg mb-8">
              <Image
                src="/images/roadmap.jpg"
                alt="Roadmap"
                fill
                className="object-contain"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              <div className="space-y-8">
                {[
                  "MVP Platform Launch & Airdrop",
                  "Presale",
                  "Rewards, Voting and Ranking System Off chain",
                  "Public Sale",
                  "Integrated Wallet on Platform",
                  "DEX Listing",
                  "Rewards, Burning and Redeem System On chain",
                  "Voting, Staking System",
                  "Develop & Upgrade Features",
                  "Official Launch & Marketing",
                  "Integrated Smart Home & Marketing",
                  "CEX Listing",
                    "Next up…Moji Crowdfunding Starting",
                ].map((item, index) => (
                  <div key={index} className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span
                          className={`text-blue-600 font-bold ${
                            index === 12 ? "text-4xl" : ""
                          }`}
                        >
                          {index === 12 ? "∞" : index + 1}
                        </span>
                    </div>
                      <div className="bg-blue-700/10 p-4 rounded-lg">
                      <p className="text-blue-100">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team & Advisors Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Team & Advisors</h2>
            </div>
              <div className="bg-blue-700/10 p-6 rounded-lg">
              <p className="text-blue-100">
                  ข้อมูลเกี่ยวกับทีมพัฒนาและที่ปรึกษาจะถูกเปิดเผยภายหลัง
                  เพื่อระบบความปลอดภัยและความเป็นกลางในการดำเนินงาน
              </p>
            </div>
          </section>

          {/* Fundraising & ICO/IDO Details Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Fundraising & ICO/IDO Details
                </h2>
              </div>
              <div className="bg-blue-700/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">
                  รอบการขายโทเค็น:
                </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-200">•</span>
                  <div>
                      <span className="text-blue-100 font-semibold">
                        Presale:
                      </span>
                      <span className="text-blue-100">
                        {" "}
                        5% ของโทเค็นทั้งหมด ในราคาเหรียญละ 0.01 บาท
                      </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-200">•</span>
                  <div>
                      <span className="text-blue-100 font-semibold">
                        Public Sale:
                      </span>
                      <span className="text-blue-100">
                        {" "}
                        5% ของโทเค็นทั้งหมด ในราคาเหรียญละ 0.02 บาท
                      </span>
                  </div>
                </li>
              </ul>
              <p className="text-blue-100 mt-4">
                วิธีการซื้อ: ผ่านช่องทางที่แพลตฟอร์มประกาศ
              </p>
            </div>
          </section>

          {/* Legal & Security Aspects Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Legal & Security Aspects
                </h2>
              </div>
              <div className="bg-blue-700/10 p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-blue-200">•</span>
                    <span className="text-blue-100">
                      MOJI ปฏิบัติตามมาตรฐาน KYC/AML
                    </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-200">•</span>
                    <span className="text-blue-100">
                      การทำธุรกรรมทั้งหมดอยู่บนบล็อกเชนที่สามารถตรวจสอบได้
                    </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-200">•</span>
                    <span className="text-blue-100">
                      มีการตรวจสอบความปลอดภัยของ Smart Contract อย่างต่อเนื่อง
                    </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Conclusion Section */}
            <section className="mb-12 bg-[#1E293B] rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
              </div>
                <h2 className="text-3xl font-bold text-white">
                  Conclusion & Vision
                </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-blue-100 leading-relaxed">
                    "MOJI"
                    เป็นโทเค็นที่สร้างขึ้นเพื่อปฏิวัติวงการอสังหาริมทรัพย์ออนไลน์
                    ด้วยระบบ Vote, Ranking, Staking, Burning และ Rewards
                    ที่ช่วยเพิ่มมูลค่าให้กับผู้ถือเหรียญ ผู้ใช้แพลตฟอร์ม
                    และเพิ่มมูลค่าสินทรัพย์ในทางอ้อม
                    เรามุ่งมั่นที่จะพัฒนาแพลตฟอร์มให้เป็นศูนย์กลางของ"อสังหาริมทรัพย์ดิจิทัล"ที่ปลอดภัย
                    โปร่งใส
                    และรวบรวมทรัพย์ให้สามารถเข้าถึงได้ง่ายเพื่อเชื่อมโยงมูลค่าของคริปโตเคอร์เรนซี่ให้"จับต้องได้"ใน
                    Real Word
                    รวมไปถึงการเป็นก้าวแรกของโปรเจคที่จะนำเทคโนโลยีสมาร์ทโฮมมาใช้อย่างแพร่หลายในอนาคต
                    ...มาร่วมเป็นส่วนหนึ่งกับเรา
                    แพลตฟอร์มอสังหาริมทรัพย์ที่"ไร้ขีดจำกัด"
                </p>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/images/vision.jpg"
                  alt="Vision"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>
          </div>
        </div>
        </div>
      </div>
    );
}
