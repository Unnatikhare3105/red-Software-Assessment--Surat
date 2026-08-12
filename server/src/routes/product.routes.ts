import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  stockAdjustSchema,
} from '../validations/product.validation';
import { upload } from '../utils/upload.util';

const router = Router();

router.use(protect);

router.post('/', validate(createProductSchema), productController.create);
router.get('/', validate(productQuerySchema, 'query'), productController.list);
router.get('/:uuid', productController.getOne);
router.patch('/:uuid', validate(updateProductSchema), productController.update);
router.delete('/:uuid', productController.remove);

router.patch('/:uuid/image', upload.single('image'), productController.uploadImage);

router.patch('/:uuid/stock/increase', validate(stockAdjustSchema), productController.increaseStock);
router.patch('/:uuid/stock/reduce', validate(stockAdjustSchema), productController.reduceStock);

export default router;