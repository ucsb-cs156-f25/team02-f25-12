// import { fireEvent, render, waitFor, screen } from "@testing-library/react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { MemoryRouter } from "react-router";
// import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

// import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
// import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import axios from "axios";
// import AxiosMockAdapter from "axios-mock-adapter";

// import mockConsole from "tests/testutils/mockConsole";
// import { beforeEach, afterEach } from "vitest";

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
//     useParams: vi.fn(() => ({
//       id: 17,
//     })),
//     Navigate: vi.fn((x) => {
//       mockNavigate(x);
//       return null;
//     }),
//   };
// });

// let axiosMock;
// describe("HelpRequestEditPage tests", () => {
//   describe("when the backend doesn't return data", () => {
//     beforeEach(() => {
//       axiosMock = new AxiosMockAdapter(axios);
//       axiosMock
//         .onGet("/api/currentUser")
//         .reply(200, apiCurrentUserFixtures.userOnly);
//       axiosMock
//         .onGet("/api/systemInfo")
//         .reply(200, systemInfoFixtures.showingNeither);
//       axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
//     });

//     afterEach(() => {
//       mockToast.mockClear();
//       mockNavigate.mockClear();
//       axiosMock.restore();
//       axiosMock.resetHistory();
//     });

//     const queryClient = new QueryClient();
//     test("renders header but table is not present", async () => {
//       const restoreConsole = mockConsole();

//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <HelpRequestEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );

//       await screen.findByText(/Welcome/);
//       await screen.findByText("Edit HelpRequest");
//       expect(
//         screen.queryByTestId("HelpRequestForm-teamId"),
//       ).not.toBeInTheDocument();
//       restoreConsole();
//     });
//   });

//   describe("tests where backend is working normally", () => {
//     beforeEach(() => {
//       axiosMock = new AxiosMockAdapter(axios);
//       axiosMock.reset();
//       axiosMock.resetHistory();
//       axiosMock
//         .onGet("/api/currentUser")
//         .reply(200, apiCurrentUserFixtures.userOnly);
//       axiosMock
//         .onGet("/api/systemInfo")
//         .reply(200, systemInfoFixtures.showingNeither);
//       axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
//         id: 17,
//         requesterEmail: "student@example.edu",
//         teamId: "team7",
//         tableOrBreakoutRoom: "Table 3",
//         requestTime: "2025-10-30T14:30",
//         explanation: "Need help.",
//         solved: true
//       });
//       axiosMock.onPut("/api/helprequests").reply(200, {
//         id: "17",
//         requesterEmail: "student@example.edu",
//         teamId: "team8",
//         tableOrBreakoutRoom: "Table 4",
//         requestTime: "2025-10-30T14:30",
//         explanation: "help",
//         solved: false      
//       });
//     });

//     afterEach(() => {
//       mockToast.mockClear();
//       mockNavigate.mockClear();
//       axiosMock.restore();
//       axiosMock.resetHistory();
//     });

//     const queryClient = new QueryClient();
//     test("renders without crashing", async () => {
//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <HelpRequestEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );
//       await screen.findByText(/Welcome/);
//       await screen.findByTestId("HelpRequestForm-teamId");
//       expect(
//         screen.getByTestId("HelpRequestForm-teamId"),
//       ).toBeInTheDocument();
//     });

//     test("Is populated with the data provided", async () => {
//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <HelpRequestEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );

//       await screen.findByTestId("HelpRequestForm-teamId");
      
//       const idField = screen.getByTestId("HelpRequestForm-id");
//       const teamIdQField = screen.getByTestId("HelpRequestForm-teamId");
//       const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
//       const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
//       const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
//       const explanationField = screen.getByTestId("HelpRequestForm-explanation");
//       const solvedField = screen.getByTestId("HelpRequestForm-solved");
//       const submitButton = screen.getByTestId("HelpRequestForm-submit");

//       expect(idField).toHaveValue("17");
//       expect(teamIdQField).toHaveValue("team7");
//       expect(requesterEmailField).toHaveValue("student@example.edu");
//       expect(tableOrBreakoutRoomField).toHaveValue("Table 3");
//       expect(requestTimeField).toHaveValue("2025-10-30T14:30");
//       expect(explanationField).toHaveValue("Need help.");
//       expect(solvedField).toBeChecked();

//       expect(submitButton).toBeInTheDocument();
//     });

//     test("Changes when you click Update", async () => {
//       render(
//         <QueryClientProvider client={queryClient}>
//           <MemoryRouter>
//             <HelpRequestEditPage />
//           </MemoryRouter>
//         </QueryClientProvider>,
//       );

//       await screen.findByTestId("HelpRequestForm-teamId");

//       const idField = screen.getByTestId("HelpRequestForm-id");
//       const teamIdQField = screen.getByTestId("HelpRequestForm-teamId");
//       const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
//       const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
//       const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
//       const explanationField = screen.getByTestId("HelpRequestForm-explanation");
//       const solvedField = screen.getByTestId("HelpRequestForm-solved");
//       const submitButton = screen.getByTestId("HelpRequestForm-submit");

//       expect(idField).toHaveValue("17");
//       expect(teamIdQField).toHaveValue("team7");
//       expect(requesterEmailField).toHaveValue("student@example.edu");
//       expect(tableOrBreakoutRoomField).toHaveValue("Table 3");
//       expect(requestTimeField).toHaveValue("2025-10-30T14:30");
//       expect(explanationField).toHaveValue("Need help.");
//       expect(solvedField).toBeChecked();

//       expect(submitButton).toBeInTheDocument();


//     fireEvent.change(screen.getByTestId("HelpRequestForm-requesterEmail"), {
//       target: { value: "student@example2.edu" },
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
//       target: { value: "help" },
//     });

//     fireEvent.click(screen.getByTestId("HelpRequestForm-solved")); 
//     expect(solvedField).not.toBeChecked();


//       fireEvent.click(submitButton);

//       await waitFor(() => expect(mockToast).toBeCalled());
//       expect(mockToast).toBeCalledWith(
//         "HelpRequest Updated - id: 17 requesterEmail: student@example.edu teamId: team8 tableOrBreakoutRoom: Table 4 requestTime: 2025-10-30T14:30 explanation: help solved: false",
//       );
//       expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });

//       expect(axiosMock.history.put.length).toBe(1); // times called
//       expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
//       expect(axiosMock.history.put[0].data).toBe(
//         JSON.stringify({
//           requesterEmail: "student@example2.edu",
//           teamId: "team8",
//           tableOrBreakoutRoom: "Table 4",
//           requestTime: "2026-10-30T14:30",
//           explanation: "help",
//           solved: false      
//         }),
//       ); // posted object
//     });
//   });
// });
import { render, screen } from "@testing-library/react";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { expect } from "vitest";
describe("HelpRequestEditPage tests", () => {
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
          <HelpRequestEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    await screen.findByText("Edit page not yet implemented");
    expect(
      screen.getByText("Edit page not yet implemented"),
    ).toBeInTheDocument();
  });
});
