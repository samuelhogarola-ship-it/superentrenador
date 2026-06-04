import type { ClientInput } from '../../types/domain';

export const emptyClientForm: ClientInput = {
  fullName: '',
  goal: 'ganar masa',
  daysPerWeek: 3,
  level: 'principiante',
  experience: '',
  baseSport: '',
  targetSport: '',
  age: null,
  weightKg: null,
  heightCm: null,
  notes: '',
};
