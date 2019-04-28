export interface AuthData {
  id: number; // change to number
  password: string;
  fullName: string;
  country: string;
  age: number;
}

export interface AuthDataLogin {
  id: number;
  password: string;
}
