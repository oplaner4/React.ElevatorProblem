import { getNewId } from './idIncrementer';
import IUniqueModel from 'app/models/IUniqueModel';

/**
 * Modifies record in the database based on its id.
 * @param id Unique identifier of the model.
 * @param modifier Handler which changes properties.
 * @param records Source records.
 * @returns Modified records.
 */
export function modifyRecord<T extends IUniqueModel>(
  id: number,
  modifier: (newModel: T) => void,
  records: Record<number, T>
): Record<number, T> {
  const newRecords = { ...records };
  const newRecord = { ...records[id] };
  modifier(newRecord);
  newRecords[id] = newRecord;
  return newRecords;
}

/**
 * Updates record in the database based on its id.
 * @param model Updated model with other object reference
 * than the database model.
 * @param records Source records.
 * @returns Modified records.
 */
export function updateRecord<T extends IUniqueModel>(model: T, records: Record<number, T>): Record<number, T> {
  const newRecords = { ...records };
  newRecords[model.id] = model;
  return newRecords;
}

/**
 * Adds record into the database. It generates unique identifier.
 * @param model Model to add.
 * @param records Source records.
 * @returns Modified records.
 */
export function addRecord<T extends IUniqueModel>(model: T, records: Record<number, T>): Record<number, T> {
  const newRecords = { ...records };
  const newId = getNewId(records);
  model.id = newId;
  newRecords[newId] = model;
  return newRecords;
}

/**
 * Deletes record from the database.
 * @param modifier Handler which changes properties.
 * @param id Unique identifier of the model to be deleted.
 * @param records Source records.
 * @returns Modified records.
 */
export function deleteRecord<T extends IUniqueModel>(id: number, records: Record<number, T>): Record<number, T> {
  const newRecords = { ...records };
  delete newRecords[id];
  return newRecords;
}

/**
 * Deletes more records from the database.
 * @param modifier Handler which changes properties.
 * @param ids Unique identifiers of the models to be deleted.
 * @param records Source records.
 * @returns Modified records.
 */
export function deleteMoreRecords<T extends IUniqueModel>(
  ids: number[] | Set<number>,
  records: Record<number, T>
): Record<number, T> {
  const newRecords = { ...records };
  ids.forEach((id) => {
    delete newRecords[id];
  });
  return newRecords;
}
