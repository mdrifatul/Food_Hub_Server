import { Router } from "express";
import { providerController } from "./provider.controller";

const router = Router();

router.post("/", providerController.createProviderProfile);
router.get("/:id", providerController.getProviderById);

export const providerRouter: Router = router;
