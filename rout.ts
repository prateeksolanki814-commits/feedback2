import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FEEDBACK_FILE = path.join(process.cwd(), 'feedback-data.json');

function readFeedbacks(): object[] {
  try {
    if (fs.existsSync(FEEDBACK_FILE)) {
      const data = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }
  return [];
}

function writeFeedbacks(feedbacks: object[]) {
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2), 'utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const feedbacks = readFeedbacks();
    feedbacks.push({ ...body, submittedAt: new Date().toISOString() });
    writeFeedbacks(feedbacks);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback save error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save feedback' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const feedbacks = readFeedbacks();
    return NextResponse.json({ feedbacks });
  } catch {
    return NextResponse.json({ feedbacks: [] });
  }
}
