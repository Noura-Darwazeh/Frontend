
// useAreas.js
import { getAreas, postArea, deleteArea, updateArea } from './map.js';

export default function useAreas() {
  return { getAreas, postArea, deleteArea, updateArea };
}
