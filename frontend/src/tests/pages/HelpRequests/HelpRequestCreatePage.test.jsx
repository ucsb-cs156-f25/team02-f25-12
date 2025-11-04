// import { render, waitFor, fireEvent, screen } from "@testing-library/react";
// import HelpRequestCreatePage from "main/pages/HelpRequests/HelpRequestCreatePage";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { MemoryRouter } from "react-router";

// import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
// import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import axios from "axios";
// import AxiosMockAdapter from "axios-mock-adapter";

// const mockToast = vi.fn();
// vi.mock("react-toastify", async (importOriginal) => {
//   const originalModule = await importOriginal();
//   return {
//     ...originalModule,
//     toast: vi.fn((x) => mockToast(x)),
//   };
// });

// const mockNavigate = vi.fn();
// vi.mock("react-router", async (importOriginal) => {
//   const originalModule = await importOriginal();
//   return {
//     ...originalModule,
//     Navigate: vi.fn((x) => {
//       mockNavigate(x);
//       return null;
//     }),
//   };
// });

// describe("HelpRequestCreatePage tests", () => {
//   const axiosMock = new AxiosMockAdapter(axios);

//   beforeEach(() => {
//     axiosMock.reset();
//     axiosMock.resetHistory();
//     axiosMock
//       .onGet("/api/currentUser")
//       .reply(200, apiCurrentUserFixtures.userOnly);
//     axiosMock
//       .onGet("/api/systemInfo")
//       .reply(200, systemInfoFixtures.showingNeither);
//   });

//   test("renders without crashing", async () => {
//     const queryClient = new QueryClient();
//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <HelpRequestCreatePage />
//         </MemoryRouter>
//       </QueryClientProvider>,
//     );

//     await waitFor(() => {
//       expect(
//         screen.getByTestId("HelpRequestForm-teamId"),
//       ).toBeInTheDocument();
//     });
//   });

//   test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
//     const queryClient = new QueryClient();
//     const helpRequest = {
//       id: 17,
//       requesterEmail: "student@example.edu",
//       teamId: "team7",
//       tableOrBreakoutRoom: "Table 3",
//       requestTime: "2025-10-30T14:30",
//       explanation: "Need help.",
//       solved: true
//     };

//     axiosMock.onPost("/api/helprequests/post").reply(202, helpRequest);

//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <HelpRequestCreatePage />
//         </MemoryRouter>
//       </QueryClientProvider>,
//     );

//     await waitFor(() => {
//       expect(
//         screen.getByTestId("HelpRequestForm-teamId"),
//       ).toBeInTheDocument();
//     });
    
//     const teamIdQField = screen.getByTestId("HelpRequestForm-teamId");
//     const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
//     const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
//     const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
//     const explanationField = screen.getByTestId("HelpRequestForm-explanation");
//     const solvedField = screen.getByTestId("HelpRequestForm-solved");

//     const submitButton = screen.getByTestId("HelpRequestForm-submit");

//     fireEvent.change(screen.getByTestId("HelpRequestForm-requesterEmail"), {
//       target: { value: "student@example.edu" },
//     });

//     fireEvent.change(screen.getByTestId("HelpRequestForm-teamId"), {
//       target: { value: "team8" },
//     });

//     fireEvent.change(screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom"), {
//       target: { value: "Table 4" },
//     });

//     fireEvent.change(screen.getByTestId("HelpRequestForm-requestTime"), {
//       target: { value: "2026-10-30T14:30" }, 
//     });

//     fireEvent.change(screen.getByTestId("HelpRequestForm-explanation"), {
//       target: { value: "Need help." },
//     });

//     fireEvent.click(screen.getByTestId("HelpRequestForm-solved")); 

//     expect(submitButton).toBeInTheDocument();

//     fireEvent.click(submitButton);

//     await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

//     expect(axiosMock.history.post[0].params).toEqual({
//       requesterEmail: "student@example.edu",
//       teamId: "team7",
//       tableOrBreakoutRoom: "Table 3",
//       requestTime: "2025-10-30T14:30",
//       explanation: "Need help.",
//       solved: true
//     });

//     expect(mockToast).toBeCalledWith(
//       "New HelpRequest Created - id: 17 requesterEmail: student@example.edu teamId: team7 tableOrBreakoutRoom: Table 3 requestTime: 2025-10-30T14:30 explanation: Need help. solved: true",
//     );
//     expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });
//   });
// });
import { render, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequests/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { expect } from "vitest";
describe("HelpRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();
  test("Renders expected content", async () => {
    // arrange

    setupUserOnly();

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert

    await screen.findByText("Create page not yet implemented");
    expect(
      screen.getByText("Create page not yet implemented"),
    ).toBeInTheDocument();
  });
});
