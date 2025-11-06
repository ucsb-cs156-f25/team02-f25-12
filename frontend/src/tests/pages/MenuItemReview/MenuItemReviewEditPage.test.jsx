import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

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
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("MenuItemReviewEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit MenuItemReview");
      expect(screen.queryByTestId("MenuItemReview-itemId")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).reply(200, {
        id: 17,
        itemId: 33,
        reviewerEmail: "JackL@ucsb.edu",
        stars: 3,
        dateReviewed: "2025-10-26T12:00:00",
        comments: "It was average",
      });
      axiosMock.onPut("/api/menuitemreview").reply(200, {
        id: 17,
        itemId: 2,
        reviewerEmail: "user@ucsb.edu",
        stars: 4,
        dateReviewed: "2025-10-26T12:30:00",
        comments: "It was good",
        });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided, and changes when data is changed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");

      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(itemIdField).toBeInTheDocument();
      expect(itemIdField).toHaveValue(33);

      expect(reviewerEmailField).toBeInTheDocument();
      expect(reviewerEmailField).toHaveValue("JackL@ucsb.edu");

      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue(3);

      expect(dateReviewedField).toBeInTheDocument();
      expect(dateReviewedField).toHaveValue("2025-10-26T12:00");

      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("It was average");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemIdField, {
        target: { value: "2" },
      });
      fireEvent.change(reviewerEmailField, {
        target: { value: "user@ucsb.edu" },
      });
      fireEvent.change(starsField, {
        target: { value: "4" },
      });
      fireEvent.change(dateReviewedField, {
        target: { value: "2025-10-26T12:30:00" },
      });
      fireEvent.change(commentsField, {
        target: { value: "it was good" },
      });
      
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "MenuItemReview Updated - id: 17 itemId: 2",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreview" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: 2,
          reviewerEmail: "user@ucsb.edu",
          stars: 4,
          dateReviewed: "2025-10-26T12:30",
          comments: "it was good",
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreview" });
    });

    // test("Changes when you click Update", async () => {
    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <MemoryRouter>
    //         <MenuItemReviewEditPage />
    //       </MemoryRouter>
    //     </QueryClientProvider>,
    //   );

    //   await screen.findByTestId("MenuItemReviewForm-id");

    //   const idField = screen.getByTestId("MenuItemReviewForm-id");
    //   const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
    //   const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
    //   const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    //   const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
    //   const commentsField = screen.getByTestId("MenuItemReviewForm-comments");

    //   const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    //   expect(idField).toBeInTheDocument();
    //   expect(idField).toHaveValue("17");

    //   expect(itemIdField).toBeInTheDocument();
    //   expect(itemIdField).toHaveValue(33);

    //   expect(reviewerEmailField).toBeInTheDocument();
    //   expect(reviewerEmailField).toHaveValue("JackL@ucsb.edu");

    //   expect(starsField).toBeInTheDocument();
    //   expect(starsField).toHaveValue(3);

    //   expect(dateReviewedField).toBeInTheDocument();
    //   expect(dateReviewedField).toHaveValue("2025-10-26T12:00");

    //   expect(commentsField).toBeInTheDocument();
    //   expect(commentsField).toHaveValue("It was average");

    //   expect(submitButton).toHaveTextContent("Update");

    //   fireEvent.change(nameField, {
    //     target: { value: "Freebirds World Burrito" },
    //   });
    //   fireEvent.change(descriptionField, { target: { value: "Big Burritos" } });

    //   fireEvent.click(submitButton);

    //   await waitFor(() => expect(mockToast).toBeCalled());
    //   expect(mockToast).toBeCalledWith(
    //     "Restaurant Updated - id: 17 name: Freebirds World Burrito",
    //   );
    //   expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
    // });
  });
});
