import { sendViaAfricasTalking } from "@/lib/sms/africastalking";

export async function enqueueSms(to: string, message: string) {
  return sendViaAfricasTalking({ to, message });
}
