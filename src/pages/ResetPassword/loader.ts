import { validateResetToken } from '../../api/user';

export default async function resetPasswordLoader({ params }: any) {
  const { resetToken } = params;

  if (!resetToken || resetToken.length < 1) {
    window.location.href = '/';
  }

  const result = await validateResetToken(resetToken as string);

  if (result.errors || !result.success) {
    window.location.href = '/';

    return false;
  }

  return true;
}
