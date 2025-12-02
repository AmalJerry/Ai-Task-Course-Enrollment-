export interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  max_capacity: number;
  teacher: number;       // teacher ID
  enrolled_count: number;
}