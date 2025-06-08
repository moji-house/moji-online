import IProperty from "./IProperty";

interface IPropertyDocument {
  id: string | bigint;
  documentUrl: string;
  title?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  propertyId: string | bigint;
  
  // Relations
  property?: IProperty;
}

export default IPropertyDocument;