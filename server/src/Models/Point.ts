import { nameof } from "../Utils";
import Schemes from "./Schemes";

interface Point {
  id: number;
  name: string;
  image: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string
}

const columns = {
  id: nameof<Point>("id").toString(),
  name: nameof<Point>("name").toString(),
  image: nameof<Point>("image").toString(),
  email: nameof<Point>("email").toString(),
  whatsapp: nameof<Point>("whatsapp").toString(),
  latitude: nameof<Point>("latitude").toString(),
  longitude: nameof<Point>("longitude").toString(),
  city: nameof<Point>("city").toString(),
  uf: nameof<Point>("uf").toString()
};
export const PointScheme = {
  table: Schemes.points,
  columns,
  where: {
    city: `${Schemes.points}.${columns.city}`,
    uf: `${Schemes.points}.${columns.uf}`,
  },
  select: {
    all: `${Schemes.points}.*`
  }
}

export default Point;