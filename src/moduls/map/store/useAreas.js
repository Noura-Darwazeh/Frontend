import { getAreas, postArea ,deleteArea } from './map.js';

export default function useAreas() {
  return { getAreas, postArea, deleteArea };
}
