export interface ICreateRoom {
  name: string;
  max_participants?: number;
  created_by: string;
  room_code: string;
}
