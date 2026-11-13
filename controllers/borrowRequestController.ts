
import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import BorrowRequest from '../models/BorrowRequest.ts';
import Tool from '../models/Tool.ts';

// CREATE: Submit a new borrow request
export async function createBorrowRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { tool, startDate, endDate } = req.body ?? {};

    // Check required fields
    if (!tool || !startDate || !endDate) {
      res.status(400).json({
        error: 'Tool, start date, and end date are required',
      });
      return;
    }

    // Validate Tool ObjectId
    if (!mongoose.isObjectIdOrHexString(tool)) {
      res.status(400).json({ error: 'Invalid tool ID' });
      return;
    }

    // Check whether the tool actually exists
    const existingTool = await Tool.findById(tool);

    if (!existingTool) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    // Only available tools can be requested
    if (!existingTool.isAvailable) {
      res.status(409).json({
        error: 'Tool is currently unavailable',
      });
      return;
    }

    // Prevent users from borrowing their own equipment
    if (existingTool.owner.toString() === req.userId.toString()) {
      res.status(400).json({
        error: 'You cannot borrow your own tool',
      });
      return;
    }

    // Validate borrowing dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      !Number.isFinite(start.getTime()) ||
      !Number.isFinite(end.getTime()) ||
      end <= start
    ) {
      res.status(400).json({ error: 'Invalid borrowing dates' });
      return;
    }

    // Save the borrowing request in MongoDB
    const borrowRequest = await BorrowRequest.create({
      borrower: req.userId,
      tool: existingTool._id,
      startDate: start,
      endDate: end,
    });

    res.status(201).json(borrowRequest);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }

    next(error);
  }
}

// READ: View your own borrow requests
export async function getMyBorrowRequests(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const requests = await BorrowRequest.find({
      borrower: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
}

// READ: View one borrow request
export async function getBorrowRequestById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      res.status(400).json({ error: 'Invalid request ID' });
      return;
    }

    // Users can only view their own requests
    const request = await BorrowRequest.findOne({
      _id: id,
      borrower: req.userId,
    });

    if (!request) {
      res.status(404).json({
        error: 'Borrow request not found',
      });
      return;
    }

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
}

// UPDATE: Change the dates of a pending borrow request
export async function updateBorrowRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      res.status(400).json({ error: 'Invalid request ID' });
      return;
    }

    // Find only a request owned by this borrower
    const request = await BorrowRequest.findOne({
      _id: id,
      borrower: req.userId,
    });

    if (!request) {
      res.status(404).json({
        error: 'Borrow request not found',
      });
      return;
    }

    if (request.status !== 'pending') {
      res.status(400).json({
        error: 'Only pending requests can be updated',
      });
      return;
    }

    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({
        error: 'A JSON object is required',
      });
      return;
    }

    const allowedFields = ['startDate', 'endDate'];
    const submittedFields = Object.keys(body);

    if (
      submittedFields.length === 0 ||
      submittedFields.some((field) => !allowedFields.includes(field))
    ) {
      res.status(400).json({
        error: 'Only startDate and endDate can be updated',
      });
      return;
    }

    // Update dates if provided
    if (body.startDate !== undefined) {
      request.startDate = new Date(body.startDate);
    }

    if (body.endDate !== undefined) {
      request.endDate = new Date(body.endDate);
    }

    // Mongoose runs the date validation in the model
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }

    next(error);
  }
}

// DELETE: Cancel your own pending borrow request
export async function deleteBorrowRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      res.status(400).json({ error: 'Invalid request ID' });
      return;
    }

    // Users can only cancel their own requests
    const request = await BorrowRequest.findOne({
      _id: id,
      borrower: req.userId,
    });

    if (!request) {
      res.status(404).json({
        error: 'Borrow request not found',
      });
      return;
    }

    if (request.status !== 'pending') {
      res.status(400).json({
        error: 'Only pending requests can be cancelled',
      });
      return;
    }

    await request.deleteOne();

    res.status(200).json({
      message: 'Borrow request cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
}
