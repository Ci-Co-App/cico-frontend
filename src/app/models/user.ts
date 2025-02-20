export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee";
  photo_profile?: string;
  position?: string;
  department?: string;
  address?: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}
