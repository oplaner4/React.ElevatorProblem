export default interface ISetterProps<T> {
  modelId: number;
  onCorrectlySet: (model: T) => void;
}
