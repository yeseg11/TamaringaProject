export interface AuthData {
  id: number; // change to number
  password: string;
  fullName: string;
  country: string;
  age: number;
  year: number;
  role: string;
}

export interface AuthDataLogin {
  id: number;
  password: string;
}
