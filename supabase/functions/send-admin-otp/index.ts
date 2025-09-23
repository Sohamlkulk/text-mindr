import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  email: string;
  otp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminSecretKey = Deno.env.get("ADMIN_SECRET_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found");
      // If Resend is not configured, just log the OTP
      const { email, otp }: OTPRequest = await req.json();
      console.log(`Admin OTP for ${email}: ${otp}`);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "OTP logged to console (Resend not configured)",
        otp: otp // For development only
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const resend = new Resend(resendApiKey);
    const { email, otp }: OTPRequest = await req.json();

    console.log(`Sending admin OTP to ${email}: ${otp}`);

    const emailResponse = await resend.emails.send({
      from: "TextAnalyzer Admin <onboarding@resend.dev>",
      to: [email],
      subject: "Admin Portal - Login Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">🛡️ Admin Portal Access</h1>
            <p style="color: #666; font-size: 16px;">Login verification for TextAnalyzer AI</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 15px;">Your Verification Code</h2>
            <div style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes</p>
          </div>
          
          <div style="border-left: 4px solid #ffc107; padding: 15px; background: #fff8e1; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ Security Notice</p>
            <p style="margin: 5px 0 0 0; color: #856404;">
              This is an admin login attempt. If you did not request this, please contact your system administrator immediately.
            </p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This email was sent from the TextAnalyzer AI Admin Portal<br>
              Do not share this code with anyone
            </p>
          </div>
        </div>
      `,
    });

    console.log("Admin OTP email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "OTP sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-admin-otp function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);