import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expectTypeOf } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["ItemId","Reviewer Email", "Stars", "Date Reviewed", "Comments"];
  const testId = "MenuItemReviewForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
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
          <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneReview} />
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
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
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
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/ItemId is required/);
    expect(screen.getByText(/reviewer's Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/stars are required/)).toBeInTheDocument();
    expect(screen.getByText(/date reviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/comments are required/)).toBeInTheDocument();            




  });

  test("itemId and Stars are submitted as numbers", async () => {
    const mockSubmit = vi.fn();
    
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm submitAction={mockSubmit} buttonLabel="Create" />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-itemId`)).toBeInTheDocument();

    const itemIdInput = screen.getByTestId(`${testId}-itemId`);
    const reviewerEmailInput = screen.getByTestId(`${testId}-reviewerEmail`);
    const starsInput= screen.getByTestId(`${testId}-stars`);
    const dateInput = screen.getByTestId(`${testId}-dateReviewed`);
    const commentsInput = screen.getByTestId(`${testId}-comments`);

    fireEvent.change(itemIdInput, { target: { value: '2' } });
    fireEvent.change(reviewerEmailInput, { target: { value: 'test@ucsb.edu' } });
    fireEvent.change(starsInput, { target: { value: '5' } });
    fireEvent.change(dateInput, { target: { value: '2025-11-02T12:00' } });
    fireEvent.change(commentsInput, { target: { value: 'test comment' } });

    const submitButton = screen.getByTestId(`${testId}-submit`);
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Get the first argument passed to the mock function
      const submitArgs = mockSubmit.mock.calls[0][0];

      expect(typeof submitArgs.itemId).toBe('number');
      expect(typeof submitArgs.stars).toBe('number');
      expect(submitArgs.itemId).toBe(2);
      expect(submitArgs.stars).toBe(5);

    });
  });


  test("itemId shows correct error message for < 1", async () => {
    const mockSubmit = vi.fn();
    
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm submitAction={mockSubmit} buttonLabel="Create" />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-itemId`)).toBeInTheDocument();

    const itemIdInput = screen.getByTestId(`${testId}-itemId`);
    const submitButton = screen.getByTestId(`${testId}-submit`);
    
    
    fireEvent.change(itemIdInput, { target: { value: '0' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/itemId must be > 0/)).toBeInTheDocument();
    });
  });

  test("rejects incorrect email (front incorrect) and displays error message", async () => {
    const mockSubmit = vi.fn();
    
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm submitAction={mockSubmit} buttonLabel="Create" />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-reviewerEmail`)).toBeInTheDocument();

    const reviewerEmailInput = screen.getByTestId(`${testId}-reviewerEmail`);
    const submitButton = screen.getByTestId(`${testId}-submit`);
    
    fireEvent.change(reviewerEmailInput, { target: { value: ' aaaa user@ucsb.edu' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/)).toBeInTheDocument();
    });
  });

  test("rejects incorrect email (back incorrect) and displays error message", async () => {
    const mockSubmit = vi.fn();
    
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm submitAction={mockSubmit} buttonLabel="Create" />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-reviewerEmail`)).toBeInTheDocument();

    const reviewerEmailInput = screen.getByTestId(`${testId}-reviewerEmail`);
    const submitButton = screen.getByTestId(`${testId}-submit`);
    
    fireEvent.change(reviewerEmailInput, { target: { value: 'user@ucsb.edu aaa' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/)).toBeInTheDocument();
    });
  });
  
  test("rejects incorrect email formatting and displays error message", async () => {
    const mockSubmit = vi.fn();
    
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm submitAction={mockSubmit} buttonLabel="Create" />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-reviewerEmail`)).toBeInTheDocument();

    const reviewerEmailInput = screen.getByTestId(`${testId}-reviewerEmail`);
    const submitButton = screen.getByTestId(`${testId}-submit`);
    
    fireEvent.change(reviewerEmailInput, { target: { value: 'user@ucsb' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/)).toBeInTheDocument();
    });
  });  

  test("stars have a min of 1 and displays error", async () => {
    const mockSubmit = vi.fn();
    
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm submitAction={mockSubmit} buttonLabel="Create" />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-stars`)).toBeInTheDocument();

    const starsInput = screen.getByTestId(`${testId}-stars`);
    const submitButton = screen.getByTestId(`${testId}-submit`);
    
    fireEvent.change(starsInput, { target: { value: "0" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/stars must be from 1 to 5/)).toBeInTheDocument();
    });
  });

  test("stars have a max of 5 and displays error", async () => {
    const mockSubmit = vi.fn();
    
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm submitAction={mockSubmit} buttonLabel="Create" />
        </Router>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testId}-stars`)).toBeInTheDocument();

    const starsInput = screen.getByTestId(`${testId}-stars`);
    const submitButton = screen.getByTestId(`${testId}-submit`);
    
    fireEvent.change(starsInput, { target: { value: "6" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/stars must be from 1 to 5/)).toBeInTheDocument();
    });
  });

  test("comments have a max length of 500 chars", async () => {
    const mockSubmit = vi.fn();
    
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm submitAction={mockSubmit} buttonLabel="Create" />
        </Router>
      </QueryClientProvider>
    );

    const itemIdInput = screen.getByTestId(`${testId}-itemId`);
    const reviewerEmailInput = screen.getByTestId(`${testId}-reviewerEmail`);
    const starsInput= screen.getByTestId(`${testId}-stars`);
    const dateInput = screen.getByTestId(`${testId}-dateReviewed`);
    const commentsInput = screen.getByTestId(`${testId}-comments`);

    fireEvent.change(itemIdInput, { target: { value: '2' } });
    fireEvent.change(reviewerEmailInput, { target: { value: 'test@ucsb.edu' } });
    fireEvent.change(starsInput, { target: { value: '5' } });
    fireEvent.change(dateInput, { target: { value: '2025-11-02T12:00' } });
    fireEvent.change(commentsInput, { target: { value: "a".repeat(501) } });

    const submitButton = screen.getByTestId(`${testId}-submit`);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/max 500 characters/)).toBeInTheDocument();
    });
  });
});