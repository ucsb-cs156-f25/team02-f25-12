const helpRequestsFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "student1@ucsb.edu",
    teamId: "s23-5pm-2",
    tableOrBreakoutRoom: "Table 7",
    requestTime: "2025-02-10T15:00:00",
    explanation: "Need help debugging my Spring Boot controller",
    solved: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "student1@ucsb.edu",
      teamId: "s23-5pm-2",
      tableOrBreakoutRoom: "Table 7",
      requestTime: "2025-02-10T15:00:00",
      explanation: "Need help debugging my Spring Boot controller",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "student2@ucsb.edu",
      teamId: "s23-6pm-3",
      tableOrBreakoutRoom: "Breakout Room 2",
      requestTime: "2025-02-10T16:15:00",
      explanation: "Having trouble connecting to the database",
      solved: true,
    },
    {
      id: 3,
      requesterEmail: "student3@ucsb.edu",
      teamId: "s23-7pm-1",
      tableOrBreakoutRoom: "Table 3",
      requestTime: "2025-02-10T17:45:00",
      explanation: "Question about test cases for endpoint",
      solved: false,
    },
  ],
};

export { helpRequestsFixtures };
