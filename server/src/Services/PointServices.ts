import knexConn from '../database/connection';
import Point, { PointScheme } from '../Models/Point';
import Knex from 'knex';
import { PointItemScheme } from '../Models/PointItem';

export interface IPointServices {
  findAsync(id: number): Promise<Point>;
  listAsync(): Promise<Point[]>;
  filteredAsync(city: string, uf: string, items: number[]): Promise<Point[]>;
  insertAsync(point: Point, items: number[]): Promise<Point | undefined>;
  updateAsync(point: Point): Promise<void>;
  deleteAsync(id: number): Promise<void>;
}

class PointServices implements IPointServices {

  private _knexTrx: Knex.Transaction<any, any> | undefined;

  private readonly knexPoint = () => knexConn(PointScheme.table);

  private knexTrx = async () => this._knexTrx || (this._knexTrx = await knexConn.transaction());
  private serializeList = (points: Point[]) => points.map(point => this.serialize(point));
  private serialize = (point: Point) => ({ ...point, image_url: `/uploads/${point.image}` });

  listAsync = async () => {
    const points = await this.knexPoint().select<Point[]>();
    return this.serializeList(points);
  }

  findAsync = async (id: number) => {
    const point = await this.knexPoint().where(PointScheme.columns.id, id).first<Point>();
    return this.serialize(point);
  }

  filteredAsync = async (city: string, uf: string, items: number[]) => {
    const points = await this.knexPoint()
      .join(PointItemScheme.table, PointItemScheme.join.point.id, '=', PointItemScheme.join.point.point_id)
      .whereIn(PointItemScheme.where.item_id, items)
      .where(PointScheme.where.city, city)
      .where(PointScheme.where.uf, uf)
      .distinct()
      .select<Point[]>(PointScheme.select.all);
    return this.serializeList(points);
  }

  insertAsync = async (point: Point, items: number[]) => {
    const trx = await this.knexTrx();
    try {
      const insertedIds = await trx(PointScheme.table).insert(point);
      const point_id = insertedIds[0];
      const pointItems = items
        .map((item_id: number) => ({ item_id, point_id }));

      await trx(PointItemScheme.table).insert(pointItems);

      await trx.commit();
      return { id: point_id, ...this.serialize(point) } as Point;
    } catch (error) {
      console.error('Ooops!, Somthing went wrong while try to save a Point.', error);
      await trx.rollback();
      return undefined;
    }
  }

  updateAsync = async (point: Point) => {
    const trx = await this.knexTrx();
    try {
      await trx(PointScheme.table)
        .where(PointScheme.columns.id, '=', point.id)
        .update({
          name: point.name,
          imagem: point.image,
          email: point.email,
          whatsapp: point.whatsapp,
          latitude: point.latitude,
          longitude: point.longitude,
          city: point.city,
          uf: point.uf,
        });
      await trx.commit();
    } catch (error) {
      console.error('Ooops!, Somthing went wrong while try to update a Point.', error);
      await trx.rollback();
    }
  }

  deleteAsync = async (id: number) => {
    const trx = await this.knexTrx();
    try {
      await trx(PointScheme.table).where(PointScheme.columns.id, id).del();
      await trx.commit();
    } catch (error) {
      console.error('Ooops!, Somthing went wrong while try to delete a Point.', error);
      await trx.rollback();
    }
  }
}

export default PointServices;