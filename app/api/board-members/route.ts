import { NextResponse } from 'next/server';

export async function GET() {
  const boardMembers = [
    {
      id: 1,
      name: 'Dr. David Johnson',
      position: 'Senior Pastor',
      bio: 'With 25 years of ministry experience, Dr. Johnson leads our church with vision and compassion.',
      image: '👨‍💼',
    },
    {
      id: 2,
      name: 'Rev. Sarah Williams',
      position: 'Associate Pastor',
      bio: 'Sarah oversees our community outreach and discipleship programs with dedication.',
      image: '👩‍💼',
    },
    {
      id: 3,
      name: 'Mark Thompson',
      position: 'Worship Director',
      bio: 'Mark leads our worship with passion, creating meaningful spiritual experiences.',
      image: '🎵',
    },
    {
      id: 4,
      name: 'Dr. Emily Rodriguez',
      position: 'Education Director',
      bio: 'Emily develops our educational initiatives and youth development programs.',
      image: '📚',
    },
    {
      id: 5,
      name: 'James Chen',
      position: 'Missions Director',
      bio: 'James coordinates our national and international missionary outreach efforts.',
      image: '🌍',
    },
    {
      id: 6,
      name: 'Patricia Lee',
      position: 'Finance Director',
      bio: 'Patricia ensures fiscal responsibility and transparent management of church resources.',
      image: '💰',
    },
  ];

  return NextResponse.json(boardMembers);
}
