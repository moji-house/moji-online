import IProperty from "./IProperty";

interface IPropertyImage {
  id: string | bigint;
  imageUrl: string;
  isMain: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  propertyId: string | bigint;
  
  // Relations
  property?: IProperty;
}

export default IPropertyImage;