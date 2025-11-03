import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("HelpRequestForm tests", () => {
  test("renders correctly (create mode)", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );

    // basic presence checks
    await screen.findByText(/Solved/i);
    await screen.findByTestId("HelpRequestForm-submit");
    expect(screen.getByTestId("HelpRequestForm-submit")).toBeInTheDocument();
    const submitBtn = await screen.findByTestId("HelpRequestForm-submit");
    expect(submitBtn).toHaveTextContent(/^Create$/);  
  });

  test("renders correctly with initialContents (edit mode)", async () => {
    render(
      <Router>
        <HelpRequestForm initialContents={helpRequestFixtures.oneRequest} />
      </Router>
    );

    const submitBtn = await screen.findByTestId("HelpRequestForm-submit");
    expect(submitBtn).toHaveTextContent(/^Update$/);
    expect(screen.getByText(/Id/i)).toBeInTheDocument();
    expect(screen.getByTestId("HelpRequestForm-id")).toHaveValue(
      String(helpRequestFixtures.oneRequest.id)
    );
  });

  test("shows correct error messages on bad input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );

    // fields
    const emailField = await screen.findByTestId(
      "HelpRequestForm-requesterEmail"
    );
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    // bad formats
    fireEvent.change(emailField, { target: { value: "not-an-email" } });
    fireEvent.change(requestTimeField, { target: { value: "bad-input" } });

    fireEvent.click(submitButton);

    // pattern messages come from the component's validation config
    await screen.findByText(/Enter a valid email\./i);
    expect(
      screen.getByText(/Use ISO format \(e\.g\., 2025-10-30T14:30\)\./i)
    ).toBeInTheDocument();

// ensure time is valid so only email validation matters
fireEvent.change(requestTimeField, { target: { value: "2025-10-30T14:30" } });

  const makeAllButEmailValid = () => {
    fireEvent.change(requestTimeField, { target: { value: "2025-10-30T14:30" } }); // matches regex
    fireEvent.change(teamIdField, { target: { value: "s25-5pm-2" } });
    fireEvent.change(torField, { target: { value: "A1" } });
    fireEvent.change(explanationField, { target: { value: "help" } });
  };

  // 2) kill missing `$` (trailing garbage should be invalid)
  makeAllButEmailValid();
  fireEvent.change(emailField, { target: { value: "foo@bar.com EXTRA" } });
  fireEvent.click(submitButton);
  await screen.findByText(/Enter a valid email\./i);

  // 3) kill missing `^` (leading garbage should be invalid)
  makeAllButEmailValid();
  fireEvent.change(emailField, { target: { value: "GARBAGE foo@bar.com" } });
  fireEvent.click(submitButton);
  await screen.findByText(/Enter a valid email\./i);
  });

  test("shows required messages on missing input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );

    const submitButton = await screen.findByTestId("HelpRequestForm-submit");
    fireEvent.click(submitButton);

    // required messages from the component
    await screen.findByText(/Email is required\./i);
    expect(
      screen.getByText(/Request time is required\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Team ID is required\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/This field is required\./i)
    ).toBeInTheDocument(); // tableOrBreakoutRoom
    expect(
      screen.getByText(/Explanation is required\./i)
    ).toBeInTheDocument();
  });

  test("no error messages on good input and submitAction called", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>
    );

    const emailField = await screen.findByTestId(
      "HelpRequestForm-requesterEmail"
    );
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const torField = screen.getByTestId(
      "HelpRequestForm-tableOrBreakoutRoom"
    );
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const solvedCheckbox = screen.getByTestId("HelpRequestForm-solved");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    // valid inputs
    fireEvent.change(emailField, { target: { value: "student@ucsb.edu" } });
    fireEvent.change(requestTimeField, { target: { value: "2025-10-29T14:30" } });
    fireEvent.change(teamIdField, { target: { value: "f25-5pm-1" } });
    fireEvent.change(torField, { target: { value: "Table 4" } });
    fireEvent.change(explanationField, {
      target: { value: "Need help with unit tests" },
    });
    fireEvent.click(solvedCheckbox); // optional

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    // ensure no error text present
    expect(
      screen.queryByText(/Enter a valid email\./i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Use ISO format \(e\.g\., 2025-10-30T14:30\)\./i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Request time is required\./i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Team ID is required\./i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/This field is required\./i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Explanation is required\./i)
    ).not.toBeInTheDocument();
  });

  test("navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );

    const cancelButton = await screen.findByTestId("HelpRequestForm-cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
