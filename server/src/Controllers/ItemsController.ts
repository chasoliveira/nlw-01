import { Request, Response } from 'express';
import { IItemServices } from '../Services/ItemServices';

class ItemsController {
  private readonly _itemService: IItemServices;
  constructor(itemService: IItemServices) {
    this._itemService = itemService;
  }

  getAsync = async (req: Request, res: Response) => {
    const items = await this._itemService.listAsync();
    return res.json(items);
  }
}

export default ItemsController