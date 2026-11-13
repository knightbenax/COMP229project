import { Router } from 'express';
import requireAuth from '../middleware/auth.ts';

import {
  createTool,
  getTools,
  getToolById,
  updateTool,
  deleteTool,
} from '../controllers/toolController.ts';

const router = Router();

// Public read endpoints
router.get('/', getTools);
router.get('/:id', getToolById);

// Authenticated write endpoints
router.post('/', requireAuth, createTool);
router.put('/:id', requireAuth, updateTool);
router.delete('/:id', requireAuth, deleteTool);

export default router;