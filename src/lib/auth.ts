// =============================================================================
// CARBONMIND AI — NextAuth v5 Configuration
// =============================================================================
// Full configuration for non-Edge environments (API routes, server actions).
// Integrates database adapter, credential hashing, and custom DB events.
// =============================================================================

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validators/auth';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // For OAuth providers, ensure carbon profile exists
      if (account?.provider !== 'credentials' && user?.id) {
        const existingProfile = await prisma.carbonProfile.findUnique({
          where: { userId: user.id },
        });
        if (!existingProfile) {
          await prisma.carbonProfile.create({
            data: { userId: user.id },
          });
        }
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Create carbon profile for new users
      if (user.id) {
        await prisma.carbonProfile.create({
          data: { userId: user.id },
        });
      }
    },
  },
});
