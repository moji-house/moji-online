const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Delete all existing data
  console.log('Deleting existing data...');
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.coinTx.deleteMany();
  await prisma.coinBalance.deleteMany();
  await prisma.likeComment.deleteMany();
  await prisma.commentReply.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.propertyVote.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  console.log('All existing data deleted.');

  // Create mock users
  const users = [
    {
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      email: 'somchai@example.com',
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu.Vm',
      birthDate: new Date('1990-01-01'),
      showBirthDate: true,
      bio: 'นายหน้าอสังหาริมทรัพย์มืออาชีพ',
      education: 'ปริญญาตรี บริหารธุรกิจ มหาวิทยาลัยธรรมศาสตร์',
      currentCompany: 'ABC Real Estate',
      previousCompanies: 'XYZ Properties, DEF Realty',
      realEstateExperience: 'เชี่ยวชาญด้านอสังหาริมทรัพย์หรูและเชิงพาณิชย์',
      lineContact: 'https://line.me/ti/p/~somchai',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop',
      backgroundImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop',
      voteCount: 150,
      followers: 200,
      propertiesCount: 25,
      roles: {
        create: [
          { role: 'Agent' },
          { role: 'Owner' }
        ]
      }
    },
    {
      firstName: 'สมหญิง',
      lastName: 'ใจงาม',
      email: 'somying@example.com',
      password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu.Vm',
      birthDate: new Date('1985-05-15'),
      showBirthDate: false,
      bio: 'เจ้าของและนักลงทุนอสังหาริมทรัพย์',
      education: 'ปริญญาโท อสังหาริมทรัพย์ มหาวิทยาลัยธรรมศาสตร์',
      currentCompany: 'Somying Properties',
      previousCompanies: 'GHI Investments',
      realEstateExperience: 'ประสบการณ์ลงทุนอสังหาริมทรัพย์ 15 ปี',
      lineContact: 'https://line.me/ti/p/~somying',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop',
      backgroundImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop',
      voteCount: 200,
      followers: 300,
      propertiesCount: 15,
      roles: {
        create: [
          { role: 'Owner' }
        ]
      }
    }
  ];

  // Create users and their roles
  for (const userData of users) {
    // Create user first
    const user = await prisma.user.create({
      data: userData
    });
    console.log(`Created user: ${user.firstName} ${user.lastName}`);

    // Create coin balance for the user
    const coinBalance = await prisma.coinBalance.create({
      data: {
        userId: user.id,
        balance: 1000
      }
    });

    // Create properties for each user
    const properties = [
      {
        title: 'คอนโดหรูสุขุมวิท',
        description: 'คอนโด 2 ห้องนอนวิวเมือง',
        price: 15000000,
        address: '123 ถนนสุขุมวิท',
        city: 'กรุงเทพฯ',
        state: 'กรุงเทพฯ',
        zip_code: '10110',
        bedrooms: 2,
        bathrooms: 2,
        square_feet: 80,
        status: 'active',
        phone: '0812345678',
        line_id: 'luxurycondo',
        google_map_link: 'https://goo.gl/maps/example',
        co_agent_commission: 2.5,
        co_agent_incentive: 'ฟรีค่าบริการจัดการทรัพย์สิน 1 ปี',
        co_agent_notes: 'ย่านที่มีความต้องการสูง',
        points: 100,
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop',
              isMain: true
            },
            {
              imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc7?q=80&w=1000&auto=format&fit=crop',
              isMain: false
            }
          ]
        },
        votes: {
          create: [
            {
              userId: user.id,
              voteType: 'up'
            }
          ]
        },
        propertyVotes: {
          create: [
            {
              userId: user.id,
              voteType: 'up'
            }
          ]
        },
        likes: {
          create: [
            {
              userId: user.id
            }
          ]
        }
      }
    ];

    for (const propertyData of properties) {
      const property = await prisma.property.create({
        data: {
          ...propertyData,
          userId: user.id
        }
      });
      console.log(`Created property: ${property.title}`);

      // Create comments for the property
      const comment = await prisma.comment.create({
        data: {
          content: 'ทำเลดีมาก มีสิ่งอำนวยความสะดวกครบครัน!',
          userId: user.id,
          propertyId: property.id,
          likes: {
            create: [
              {
                userId: user.id
              }
            ]
          }
        }
      });

      // Create comment replies
      await prisma.commentReply.create({
        data: {
          content: 'ขอบคุณสำหรับความคิดเห็นครับ',
          userId: user.id,
          propertyId: property.id,
          commentId: comment.id
        }
      });

      // Create coin transactions for the property
      await prisma.coinTx.create({
        data: {
          type: 'reward',
          amount: 100,
          description: 'รางวัลการลงประกาศทรัพย์สิน',
          propertyId: property.id,
          userId: user.id,
          coinBalanceId: coinBalance.id
        }
      });
    }

    // Create accounts for each user
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: `google_${user.id}`,
        refresh_token: 'mock_refresh_token',
        access_token: 'mock_access_token',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'Bearer',
        scope: 'email profile',
        id_token: 'mock_id_token',
        session_state: 'mock_session_state'
      }
    });

    // Create sessions for each user
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: `mock_session_token_${user.id}`,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });
  }

  // Create verification tokens
  await prisma.verificationToken.create({
    data: {
      identifier: 'somchai@example.com',
      token: 'mock_verification_token',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 