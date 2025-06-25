
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteEmailRequest {
  email: string;
  role: string;
  token: string;
  invitedBy: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, role, token, invitedBy }: InviteEmailRequest = await req.json();
    
    const appUrl = Deno.env.get("SUPABASE_URL")?.replace("https://", "https://app.");
    const inviteUrl = `${appUrl || "http://localhost:5173"}/auth?invite=${token}`;

    const emailResponse = await resend.emails.send({
      from: "Project Manager <onboarding@resend.dev>",
      to: [email],
      subject: "You've been invited to join Project Manager",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; margin-bottom: 20px;">You're Invited!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            You've been invited by ${invitedBy} to join Project Manager as a <strong>${role}</strong> user.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            This invitation will expire in 24 hours. If you didn't expect this invitation, 
            you can safely ignore this email.
          </p>
          <p style="color: #999; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${inviteUrl}" style="color: #007bff;">${inviteUrl}</a>
          </p>
        </div>
      `,
    });

    console.log("Invite email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending invite email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
