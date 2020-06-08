import { Request, Response } from 'express';
import { IPointServices } from '../Services/PointServices';
import Point from '../Models/Point';
import { IItemServices } from '../Services/ItemServices';

class PointsController {
  private readonly _pointService: IPointServices;
  private readonly _itemService: IItemServices;

  constructor(pointService: IPointServices, itemService: IItemServices) {
    this._itemService = itemService;
    this._pointService = pointService;
  }

  getAsync = async (req: Request, res: Response) => {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));
    let points: Point[] = [];

    if (!city || !uf || !items)
      points = await this._pointService.listAsync();
    else
      points = await this._pointService.filteredAsync(String(city), String(uf), parsedItems);

    return res.json(points);
  }

  showAsync = async (req: Request, res: Response) => {
    const { id } = req.params;

    const point = await this._pointService.findAsync(Number(id));
    if (!point)
      return res.status(400).json({ message: 'Point not found.' });

    const items = await this._itemService.byPointIdAsync(Number(id));
    
    return res.json({ point, items });
  }

  insertAsync = async (req: Request, res: Response) => {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body;
    try {
      const point = { image: req.file.filename, name, email, whatsapp, latitude, longitude, city, uf } as Point;
      
      const pointItems: number[] = items
        .split(',')
        .map((item: string) => Number(item.trim()));

      const result = await this._pointService.insertAsync(point, pointItems);
      if (result)
        return res.status(201).json(result);
      return res.status(400).json({ error: 'Something went wroong on your request!' });

    } catch (error) {
      res.status(500).json({ message: 'Ooops!', error })
    }
  }
}

export default PointsController;