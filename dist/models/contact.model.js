"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModel = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class ContactModel {
    static async findEmailOrPhone(email, phoneNumber) {
        return prisma_1.default.contact.findMany({
            where: {
                deletedAt: null,
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(phoneNumber ? [{ phoneNumber }] : []),
                ],
            },
        });
    }
    static async findAllByPrimaryIds(primaryIds) {
        return prisma_1.default.contact.findMany({
            where: {
                deletedAt: null,
                OR: [{ id: { in: primaryIds } }, { linkedId: { in: primaryIds } }],
            },
        });
    }
    static async findAllUnderPrimary(primaryId) {
        return prisma_1.default.contact.findMany({
            where: {
                deletedAt: null,
                OR: [{ id: primaryId }, { linkedId: primaryId }],
            },
        });
    }
    static async createPrimary(email, phoneNumber) {
        return prisma_1.default.contact.create({
            data: {
                email: email ?? null,
                phoneNumber: phoneNumber ?? null,
                linkPrecedence: "primary",
            },
        });
    }
    static async createSecondary(email, phoneNumber, linkedId) {
        return prisma_1.default.contact.create({
            data: {
                email: email ?? null,
                phoneNumber: phoneNumber ?? null,
                linkedId,
                linkPrecedence: "secondary",
            },
        });
    }
    static async demoteToSecondary(id, newLinkedId) {
        await prisma_1.default.contact.update({
            where: { id },
            data: {
                linkPrecedence: "secondary",
                linkedId: newLinkedId,
            },
        });
    }
}
exports.ContactModel = ContactModel;
