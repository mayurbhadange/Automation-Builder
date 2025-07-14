import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user by clerkId
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { credits: true, tier: true, workflows: { select: { id: true } } },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const creditsLeft = user.credits ? parseInt(user.credits, 10) : 0;
  const activeWorkflows = user.workflows.length;
  const plan = user.tier || 'Free';

  return NextResponse.json({
    creditsLeft,
    activeWorkflows,
    plan,
  });
}