/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { sendEmail } from "./email";
import { getTemplateEmail } from "./templateHtml";

export async function sendCreateTicketEmail(
  email: string,
  name: string,
  ticketId: number | string
) {
  const html = getTemplateEmail({
    header: "Your Issue Successfully Submitted",
    body: `Thank you, ${name}! Your ticket (with ID #${ticketId}) was successfully recorded on our system.
      We will inform you back when the ticket is solved or need any follow up.`,
    hyperlink: {
      title: "Link to track your ticket:",
      link: `${process.env.NEXTAUTH_URL}/track/${ticketId}`,
    },
  });
  const studentSubject = `Your Issue Successfully Submitted #${ticketId}`;
  await sendEmail(email, studentSubject, html);
}

export async function sendReceiveTicketEmail(
  email: string,
  ticketId: number | string
) {
  const html = getTemplateEmail({
    header: "Dear PIC,",
    body: `Your department receive ticket with ID #${ticketId}. Don't forget to follow up all your ticket.`,
  });
  const studentSubject = `Ticket Received!`;
  await sendEmail(email, studentSubject, html);
}

export async function sendAssignTicketEmail(
  email: string,
  name: string,
  ticketId: number | string
) {
  const html = getTemplateEmail({
    header: `Dear ${name},`,
    body: `You have been assigned to ticket with ID #${ticketId}. Don't forget to follow up all your ticket.`,
  });
  const studentSubject = `Ticket Received!`;
  await sendEmail(email, studentSubject, html);
}

export async function sendBulkAssignTicketEmail(
  email: string,
  name: string,
  numberOfTickets: number
) {
  const html = getTemplateEmail({
    header: `Dear ${name},`,
    body: `You have been assigned ${numberOfTickets} ticket(s). Don't forget to follow up all your ticket.`,
  });
  const studentSubject = `Ticket Received!`;
  await sendEmail(email, studentSubject, html);
}

export async function sendSolveTicketEmail(
  email: string,
  name: string,
  ticketId: number | string
) {
  const html = getTemplateEmail({
    header: "Your Issue Has Been Solved",
    body: `Hi ${name}! Your ticket (with ID #${ticketId}) has been solved.`,
    addons: ["Many thanks for trusting our services!"],
    hyperlink: {
      title: `See your ticket`,
      link: `${process.env.NEXTAUTH_URL}/track/${ticketId}`,
    },
  });
  const studentSubject = `Solved Issue #${ticketId}`;
  await sendEmail(email, studentSubject, html);
}
