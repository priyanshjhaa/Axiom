import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('=== Authorize function called ===');
        console.log('Credentials received:', {
          email: credentials?.email,
          hasPassword: !!credentials?.password
        });

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          throw new Error("Email and password are required");
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log('Found user in database:', !!user ? 'YES' : 'NO');

        if (!user) {
          console.log('User not found for email:', credentials.email);
          throw new Error("No user found with this email");
        }

        console.log('Comparing passwords...');
        let isPasswordValid;
        try {
          isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log('Password comparison result:', isPasswordValid);
        } catch (bcryptError) {
          console.error('Password comparison error:', bcryptError);
          throw new Error("Password verification failed");
        }

        if (!isPasswordValid) {
          console.log('Password validation failed');
          throw new Error("Invalid password");
        }

        console.log('Authentication successful for:', credentials.email);
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
          plan: user.plan,
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
    signUp: '/signup',
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      console.log('=== SignIn callback ===');
      console.log('Provider:', account?.provider);

      // Handle Google OAuth users
      if (account?.provider === 'google') {
        const nameParts = user.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create new user in database
          console.log('Creating new user from Google OAuth');
          await prisma.user.create({
            data: {
              email: user.email,
              firstName,
              lastName,
              picture: user.image,
              password: '', // OAuth users don't have passwords
            },
          });
        } else {
          // Update existing user's picture if needed
          console.log('User exists, updating picture if needed');
          await prisma.user.update({
            where: { email: user.email },
            data: { picture: user.image },
          });
        }
      }

      // Handle GitHub OAuth users
      if (account?.provider === 'github') {
        const nameParts = user.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Check if user exists in database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create new user in database
          console.log('Creating new user from GitHub OAuth');
          await prisma.user.create({
            data: {
              email: user.email,
              firstName,
              lastName,
              picture: user.image,
              password: '', // OAuth users don't have passwords
            },
          });
        } else {
          // Update existing user's picture if needed
          console.log('User exists, updating picture if needed');
          await prisma.user.update({
            where: { email: user.email },
            data: { picture: user.image },
          });
        }
      }

      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        // For OAuth users (Google, GitHub, etc.)
        if (account?.provider === "google") {
          // Extract name from Google profile
          const nameParts = user.name?.split(' ') || ['', ''];
          token.firstName = nameParts[0] || user.name || '';
          token.lastName = nameParts.slice(1).join(' ') || '';
          token.provider = 'google';
          token.picture = user.image;
        } else if (account?.provider === "github") {
          // Extract name from GitHub profile
          const nameParts = user.name?.split(' ') || ['', ''];
          token.firstName = nameParts[0] || user.name || '';
          token.lastName = nameParts.slice(1).join(' ') || '';
          token.provider = 'github';
          token.picture = user.image;
        }
        // For credentials users
        else {
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.provider = 'credentials';
          token.plan = user.plan;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.provider = token.provider;
      session.user.picture = token.picture;
      session.user.plan = token.plan || 'free'; // Default to 'free' if not set
      return session;
    },
  },
};