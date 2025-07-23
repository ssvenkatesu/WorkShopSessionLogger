import dbConnect from '@/lib/db';
import Feedback from '@/models/Feedback';

export async function POST(req) {
  await dbConnect();
  try {
    const { user, session, rating, comment } = await req.json();
    if (!user || !session || !rating) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const feedback = await Feedback.create({ user, session, rating, comment });
    return new Response(JSON.stringify(feedback), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const session = searchParams.get('session');
  if (!session) {
    return new Response(JSON.stringify({ error: 'Session id required' }), { status: 400 });
  }
  try {
    const feedbacks = await Feedback.find({ session }).populate('user', 'name');
    return new Response(JSON.stringify(feedbacks), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
} 