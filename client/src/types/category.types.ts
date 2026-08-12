export interface Category {
  uuid: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
}