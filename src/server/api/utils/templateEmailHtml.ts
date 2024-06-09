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
    header: "Your Ticket Has Successfully Submitted",
    body: `Thank you, ${name}! Your ticket #${ticketCode} was successfully recorded in our system.
      Please check the ticket regularly for updates or  if you need any follow up please contact our technician.`,
    hyperlink: {
      title: "Link to track your ticket:",
      link: `${process.env.NEXTAUTH_URL}/track/${ticketCode}`,
    },
  });
  const studentSubject = `Success Submit Ticket #${ticketCode}`;
  await sendEmail(email, studentSubject, html);
}

export async function sendReceiveTicketEmail(
  email: string,
  ticketCode: string
) {
  const html = getTemplateEmail({
    header: "Dear PIC,",
    body: `Your department receive ticket with ID #${ticketCode}. Please check incoming ticket regularly and follow up all your ticket accordingly.`,
  });
  const studentSubject = `New Ticket Received!`;
  await sendEmail(email, studentSubject, html);
}

export async function sendUnassignedTicketEmail(
  email: string,
  ticketCode: string
) {
  const html = getTemplateEmail({
    header: `Dear Admin,`,
    body: `A new unassigned ticket has been created. Please check and assign it to a department accordingly from your dashboard.`,
    hyperlink: {
      title: "Dashboard URL:",
      link: `${process.env.NEXTAUTH_URL}/admin/ticket/${ticketCode}`,
    },
  });
  const studentSubject = `New Ticket Received!`;
  await sendEmail(email, studentSubject, html);
}

export async function sendBulkAssignTicketEmail(
  email: string,
  name: string,
  numberOfTickets: number
) {
  const html = getTemplateEmail({
    header: `Dear ${name},`,
    body: `You have been assigned ${numberOfTickets} ticket(s). Please check and follow up your ticket accordingly.`,
    addons: ["Thank you."],
    hyperlink: {
      title: "Dashboard URL:",
      link: `${process.env.NEXTAUTH_URL}/technician/dashboard`,
    },
  });
  const studentSubject = `Assigned ${numberOfTickets} Tickets!`;
  await sendEmail(email, studentSubject, html);
}

export async function sendSolveTicketEmail(
  email: string,
  name: string,
  ticketCode: string
) {
  const html = getTemplateEmail({
    header: "Your Ticket Has Been Solved",
    body: `Hi ${name}! Your ticket #${ticketCode} has been solved.`,
    addons: [
      "Should you still have any inquiry do not hesitate	to contact our admin/technician.",
      "Thank you.",
    ],
  });
  const studentSubject = `Ticket Solved #${ticketCode}`;
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
