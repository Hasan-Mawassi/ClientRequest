import { Router } from "express";

import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
  getDashboardStats,
  getMonthlyDashboardStats,
} from "./request.controller.js";

import { validate } from "../../middlewares/validation.middleware.js";

import {
  createRequestSchema,
  updateRequestStatusSchema,
  requestIdSchema,
  requestQuerySchema,
} from "./request.validation.js";

import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate({
    body: createRequestSchema,
  }),
  createRequest,
);

router.get(
  "/",
  validate({
    query: requestQuerySchema,
  }),
  getRequests,
);
router.get("/dashboard/stats", getDashboardStats);

router.get("/dashboard/monthly", getMonthlyDashboardStats);
router.get(
  "/:id",
  validate({
    params: requestIdSchema,
  }),
  getRequestById,
);

router.delete(
  "/:id",
  validate({
    params: requestIdSchema,
  }),
  deleteRequest,
);

router.patch(
  "/:id/status",
  validate({
    params: requestIdSchema,
    body: updateRequestStatusSchema,
  }),
  updateRequestStatus,
);

export default router;
