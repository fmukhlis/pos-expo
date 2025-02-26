export interface StorePayload {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Store extends StorePayload {
  id: number;
  createdAt: string;
}

export interface DetailedStore extends Store {
  owner: {
    id: number;
    name: string;
  };
}
