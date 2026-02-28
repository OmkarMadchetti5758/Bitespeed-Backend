import prisma from "../config/prisma";
import { Contact } from "../generated/prisma/client";

export class ContactModel {
  static async findEmailOrPhone(
    email?: string,
    phoneNumber?: string,
  ): Promise<Contact[]> {
    return prisma.contact.findMany({
      where: {
        deletedAt: null,
        OR: [
          ...(email ? [{ email }] : []),
          ...(phoneNumber ? [{ phoneNumber }] : []),
        ],
      },
    });
  }

  static async findAllByPrimaryIds(primaryIds: number[]): Promise<Contact[]> {
    return prisma.contact.findMany({
      where: {
        deletedAt: null,
        OR: [{ id: { in: primaryIds } }, { linkedId: { in: primaryIds } }],
      },
    });
  }

  static async findAllUnderPrimary(primaryId: number): Promise<Contact[]> {
    return prisma.contact.findMany({
      where: {
        deletedAt: null,
        OR: [{ id: primaryId }, { linkedId: primaryId }],
      },
    });
  }

  static async createPrimary(
    email?: string,
    phoneNumber?: string,
  ): Promise<Contact> {
    return prisma.contact.create({
      data: {
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
        linkPrecedence: "primary",
      },
    });
  }

  static async createSecondary(
    email: string | undefined,
    phoneNumber: string | undefined,
    linkedId: number,
  ): Promise<Contact> {
    return prisma.contact.create({
      data: {
        email: email ?? null,
        phoneNumber: phoneNumber ?? null,
        linkedId,
        linkPrecedence: "secondary",
      },
    });
  }

  static async demoteToSecondary(
    id: number,
    newLinkedId: number,
  ): Promise<void> {
    await prisma.contact.update({
      where: { id },
      data: {
        linkPrecedence: "secondary",
        linkedId: newLinkedId,
      },
    });
  }
}
