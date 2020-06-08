import { nameof } from "../Utils";
import Schemes from "./Schemes";

interface PointItem {
  id: null;
  point_id: number;
  item_id: number;
}

const columns = {
  id: nameof<PointItem>("id").toString(),
  pointId: nameof<PointItem>("point_id").toString(),
  itemId: nameof<PointItem>("item_id").toString()
};
export const PointItemScheme = {
  table: Schemes.point_items,
  columns,
  join: {
    point: {
      id: `${Schemes.points}.id`,
      point_id: `${Schemes.point_items}.${columns.pointId}`,
    },
    item: {
      id: `${Schemes.items}.id`,
      item_id: `${Schemes.point_items}.${columns.itemId}`,
    }
  },
  where: {
    point_id: `${Schemes.point_items}.${columns.pointId}`,
    item_id: `${Schemes.point_items}.${columns.itemId}`,
  }
}
export default PointItem;