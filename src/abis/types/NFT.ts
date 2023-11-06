export interface Metadata {
    id:string;
    description: string;
    external_url: string;
    image: string;
    name: string;
    attributes: Attribute[];
    url:string;
  }

export interface Attribute {
    display_type?:string;
    trait_type: string;
    value: string | number;
}