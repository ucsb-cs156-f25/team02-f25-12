import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestsCreatePage from "main/pages/RecommendationRequests/RecommendationRequestsCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("RecommendationRequestsCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /recommendationRequests", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {
      id: 1,
      requesterEmail: "bob_gaucho@ucsb.edu",
      professorEmail: "pconrad@ucsb.edu",
      explanation: "recommendation request for the team02 project",
      dateRequested: "2025-11-01T12:23",
      dateNeeded: "2026-02-01T12:00",
      done: false,
    };

    axiosMock
      .onPost("/api/recommendationRequests/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    const requesterEmailInput = screen.getByLabelText("Requester Email");
    expect(requesterEmailInput).toBeInTheDocument();

    const professorEmailInput = screen.getByLabelText("Professor Email");
    expect(professorEmailInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const dateRequestedInput = screen.getByLabelText(
      "Date Requested (iso format)",
    );
    expect(dateRequestedInput).toBeInTheDocument();

    const dateNeededInput = screen.getByLabelText("Date Needed (iso format)");
    expect(dateNeededInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(requesterEmailInput, {
      target: { value: "bob_gaucho@ucsb.edu" },
    });
    fireEvent.change(professorEmailInput, {
      target: { value: "pconrad@ucsb.edu" },
    });
    fireEvent.change(explanationInput, {
      target: { value: "recommendation request for the team02 project" },
    });
    fireEvent.change(dateRequestedInput, {
      target: { value: "2025-11-01T12:23" },
    });
    fireEvent.change(dateNeededInput, {
      target: { value: "2026-02-01T12:00" },
    });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "bob_gaucho@ucsb.edu",
      professorEmail: "pconrad@ucsb.edu",
      explanation: "recommendation request for the team02 project",
      dateRequested: "2025-11-01T12:23",
      dateNeeded: "2026-02-01T12:00",
      done: false,
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New recommendation request Created - id: 1 requester email: bob_gaucho@ucsb.edu",
    );
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/recommendationRequests",
    });
  });
});
