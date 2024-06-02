/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { sendEmail } from "./email";
import { getTemplateEmail } from "./templateHtml";

export async function sendCreateTicketEmail(
  email: string,
  name: string,
  ticketCode: string
) {
  const html = getTemplateEmail({
    header: "Your Issue Successfully Submitted",
    body: `Thank you, ${name}! Your ticket (with ID #${ticketCode}) was successfully recorded on our system.
      We will inform you back when the ticket is solved or need any follow up.`,
    hyperlink: {
      title: "Link to track your ticket:",
      link: `${process.env.NEXTAUTH_URL}/track/${ticketCode}`,
    },
  });
  const studentSubject = `Your Issue Successfully Submitted #${ticketCode}`;
  await sendEmail(email, studentSubject, html);
}

export async function sendReceiveTicketEmail(
  email: string,
  ticketCode: string
) {
  const html = getTemplateEmail({
    header: "Dear PIC,",
    body: `Your department receive ticket with ID #${ticketCode}. Don't forget to follow up all your ticket.`,
  });
  const studentSubject = `Ticket Received!`;
  await sendEmail(email, studentSubject, html);
}

export async function sendAssignTicketEmail(
  email: string,
  name: string,
  ticketCode: string
) {
  const html = getTemplateEmail({
    header: `Dear ${name},`,
    body: `You have been assigned to ticket with ID #${ticketCode}. Don't forget to follow up all your ticket.`,
    hyperlink: {
      title: "Dashboard URL:",
      link: `${process.env.NEXTAUTH_URL}/technician/dashboard`,
    },
  });
  const studentSubject = `Ticket Received!`;
  await sendEmail(email, studentSubject, html);
}

export async function sendUnassignedTicketEmail(
  email: string,
  ticketCode: string
) {
  const html = getTemplateEmail({
    header: `Dear Admin,`,
    body: `An unassgined ticket has been created. Please assign it to a department from your dashboard.`,
    hyperlink: {
      title: "Dashboard URL:",
      link: `${process.env.NEXTAUTH_URL}/admin/ticket/${ticketCode}`,
    },
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
    hyperlink: {
      title: "Dashboard URL:",
      link: `${process.env.NEXTAUTH_URL}/technician/dashboard`,
    },
  });
  const studentSubject = `Ticket Received!`;
  await sendEmail(email, studentSubject, html);
}

export async function sendSolveTicketEmail(
  email: string,
  name: string,
  ticketCode: string
) {
  const html = getTemplateEmail({
    header: "Your Issue Has Been Solved",
    body: `Hi ${name}! Your ticket (with ID #${ticketCode}) has been solved.`,
    addons: ["Many thanks for trusting our services!"],
    hyperlink: {
      title: `See your ticket`,
      link: `${process.env.NEXTAUTH_URL}/track/${ticketCode}`,
    },
  });
  const studentSubject = `Solved Issue #${ticketCode}`;
  await sendEmail(email, studentSubject, html);
}

export async function sendCreateTechnicianAccount(
  email: string,
  name: string,
  password: string
) {
  const html = getTemplateEmail({
    header: "Account Successfully Created",
    body: `Hi ${name}! Your email has been registered as a Technician on Northport Helpdesk. Here is your account's details,`,
    addons: [`Email : ${email}`, `Password : ${password}`],
    hyperlink: {
      title: `See Northport Helpdesk,`,
      link: `${process.env.NEXTAUTH_URL}/technician`,
    },
  });
  const studentSubject = "Your Email Has Been Registered";
  await sendEmail(email, studentSubject, html);
}
