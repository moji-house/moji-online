const properties = [
  {
    id: 1,
    title: 'Modern Apartment in City Center',
    description: 'Beautiful modern apartment with stunning city views. This property features high-end finishes, open concept living, and all the amenities you could want.',
    address: '123 Downtown Street',
    city: 'Bangkok',
    price: 250000,
    bedrooms: 2,
    bathrooms: 2,
    area: 85, // square meters
    status: 'for sale',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    likeCount: 12,
    commentCount: 5,
    comments: [
      {
        id: 101,
        content: "This property looks amazing! Is it still available?",
        createdAt: "2023-06-15T10:30:00Z",
        user: {
          id: "user-1",
          name: "John Doe",
          image: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        likes: 5,  // แก้ไข: ย้ายเข้าไปใน object ของ comment
        isLiked: false,  // แก้ไข: ย้ายเข้าไปใน object ของ comment
        replies: [  // แก้ไข: ย้ายเข้าไปใน object ของ comment
          {
            id: 201,
            content: "Yes, it's still available. Would you like to schedule a viewing?",
            createdAt: "2023-06-15T11:45:00Z",
            user: {
              id: "user-2",
              name: "Property Agent",
              image: "https://randomuser.me/api/portraits/women/2.jpg"
            },
            likes: 2,
            isLiked: false
          }
        ]
      },
      {
        id: 102,
        content: "What's the neighborhood like? Is it quiet?",
        createdAt: "2023-06-16T14:20:00Z",
        user: {
          id: "user-2",
          name: "Jane Smith",
          image: "https://randomuser.me/api/portraits/women/2.jpg"
        }
      }
    ],
    points: 1000,
  },
  {
    id: 2,
    title: 'Luxury Villa with Pool',
    description: 'Stunning luxury villa with private pool and garden. Perfect for families looking for space and comfort in a prestigious neighborhood.',
    address: '456 Luxury Avenue',
    city: 'Phuket',
    price: 750000,
    bedrooms: 4,
    bathrooms: 3,
    area: 250, // square meters
    status: 'for sale',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    likeCount: 24,
    commentCount: 8,
    comments: [
      {
        id: 101,
        content: "This property looks amazing! Is it still available?",
        createdAt: "2023-06-15T10:30:00Z",
        user: {
          id: "user-1",
          name: "John Doe",
          image: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        likes: 5,  // แก้ไข: ย้ายเข้าไปใน object ของ comment
        isLiked: false,  // แก้ไข: ย้ายเข้าไปใน object ของ comment
        replies: [  // แก้ไข: ย้ายเข้าไปใน object ของ comment
          {
            id: 201,
            content: "Yes, it's still available. Would you like to schedule a viewing?",
            createdAt: "2023-06-15T11:45:00Z",
            user: {
              id: "user-2",
              name: "Property Agent",
              image: "https://randomuser.me/api/portraits/women/2.jpg"
            },
            likes: 2,
            isLiked: false
          }
        ]
      },
      {
        id: 102,
        content: "What's the neighborhood like? Is it quiet?",
        createdAt: "2023-06-16T14:20:00Z",
        user: {
          id: "user-2",
          name: "Jane Smith",
          image: "https://randomuser.me/api/portraits/women/2.jpg"
        }
      }
    ],
    points: 1800,
  },
  {
    id: 3,
    title: 'Cozy Studio near University',
    description: 'Perfect starter home or investment property. This cozy studio is located near major universities and public transportation.',
    address: '789 College Road',
    city: 'Chiang Mai',
    price: 120000,
    bedrooms: 1,
    bathrooms: 1,
    area: 35, // square meters
    status: 'for rent',
    images: [
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    user: {
      name: 'David Wilson',
      email: 'david@example.com',
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    likeCount: 8,
    commentCount: 0,
    comments: [],
    points: 1600,
  },
  {
    id: 4,
    title: 'Family Home with Garden',
    description: 'Spacious family home with a beautiful garden in a quiet neighborhood. Recently renovated with modern amenities.',
    address: '101 Family Street',
    city: 'Hua Hin',
    price: 350000,
    bedrooms: 3,
    bathrooms: 2,
    area: 150, // square meters
    status: 'for sale',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    user: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      image: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    likeCount: 16,
    commentCount: 6,
    comments: [],
    points: 1100,
  },
  {
    id: 5,
    title: 'Modern Office Space',
    description: 'Prime office space in the business district. Open layout with meeting rooms and a reception area.',
    address: '555 Business Boulevard',
    city: 'Bangkok',
    price: 500000,
    bedrooms: 0,
    bathrooms: 2,
    area: 200, // square meters
    status: 'for rent',
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    user: {
      name: 'Michael Brown',
      email: 'michael@example.com',
      image: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    likeCount: 10,
    commentCount: 4,
    comments: [],
    points: 800,
  },
  {
    id: 6,
    title: 'Beachfront Condo',
    description: 'Beautiful beachfront condo with stunning ocean views. Wake up to the sound of waves every morning.',
    address: '222 Beach Road',
    city: 'Pattaya',
    price: 420000,
    bedrooms: 2,
    bathrooms: 2,
    area: 95, // square meters
    status: 'for sale',
    images: [
      'https://images.unsplash.com/photo-1545241047-6083a3684587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ],
    user: {
      name: 'Emily Davis',
      email: 'emily@example.com',
      image: 'https://randomuser.me/api/portraits/women/6.jpg'
    },
    likeCount: 30,
    commentCount: 12,
    comments: [],
    points: 2200,
  }
];

export default properties;
