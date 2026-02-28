import { ContactModel } from "../models/contact.model";
import { Contact, IdentifyResponse } from "../types/contact.types";

export class ContactService {
  async identify(
    email?: string,
    phoneNumber?: string,
  ): Promise<IdentifyResponse> {
    const matches = await ContactModel.findEmailOrPhone(email, phoneNumber);

    if (matches.length === 0) {
      const contact = await ContactModel.createPrimary(email, phoneNumber);
      return this.buildResponse([contact]); //cheeck this later
    }

    const primaryIds = [
      ...new Set(
        matches.map((c) =>
          c.linkPrecedence === "primary" ? c.id : c.linkedId!,
        ),
      ),
    ];

    const allContacts = await ContactModel.findAllByPrimaryIds(primaryIds);

    const primaries = allContacts
      .filter((c) => c.linkPrecedence === "primary")
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    const truePrimary = primaries[0];

    for (const p of primaries.slice(1)) {
      await ContactModel.demoteToSecondary(p.id, truePrimary.id);
    }

    const allEmails = new Set(allContacts.map((c) => c.email).filter(Boolean));
    const allPhones = new Set(
      allContacts.map((c) => c.phoneNumber).filter(Boolean),
    );

    const hasNewInfo =
      (email && !allEmails.has(email)) ||
      (phoneNumber && !allPhones.has(phoneNumber));

    if (hasNewInfo) {
      await ContactModel.createSecondary(email, phoneNumber, truePrimary.id);
    }

    // Step 8: Fetch final state and return
    const finalContacts = await ContactModel.findAllUnderPrimary(
      truePrimary.id,
    );
    return this.buildResponse(finalContacts, truePrimary);
  }

  private buildResponse(
    contacts: Contact[],
    primary?: Contact,
  ): IdentifyResponse {
    const truePrimary = primary ?? contacts[0];

    const emails = [
      truePrimary.email,
      ...contacts.filter((c) => c.id !== truePrimary.id).map((c) => c.email),
    ].filter((v, i, a) => v && a.indexOf(v) === i) as string[];

    const phoneNumbers = [
      truePrimary.phoneNumber,
      ...contacts
        .filter((c) => c.id !== truePrimary.id)
        .map((c) => c.phoneNumber),
    ].filter((v, i, a) => v && a.indexOf(v) === i) as string[];

    const secondaryContactIds = contacts
      .filter((c) => c.linkPrecedence === "secondary")
      .map((c) => c.id);

    return {
      contact: {
        primaryContactId: truePrimary.id,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    };
  }
}
