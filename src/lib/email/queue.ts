import { sendEmail } from "@/lib/email/resend";

type EmailJob = {
  to: string;
  subject: string;
  text: string;
};

export async function enqueueEmail(job: EmailJob) {
  return sendEmail(job);
}
