export interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  slogan?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface GeneratedImage {
  mimeType: string;
  data: string; // base64 encoded image data
}