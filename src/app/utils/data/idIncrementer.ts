import IUniqueModel from 'app/models/IUniqueModel';

export const getNewId = (records: Record<number, IUniqueModel>): number => {
  return Math.max(0, ...Object.values(records).map((b) => b.id)) + 1;
};
