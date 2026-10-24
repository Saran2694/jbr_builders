export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface ProjectItem {
  id: string;
  slug?: string;
  title: string;
  category: string;
  categoryTag: 'exterior' | 'interior' | 'office' | 'handover';
  imageSrc: string;
  aspectRatio: string;
  description: string;
  published?: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
  year?: string;
  location?: string;
  coordinates?: string;
  address?: string;
  specs?: string;
}

export interface OfficeLocation {
  type: string;
  address: string;
  city: string;
  state: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}
