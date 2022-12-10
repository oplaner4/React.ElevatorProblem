import IElevator from 'app/models/IElevator';

/**
 * Chooses better candidate elevator from two given based on the target floor and current
 * floor of the elvators.
 * @param elevator1 The first elevator to choose from.
 * @param elevator2 The second elevator to choose from.
 * @param targetFloor The target floor.
 * @returns The better elevator id or null if none can run to this floor.
 */
export const chooseBetterElevator = (
  elevator1: IElevator,
  elevator2: IElevator,
  targetFloor: number
): number | null => {
  const canRun1 = targetFloor <= elevator1.highestFloor && targetFloor >= elevator1.lowestFloor;
  const canRun2 = targetFloor <= elevator2.highestFloor && targetFloor >= elevator2.lowestFloor;

  if (!canRun1 && !canRun2) {
    return null;
  }

  if (canRun1 && !canRun2) {
    return elevator1.id;
  }

  if (!canRun1 && canRun2) {
    return elevator2.id;
  }

  const time1 = Math.abs(elevator1.currentFloor - targetFloor) / elevator1.speed;
  const time2 = Math.abs(elevator2.currentFloor - targetFloor) / elevator2.speed;

  return time1 <= time2 ? elevator1.id : elevator2.id;
};
