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