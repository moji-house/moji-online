const userCoinBalance = [
    {
      id: '1',
      userId: '1',
      coinBalance: 1000,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      transactions: [
        {
          id: 'tx1',
          type: 'reward',
          amount: 25.00,
          description: 'Property listing reward',
          propertyId: 'prop1',
          propertyTitle: 'Modern Apartment in City Center',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'tx2',
          type: 'reward',
          amount: 50.00,
          description: 'Property listing reward',
          propertyId: 'prop2',
          propertyTitle: 'Luxury Villa with Pool',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'tx3',
          type: 'purchase',
          amount: -15.00,
          description: 'Premium listing upgrade',
          propertyId: 'prop1',
          propertyTitle: 'Modern Apartment in City Center',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ]
    },
    {
      id: '2',
      userId: '2',
      coinBalance: 800,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      transactions: [
        {
          id: 'tx4',
          type: 'reward',
          amount: 10.00,
          description: 'Referral bonus',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'tx5',
          type: 'purchase',
          amount: -30.00,
          description: 'Featured property placement',
          propertyId: 'prop2',
          propertyTitle: 'Luxury Villa with Pool',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ]
    },
    {
      id: '3',
      userId: '3',
      coinBalance: 500,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      transactions: [
        {
          id: 'tx6',
          type: 'reward',
          amount: 20.00,
          description: 'Property listing reward',
          propertyId: 'prop3',
          propertyTitle: 'Cozy Studio Apartment',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ]
    },
    {
      id: '4',
      userId: '4',
      coinBalance: 200,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      transactions: [
        {
          id: 'tx7',
          type: 'reward',
          amount: 15.00,
          description: 'Property listing reward',
          propertyId: 'prop4',
          propertyTitle: 'Family House with Garden',
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ]
    }
  ];
  
  export default userCoinBalance;