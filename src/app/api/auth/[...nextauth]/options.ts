import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { UserSession } from "@/app/types/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('กรุณากรอกอีเมลและรหัสผ่าน');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { roles: true }
        });

        if (!user) {
          throw new Error('ไม่พบผู้ใช้ในระบบ');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('รหัสผ่านไม่ถูกต้อง');
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.roles[0]?.role || 'user',
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = profile.sub;
      }
      return token;
    },
    async session({ session, token }): Promise<UserSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
        accessToken: token.accessToken as string,
      };
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const { id, name, image, email } = user;
        const firstName = name?.split(' ')[0] || 'Unknown User';
        const lastName = name?.split(' ')[1] || ''; 

        try {
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                id,
                googleId: id,
                password: "",
                firstName,
                lastName,
                avatar: image,
                email,
              },
            });
          }
        } catch (error) {
          console.error('Error during Google sign-in:', error);
          return false;
        }
      }

      return true;
    }
  }
};