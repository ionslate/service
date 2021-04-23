beforeEach(jest.clearAllMocks);

jest.mock('@root/security/jwtVerifier', () => ({
  getUser: jest.fn().mockImplementation((req, res, next) => {
    req.user = {
      id: '1234',
      roles: ['Everyone'],
      name: 'John Doe',
    };

    next();
  }),
}));
