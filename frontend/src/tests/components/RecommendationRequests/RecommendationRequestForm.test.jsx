import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RecommendationRequestFormStories from "../../../stories/components/RecommendationRequests/RecommendationRequestForm.stories";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("RecommendationRequestForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Requester Email",
    "Professor Email",
    "Explanation",
    "Date Requested (iso format)",
    "Date Needed (iso format)",
  ];
  const testId = "RecommendationRequestForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm
            initialContents={
              recommendationRequestFixtures.oneRecommendationRequest
            }
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();

    expect(screen.getByLabelText("Id")).toHaveValue(
      String(recommendationRequestFixtures.oneRecommendationRequest.id),
    );
    expect(screen.getByLabelText("Requester Email")).toHaveValue(
      recommendationRequestFixtures.oneRecommendationRequest.requesterEmail,
    );
    expect(screen.getByLabelText("Professor Email")).toHaveValue(
      recommendationRequestFixtures.oneRecommendationRequest.professorEmail,
    );
    expect(screen.getByLabelText("Explanation")).toHaveValue(
      recommendationRequestFixtures.oneRecommendationRequest.explanation,
    );
    expect(screen.getByLabelText("Date Requested (iso format)")).toHaveValue(
      recommendationRequestFixtures.oneRecommendationRequest.dateRequested,
    );
    expect(screen.getByLabelText("Date Needed (iso format)")).toHaveValue(
      recommendationRequestFixtures.oneRecommendationRequest.dateNeeded,
    );
    if (recommendationRequestFixtures.oneRecommendationRequest.done) {
      expect(screen.getByLabelText("Done")).toBeChecked();
    } else {
      expect(screen.getByLabelText("Done")).not.toBeChecked();
    }
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Requester email is required/);
    expect(screen.getByText(/Professor email is required/)).toBeInTheDocument();
    expect(screen.getByText(/An explanation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Requested is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Needed is required/)).toBeInTheDocument();
  });
});
