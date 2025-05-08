"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useUserProfile } from "@/context/UserProfileContext";


export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userProfiles } = useUserProfile();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    showBirthDate: false,
    education: "",
    currentCompany: "",
    previousCompanies: "",
    email: "",
    phone: "",
    lineContact: "",
    realEstateExperience: "",
    avatar: null,
    backgroundImage: null,
    bio: "",
  });

  const [previewImages, setPreviewImages] = useState({
    avatar: null,
    backgroundImage: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [userRoles, setUserRoles] = useState([]);

          // หา current user profile
          const currentUserProfile = userProfiles?.find(
            (profile) => profile.email === session?.user?.email
          );
  
  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
      return;
    }

    const fetchProfileData = async () => {
      try {
        if (!session?.user?.email) {
          return;
        }

        // หา current user profile
        const currentUserProfile = userProfiles?.find(
          (profile) => profile.email === session?.user?.email
        );

        
        setIsLoading(true);

        if (currentUserProfile) {
          // แยก roles ออกมาเก็บแยก
          const roles = currentUserProfile.roles || [];
          setUserRoles(roles);

          setFormData({
            firstName: currentUserProfile.firstName || "",
            lastName: currentUserProfile.lastName || "",
            birthDate: currentUserProfile.birthDate || "",
            showBirthDate: currentUserProfile.showBirthDate || false,
            education: currentUserProfile.education || "",
            currentCompany: currentUserProfile.currentCompany || "",
            previousCompanies: currentUserProfile.previousCompanies || "",
            email: currentUserProfile.email || "",
            phone: currentUserProfile.phone || "",
            lineContact: currentUserProfile.lineContact || "",
            realEstateExperience: currentUserProfile.realEstateExperience || "",
            avatar: currentUserProfile.avatar || null,
            backgroundImage: currentUserProfile.backgroundImage || null,
            bio: currentUserProfile.bio || "",
          });

          // ตั้งค่ารูปภาพเดิม
          setPreviewImages({
            avatar: currentUserProfile.avatar || null,
            backgroundImage: currentUserProfile.backgroundImage || null
          });
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
        toast.error("ไม่สามารถโหลดข้อมูลโปรไฟล์ได้");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session?.user?.email) {
      fetchProfileData();
    }
  }, [status, session, router, userProfiles]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox" && name === "showBirthDate") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "roles") {
      // เปลี่ยนจากการใช้ checkbox เป็น radio button
      setUserRoles([value]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (!files || files.length === 0) {
      return;
    }
    
    try {
      // สร้าง URL สำหรับแสดงตัวอย่างไฟล์
      const fileUrls = files.map(file => {
        if (!file || !(file instanceof File)) {
          return null;
        }

        // ตรวจสอบว่าเป็นไฟล์รูปภาพหรือไม่
        if (file.type && file.type.startsWith('image/')) {
          try {
            const url = URL.createObjectURL(file);
            return {
              file,
              url,
              isImage: true
            };
          } catch (error) {
            console.error('Error creating URL for image:', error);
            return {
              file,
              url: null,
              isImage: true
            };
          }
        } else {
          return {
            file,
            url: null,
            isImage: false
          };
        }
      }).filter(item => item !== null);
      
      if (fileUrls.length === 0) {
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...fileUrls]
      }));
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('ไม่สามารถสร้างตัวอย่างไฟล์ได้');
    }
  };

  const removeFile = (index) => {
    setFormData(prev => {
      const newDocuments = [...prev.documents];
      if (newDocuments[index] && newDocuments[index].url) {
        try {
          URL.revokeObjectURL(newDocuments[index].url);
        } catch (error) {
          console.error('Error revoking object URL:', error);
        }
      }
      newDocuments.splice(index, 1);
      return {
        ...prev,
        documents: newDocuments
      };
    });
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
        return;
      }

      // สร้าง URL สำหรับแสดงตัวอย่าง
      const previewUrl = URL.createObjectURL(file);
      setPreviewImages(prev => ({
        ...prev,
        [type]: previewUrl
      }));

      // อัพเดท formData
      setFormData(prev => ({
        ...prev,
          [type]: file
        }));
      } catch (error) {
        console.error('Error creating preview:', error);
        toast.error('ไม่สามารถสร้างตัวอย่างรูปภาพได้');
      }
    };

  const validateForm = () => {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!formData.firstName.trim()) {
      toast.error("กรุณากรอกชื่อ");
      return false;
    }

    if (!formData.lastName.trim()) {
      toast.error("กรุณากรอกนามสกุล");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("กรุณากรอกอีเมล");
      return false;
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("รูปแบบอีเมลไม่ถูกต้อง");
      return false;
    }

    // ตรวจสอบว่ามีการเลือกบทบาทอย่างน้อย 1 บทบาท
    // if (userRoles.length === 0) {
    //   toast.error("กรุณาเลือกบทบาทอย่างน้อย 1 บทบาท");
    //   return false;
    // }

    // ตรวจสอบขนาดไฟล์รูปภาพ
    if (formData.avatar && formData.avatar.size > 2 * 1024 * 1024) {
      toast.error("ขนาดไฟล์รูปโปรไฟล์ต้องไม่เกิน 2MB");
      return false;
    }

    if (formData.backgroundImage && formData.backgroundImage.size > 5 * 1024 * 1024) {
      toast.error("ขนาดไฟล์รูปพื้นหลังต้องไม่เกิน 5MB");
      return false;
    }

    // ตรวจสอบขนาดไฟล์เอกสาร
    if (formData.documents && formData.documents.length > 0) {
      for (const doc of formData.documents) {
        if (doc.size > 5 * 1024 * 1024) {
          toast.error("ขนาดไฟล์เอกสารต้องไม่เกิน 5MB");
          return false;
        }
      }
    }

    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // ตรวจสอบความถูกต้องของข้อมูล
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      // สร้าง FormData object
      const submitData = new FormData();
      
      // เพิ่มข้อมูลพื้นฐาน
      Object.keys(formData).forEach(key => {
        if (key !== 'avatar' && key !== 'backgroundImage') {
          submitData.append(key, formData[key] || '');
        }
      });

      // // เพิ่มรูปภาพ (ถ้ามีการเปลี่ยนแปลง)
      // if (formData.avatar && formData.avatar.startsWith('http')) {
      //   submitData.append('avatar', formData.avatar);
      // }
      // if (formData.backgroundImage && formData.backgroundImage.startsWith('http')) {
      //   submitData.append('backgroundImage', formData.backgroundImage);
      // }
            // เพิ่มรูปภาพโปรไฟล์
            if (formData.avatar) {
              submitData.append('avatar', formData.avatar);
            }
      
            // เพิ่มรูปภาพพื้นหลัง
            if (formData.backgroundImage) {
              submitData.append('backgroundImage', formData.backgroundImage);
            }

      // ส่งข้อมูลไปยัง API
      const response = await fetch(`/api/profile/${currentUserProfile.id}/editprofile`, {
        method: 'PUT',
        body: submitData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ไม่สามารถอัปเดตโปรไฟล์ได้');
      }
      
      const data = await response.json();
      
      toast.success('อัปเดตโปรไฟล์สำเร็จ!');
      setTimeout(() => {
        router.push('/route/profile/myprofile');
      }, 1500);

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      
      {message && (
        <div
          className={`p-4 mb-6 rounded ${
            message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

          {/* Avatar Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รูปโปรไฟล์
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 border-2 border-gray-300 rounded-full overflow-hidden">
                {previewImages.avatar ? (
                  <Image
                    src={previewImages.avatar}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <FaUserCircle className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'avatar')}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block"
                >
                  อัพโหลดรูปโปรไฟล์
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  แนะนำ: รูปสี่เหลี่ยมจัตุรัส, ขนาดสูงสุด 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Background Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รูปพื้นหลัง
            </label>
            <div className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
              {previewImages.backgroundImage ? (
                <Image
                  src={previewImages.backgroundImage}
                  alt="Background"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">ไม่มีรูปพื้นหลัง</span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'backgroundImage')}
                className="hidden"
                id="background-upload"
              />
              <label
                htmlFor="background-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block"
              >
                อัพโหลดรูปพื้นหลัง
              </label>
              <p className="mt-1 text-xs text-gray-500">
                แนะนำ: 1920x1080px, ขนาดสูงสุด 5MB
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              About Me
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Birth Date
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showBirthDate"
                  name="showBirthDate"
                  checked={formData.showBirthDate}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="showBirthDate"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Show publicly
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Roles */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Roles</h2>
          <p className="text-sm text-gray-600 mb-3">
            กรุณาเลือกบทบาทของคุณ
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="role-owner"
                name="roles"
                value="Owner"
                checked={userRoles && Array.isArray(userRoles) && userRoles.includes("Owner")}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="role-owner"
                className="ml-2 block text-sm text-gray-700"
              >
                Owner
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="role-agent"
                name="roles"
                value="Agent"
                checked={userRoles && Array.isArray(userRoles) && userRoles.includes("Agent")}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="role-agent"
                className="ml-2 block text-sm text-gray-700"
              >
                Agent
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="role-customer"
                name="roles"
                value="Customer"
                checked={userRoles && Array.isArray(userRoles) && userRoles.includes("Customer")}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="role-customer"
                className="ml-2 block text-sm text-gray-700"
              >
                Customer
              </label>
            </div>
          </div>
        </div>
        
        {/* Education & Work */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Education & Work Experience
          </h2>
          
          <div className="space-y-4">
            <div>
              <label
                htmlFor="education"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Education History
              </label>
              <textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List your educational background"
              ></textarea>
            </div>
            
            <div>
              <label
                htmlFor="currentCompany"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Company/Organization
              </label>
              <input
                type="text"
                id="currentCompany"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your current workplace"
              />
            </div>
            
            <div>
              <label
                htmlFor="previousCompanies"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Previous Companies/Organizations
              </label>
              <textarea
                id="previousCompanies"
                name="previousCompanies"
                value={formData.previousCompanies}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List your previous workplaces"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          
          <div className="space-y-4">
          <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="081-234-5678"
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: 081-234-5678
              </p>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label
                htmlFor="lineContact"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Line Contact URL
              </label>
              <input
                type="url"
                id="lineContact"
                name="lineContact"
                value={formData.lineContact}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://line.me/ti/p/~yourusername"
              />
            </div>
          </div>
        </div>
        
        {/* Real Estate Experience */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Real Estate Experience</h2>
          
          <div>
            <label
              htmlFor="realEstateExperience"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Experience Details
            </label>
            <textarea
              id="realEstateExperience"
              name="realEstateExperience"
              value={formData.realEstateExperience}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your experience in the real estate industry"
            ></textarea>
          </div>
        </div>
        
              {/* Documents Upload (Only for Owner and Agent) */}
        {(userRoles.includes("Owner") ||
          userRoles.includes("Agent")) && (
                <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Professional Documents
            </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload certificates, professional licenses, or portfolio images
                  </p>
            
                  <div className="space-y-4">
                    <div>
                <label
                  htmlFor="documents"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                        Upload Documents
                      </label>
                      <input
                        type="file"
                        id="documents"
                        name="documents"
                  onChange={handleFileChange}
                        multiple
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Accepted formats: PDF, JPG, JPEG, PNG (Max 5MB per file)
                      </p>
                    </div>
              
                    {/* Display currently uploaded documents */}
                    {formData.documents.length > 0 && (
                      <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Documents
                  </h3>
                        <ul className="space-y-2">
                    {formData.documents.map((doc, index) => {
                      if (!doc || !doc.file) {
                        return null;
                      }
                      
                      return (
                        <li
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            {doc.isImage && doc.url ? (
                              <img 
                                src={doc.url} 
                                alt={`Preview ${index + 1}`} 
                                className="w-10 h-10 object-cover rounded"
                                onError={(e) => {
                                  console.error('Error loading image preview:', e);
                                  e.target.src = '/placeholder-image.png';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-500">File</span>
                              </div>
                            )}
                            <span className="text-sm truncate">{doc.file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </li>
                      );
                    })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
        
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
            {isLoading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
  );
}
