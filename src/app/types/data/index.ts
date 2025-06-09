export interface PropertyFormData {
    title: string;
    description: string;
    address: string;
    city: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    status: "for sale" | "for rent";
    images: File[];
    phone: string;
    lineId: string;
    googleMapLink: string;
    coAgentCommission: string;
    coAgentIncentive: string;
    coAgentNotes: string;
    videos: File[];
    documents: File[];
}

export interface DocumentFile {
    file: File;
    url: string | null;
    isImage: boolean;
    name?: string;
    size?: string;
}

export interface CreateUserFormData {
    firstName: string;
    lastName: string;
    birthDate: string;
    showBirthDate: boolean;
    roles: string[];
    education: string;
    currentCompany: string;
    previousCompanies: string;
    email: string;
    phone: string;
    lineContact: string;
    realEstateExperience: string;
    documents: DocumentFile[];
    avatar: File | null;
    backgroundImage: File | null;
    bio: string;
    googleId?: string; // Made optional since it's not used in the edit form
}

export interface EditUserFormData {
    firstName: string;
    lastName: string;
    birthDate: string;
    showBirthDate: boolean;
    roles?: string[];
    education: string;
    currentCompany: string;
    previousCompanies: string;
    email: string;
    phone: string;
    lineContact: string;
    realEstateExperience: string;
    documents?: DocumentFile[];
    avatar: File | null;
    backgroundImage: File | null;
    bio: string;
    googleId?: string; // Made optional since it's not used in the edit form
}

export interface FormError {
    [key: string]: string | null
}

export interface VideoPreview {
    url: string;
    name: string;
    size: string;
    type: string;
    progress?: number;
}