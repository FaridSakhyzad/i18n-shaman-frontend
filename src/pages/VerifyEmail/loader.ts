import { validateVerificationToken } from 'api/user';

export default async function verifyEmailLoader({ params }: any) {
  const { verificationToken } = params;

  if (!verificationToken || verificationToken.length < 1) {
    window.location.href = '/';
  }

  const result = await validateVerificationToken(verificationToken as string);

  if (result.errors || !result.success) {
    // window.location.href = '/';

    // return false;
  }

  return true;
}
