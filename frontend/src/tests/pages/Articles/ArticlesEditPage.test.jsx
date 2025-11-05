import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

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
describe("ArticlesEditPage tests", () => {
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(screen.queryByTestId("Article-title")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id: 17,
        title: "A",
        url: "A",
        explanation: "A",
        email: "A",
        dateAdded: "2025-11-04T17:02:00",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: "17",
        title: "A Burrito",
        url: "A Burrito",
        explanation: "A Burrito",
        email: "A Burrito",
        dateAdded: "2025-11-04T17:03:00",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-id");

      const idField = screen.getByTestId("ArticleForm-id");
      const titleField = screen.getByTestId("ArticleForm-title");
      const urlField = screen.getByTestId("ArticleForm-url");
      const explanationField = screen.getByTestId("ArticleForm-explanation");
      const emailField = screen.getByTestId("ArticleForm-email");
      const dateAddedField = screen.getByTestId("ArticleForm-dateAdded");
      const submitButton = screen.getByTestId("ArticleForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(titleField).toBeInTheDocument();
      expect(titleField).toHaveValue("A");
      expect(urlField).toBeInTheDocument();
      expect(urlField).toHaveValue("A");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("A");
      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue("A");
      expect(dateAddedField).toBeInTheDocument();
      expect(dateAddedField).toHaveValue("2025-11-04T17:02");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(titleField, {
        target: { value: "A Burrito" },
      });
      fireEvent.change(urlField, {
        target: { value: "A Burrito" },
      });
      fireEvent.change(explanationField, {
        target: { value: "A Burrito" },
      });
      fireEvent.change(emailField, {
        target: { value: "A Burrito" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2025-11-04T17:03:00" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Article Updated - id: 17 title: A Burrito",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "A Burrito",
          url: "A Burrito",
          explanation: "A Burrito",
          email: "A Burrito",
          dateAdded: "2025-11-04T17:03",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-id");

      const idField = screen.getByTestId("ArticleForm-id");
      const titleField = screen.getByTestId("ArticleForm-title");
      const urlField = screen.getByTestId("ArticleForm-url");
      const explanationField = screen.getByTestId("ArticleForm-explanation");
      const emailField = screen.getByTestId("ArticleForm-email");
      const dateAddedField = screen.getByTestId("ArticleForm-dateAdded");
      const submitButton = screen.getByTestId("ArticleForm-submit");

      expect(idField).toHaveValue("17");
      expect(titleField).toHaveValue("A");
      expect(urlField).toHaveValue("A");
      expect(explanationField).toHaveValue("A");
      expect(emailField).toHaveValue("A");
      expect(dateAddedField).toHaveValue("2025-11-04T17:02");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(titleField, {
        target: { value: "A Burrito" },
      });
      fireEvent.change(urlField, {
        target: { value: "A Burrito" },
      });
      fireEvent.change(explanationField, {
        target: { value: "A Burrito" },
      });
      fireEvent.change(emailField, {
        target: { value: "A Burrito" },
      });
      fireEvent.change(dateAddedField, {
        target: { value: "2025-11-04T17:03:00" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Article Updated - id: 17 title: A Burrito",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/articles" });
    });
  });
});
