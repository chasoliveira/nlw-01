import knexConn from '../database/connection';
import Item, { ItemScheme } from '../Models/Item';
import { PointItemScheme } from '../Models/PointItem';

export interface IItemServices {
  listAsync(): Promise<Item[]>;
  byPointIdAsync(point_id: number): Promise<Item[]>;
}

class ItemServices implements IItemServices {
  private readonly knexItem = () => knexConn(ItemScheme.table);

  private serializeList = (items: Item[]) => items.map(item => this.serialize(item));
  private serialize = (item: Item) => ({ ...item, image_url: `/uploads/${item.image}` });

  listAsync = async () => { 
    const items = await this.knexItem().select<Item[]>();
    return this.serializeList(items);
  }

  byPointIdAsync = async (point_id: number) => await this.knexItem()
    .join(PointItemScheme.table, PointItemScheme.join.item.id, '=', PointItemScheme.join.item.item_id)
    .where(PointItemScheme.where.point_id, point_id)
    .select<Item[]>(ItemScheme.select.title);
}
export default ItemServices;
