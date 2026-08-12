import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { createCategorySchema, updateCategorySchema } from '../validations/category.validation';

const router = Router();

router.use(protect); // every category route requires auth

router.post('/', validate(createCategorySchema), categoryController.create);
router.get('/', categoryController.list);
router.get('/:uuid', categoryController.getOne);
router.patch('/:uuid', validate(updateCategorySchema), categoryController.update);
router.delete('/:uuid', categoryController.remove);

export default router;