const recommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "requesterEmail": "joshua_alexander@ucsb.edu",
        "professorEmail": "pconrad@ucsb.edu",
        "explanation": "recommendation request for the team02 project",
        "dateRequested": "2025-11-01T12:23:05",
        "dateNeeded": "2026-02-01T12:00:00",
        "done": false
    },
  threeRecommendationRequests: [
        {
            "id": 1,
            "requesterEmail": "joshua_alexander@ucsb.edu",
            "professorEmail": "pconrad@ucsb.edu",
            "explanation": "recommendation request for the team02 project",
            "dateRequested": "2025-11-01T12:23:05",
            "dateNeeded": "2026-02-01T12:00:00",
            "done": false
        },
        {
            "id": 2,
            "requesterEmail": "alexeubank@uscb.edu",
            "professorEmail": "mmajedi@ucsb.edu",
            "explanation": "Recommendation request for PHD program at UCSB",
            "dateRequested": "2025-10-03T09:14:33",
            "dateNeeded": "2026-01-25T11:59:59",
            "done": true
        },
        {
            "id": 7,
            "requesterEmail": "pconrad@ucsb.edu",
            "professorEmail": "dassaniss@ucsb.edu",
            "explanation": "Letter of Rec for promotion",
            "dateRequested": "2025-06-01T15:00:58",
            "dateNeeded": "2026-01-01T00:00:00",
            "done": false
        }
    ],
};

export { recommendationRequestFixtures };
