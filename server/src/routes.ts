import express from 'express';
import { celebrate, Joi } from 'celebrate';

import PointsController from './Controllers/PointsController';
import ItemsController from './Controllers/ItemsController';

import multer from 'multer';
import multerConfig from './config/multer';

import PointServices from './Services/PointServices';
import ItemServices from './Services/ItemServices';

const routes = express.Router();
const upload = multer(multerConfig);

const pointServices = new PointServices();
const itemServices = new ItemServices();

const pointControllers = new PointsController(pointServices, itemServices);
const itemsController = new ItemsController(itemServices);

routes.get('/items', itemsController.getAsync);
routes.get('/points', pointControllers.getAsync);
routes.get('/points/:id', pointControllers.showAsync);
routes.post('/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required().regex(/\(\d{2,}\) \d{1,} \d{4,}\-\d{4}/),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required()
    })
  },{
    abortEarly: false
  }),
  pointControllers.insertAsync);

export default routes;