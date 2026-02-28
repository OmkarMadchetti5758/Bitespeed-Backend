"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdentifyRequest = void 0;
const validateIdentifyRequest = (req, res, next) => {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) {
        res.status(400).json({
            error: "At least one of email or phoneNumber is required",
        });
        return;
    }
    next();
};
exports.validateIdentifyRequest = validateIdentifyRequest;
