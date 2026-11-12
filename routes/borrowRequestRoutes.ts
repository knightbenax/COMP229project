
import { Router } from 'express';
import requireAuth from '../middleware/auth.ts';

import {
  createBorrowRequest,
  getMyBorrowRequests,
  getBorrowRequestById,
  updateBorrowRequest,
  deleteBorrowRequest,
} from '../controllers/borrowRequestController.ts';

const router = Router();

// Require authentication for every borrow-request endpoint
router.use(requireAuth);

router.post('/', createBorrowRequest);
router.get('/mine', getMyBorrowRequests);
router.get('/:id', getBorrowRequestById);
router.patch('/:id', updateBorrowRequest);
router.delete('/:id', deleteBorrowRequest);

export default router;
