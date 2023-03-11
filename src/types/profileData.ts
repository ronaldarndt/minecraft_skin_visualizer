export interface UsernameHistory {
  username: string;
}

export interface Skin {
  url: string;
  data: string;
}

export interface Raw {
  value: string;
  signature: string;
}

export interface Textures {
  custom: boolean;
  slim: boolean;
  skin: Skin;
  raw: Raw;
}

export interface ProfileData {
  uuid: string;
  username: string;
  username_history: UsernameHistory[];
  textures: Textures;
  created_at: string;
}
