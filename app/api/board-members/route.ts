import { NextResponse } from 'next/server';

export async function GET() {
  const boardMembers = [
    {
      id: 1,
      name: 'Rev. Charles Mulema Kinusu',
      position: 'General Overseer',
      bio: 'With 25 years of ministry experience, Dr. Johnson leads our church with vision and compassion.',
      image: '/R-charles.jpg',
    },
    {
      id: 2,
      name: 'Rev. Titus Mbiti Katembu',
      position: 'Deputy General Overseer',
      bio: 'Emily develops our educational initiatives and youth development programs.',
      image: '/Rev.-Titus-Katembu-Gospel-Centres-International.jpg',
    },
    {
      id: 3,
      name: 'Elder Ernest Amiani Najoli',
      position: 'The General Secretary',
      bio: 'James coordinates our national and international missionary outreach efforts.',
      image: '/Ernest-Najoli-Gospel-Centres-International.jpg',
    },
    {
      id: 4,
      name: 'Elder Yuvenalis Amisi Momanyi',
      position: 'The National Treasurer',
      bio: 'Mark leads our worship with passion, creating meaningful spiritual experiences.',
      image: '/Yuvenalis-Momanyi-Gospel-Centres-International.jpg',
    },
    {
      id: 5,
      name: 'Rev. Stephen Mburu',
      position: 'Board Member',
      bio: 'Sarah oversees our community outreach and discipleship programs with dedication.',
      image: '/Steve-Ngaruiya-Mburu-Gospel-Centres-International.jpg',
    },
    // {
    //   id: 6,
    //   name: 'Patricia Lee',
    //   position: 'Finance Director',
    //   bio: 'Patricia ensures fiscal responsibility and transparent management of church resources.',
    //   image: '💰',
    // },
  ];

  return NextResponse.json(boardMembers);
}
