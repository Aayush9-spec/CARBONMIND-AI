// =============================================================================
// CARBONMIND AI — Auth Server Actions
// =============================================================================

'use server';

import bcrypt from 'bcryptjs';
import { signIn, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { registerSchema, loginSchema } from '@/lib/validators/auth';
import { sanitizeString, sanitizeEmail } from '@/utils/sanitize';

const BCRYPT_SALT_ROUNDS = 12;

export interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Register a new user with email and password.
 */
export async function registerUser(formData: FormData): Promise<AuthResult> {
  try {
    const raw = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    // Validate input
    const validated = registerSchema.safeParse(raw);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? 'Invalid input',
      };
    }

    const { name, email, password } = validated.data;
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedEmail = sanitizeEmail(email);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        hashedPassword,
        carbonProfile: {
          create: {},
        },
      },
    });

    // Auto sign-in after registration
    await signIn('credentials', {
      email: sanitizedEmail,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

/**
 * Sign in with email and password.
 */
export async function loginUser(formData: FormData): Promise<AuthResult> {
  try {
    const raw = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const validated = loginSchema.safeParse(raw);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message ?? 'Invalid input',
      };
    }

    await signIn('credentials', {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error: unknown) {
    // NextAuth throws specific errors for auth failures
    if (error && typeof error === 'object' && 'type' in error) {
      if ((error as { type: string }).type === 'CredentialsSignin') {
        return { success: false, error: 'Invalid email or password' };
      }
    }
    return { success: false, error: 'Sign in failed. Please try again.' };
  }
}

/**
 * Sign out the current user.
 */
export async function logoutUser(): Promise<void> {
  await signOut({ redirect: false });
}
