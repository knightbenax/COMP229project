import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Tool from '../models/Tool.ts';

// CREATE: Add a tool owned by the authenticated user.
export async function createTool(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'A JSON object is required' });
      return;
    }

    const allowedFields = [
      'name',
      'category',
      'description',
      'condition',
      'isAvailable',
    ];

    if (Object.keys(body).some((field) => !allowedFields.includes(field))) {
      res.status(400).json({ error: 'Unsupported tool field' });
      return;
    }

    const requiredFields = [
      'name',
      'category',
      'description',
      'condition',
    ];

    for (const field of requiredFields) {
      if (typeof body[field] !== 'string' || !body[field].trim()) {
        res.status(400).json({
          error: `${field} must be a non-empty string`,
        });
        return;
      }
    }

    if (
      body.isAvailable !== undefined &&
      typeof body.isAvailable !== 'boolean'
    ) {
      res.status(400).json({
        error: 'isAvailable must be a boolean',
      });
      return;
    }

    const tool = await Tool.create({
      name: body.name,
      category: body.category,
      description: body.description,
      condition: body.condition,
      isAvailable: body.isAvailable ?? true,
      owner: req.userId,
    });

    res.status(201).json(tool);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }

    next(error);
  }
}

// READ: List tools, optionally filtered by availability.
export async function getTools(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const availability = req.query.isAvailable;

    if (
      availability !== undefined &&
      availability !== 'true' &&
      availability !== 'false'
    ) {
      res.status(400).json({
        error: 'isAvailable query parameter must be true or false',
      });
      return;
    }

    const filter =
      availability === undefined
        ? {}
        : { isAvailable: availability === 'true' };

    const tools = await Tool.find(filter).sort({ createdAt: -1 });

    res.status(200).json(tools);
  } catch (error) {
    next(error);
  }
}

// READ: Get one tool.
export async function getToolById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      res.status(400).json({ error: 'Invalid tool ID' });
      return;
    }

    const tool = await Tool.findById(id);

    if (!tool) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    res.status(200).json(tool);
  } catch (error) {
    next(error);
  }
}

// UPDATE: Only the owner can edit a tool.
export async function updateTool(
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
      res.status(400).json({ error: 'Invalid tool ID' });
      return;
    }

    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'A JSON object is required' });
      return;
    }

    const allowedFields = [
      'name',
      'category',
      'description',
      'condition',
      'isAvailable',
    ];

    const submittedFields = Object.keys(body);

    if (
      submittedFields.length === 0 ||
      submittedFields.some((field) => !allowedFields.includes(field))
    ) {
      res.status(400).json({
        error: 'Provide at least one supported tool field',
      });
      return;
    }

    for (const field of ['name', 'category', 'description', 'condition']) {
      if (
        Object.prototype.hasOwnProperty.call(body, field) &&
        (typeof body[field] !== 'string' || !body[field].trim())
      ) {
        res.status(400).json({
          error: `${field} must be a non-empty string`,
        });
        return;
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(body, 'isAvailable') &&
      typeof body.isAvailable !== 'boolean'
    ) {
      res.status(400).json({
        error: 'isAvailable must be a boolean',
      });
      return;
    }

    const tool = await Tool.findById(id);

    if (!tool) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    if (!tool.owner.equals(req.userId)) {
      res.status(403).json({
        error: 'You can only update your own tools',
      });
      return;
    }

    if (body.name !== undefined) tool.name = body.name;
    if (body.category !== undefined) tool.category = body.category;
    if (body.description !== undefined) tool.description = body.description;
    if (body.condition !== undefined) tool.condition = body.condition;
    if (body.isAvailable !== undefined) {
      tool.isAvailable = body.isAvailable;
    }

    await tool.save();

    res.status(200).json(tool);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }

    next(error);
  }
}

// DELETE: Only the owner can remove a tool.
export async function deleteTool(
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
      res.status(400).json({ error: 'Invalid tool ID' });
      return;
    }

    const tool = await Tool.findById(id);

    if (!tool) {
      res.status(404).json({ error: 'Tool not found' });
      return;
    }

    if (!tool.owner.equals(req.userId)) {
      res.status(403).json({
        error: 'You can only delete your own tools',
      });
      return;
    }

    await tool.deleteOne();

    res.status(200).json({
      message: 'Tool deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}