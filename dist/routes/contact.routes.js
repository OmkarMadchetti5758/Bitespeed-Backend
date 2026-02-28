"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact.controller");
const validate_1 = require("../middlewares/validate");
const router = (0, express_1.Router)();
const contactController = new contact_controller_1.ContactController();
router.post('/identify', validate_1.validateIdentifyRequest, contactController.identify.bind(contactController));
exports.default = router;
