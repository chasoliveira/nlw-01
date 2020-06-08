import { nameof } from "../Utils";
import Schemes from "./Schemes";

interface Item {
  id: number;
  title: string;
  image: string;
}

const columns = {
  id: nameof<Item>("id").toString(),
  title: nameof<Item>("title").toString(),
  image: nameof<Item>("image").toString()
};

export const ItemScheme = {
  table: Schemes.items,
  columns,
  where: {
    id: `${Schemes.items}.${columns.id}`
  },
  select: {
    title: `${Schemes.items}.${columns.title}`,
  }
}

export default Item;

