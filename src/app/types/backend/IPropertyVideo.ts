import IProperty from "./IProperty";

interface IPropertyVideo {
  id: string | bigint;
  videoUrl: string;
  title?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  propertyId: string | bigint;
  
  // Relations
  property?: IProperty;
}

export default IPropertyVideo;