import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmails";
import { ApiResponce } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponce> {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
        });
        console.log(data)
        return {success: true, message: 'Verification code send successfully'}
    } catch (emailError) {
        console.error("Resend Error:", emailError);

    return {
        success: false,
        message: "Failed to send verification code"
    };
    }
}