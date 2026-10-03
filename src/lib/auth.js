import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from "resend";

const client = new MongoClient(process.env.MONGODB_URL);

const db = client.db("better-auth-db");

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      try {
        const { data, error } = await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: user.email,
          subject: "Reset your password",
          html: `
            <h4>Reset your password</h4>
            <p>Click the link to reset your password:</p>
            <a href="${url}">${url}</a>
            <p>Ignore this email if you haven't requested a password reset.</p>
          `,
        });

        if (error) {
          console.error("Resend sendResetPassword error:", error);
        } else {
          console.log("Resend sendResetPassword success:", data);
        }
      } catch (err) {
        console.error("Failed to send reset password email:", err);
      }
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const { data, error } = await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: user.email,
          subject: "Verify your email address",
          html: `
            <h1>Please verify your email address</h1>
            <p>
              Click <a href="${url}">here</a> to verify your email address.
            </p>
          `,
        });

        if (error) {
          console.error("Resend sendVerificationEmail error:", error);
        } else {
          console.log("Resend sendVerificationEmail success:", data);
        }
      } catch (err) {
        console.error("Failed to send verification email:", err);
      }
    },

    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expirationTime: 7 * 24 * 3600,
  },

  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET,
    },

    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET,
    },

    discord: {
      clientId: process.env.BETTER_AUTH_DISCORD_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_DISCORD_SECRET,
    },
  },
});