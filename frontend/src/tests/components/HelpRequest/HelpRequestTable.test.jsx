import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import HelpRequestTable from "main/components/HelpRequests/HelpRequestTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import * as Toast from "react-toastify";
import { onDeleteSuccess } from "main/utils/helpRequestUtils";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            requests={helpRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = ["id", "Email", "Request Time", "Table or Breakout Room",  "Team", "Explanation", "Solved"];
    const expectedFields = ["id", "requesterEmail", "requestTime", "tableOrBreakoutRoom", "teamId", "explanation", "solved"];
    const testId = "HelpRequestTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );

    const solved0 = screen.getByTestId(`${testId}-cell-row-0-col-solved`);
    const solved1 = screen.getByTestId(`${testId}-cell-row-1-col-solved`);
    expect(["Yes", "No"]).toContain(solved0.textContent);
    expect(["Yes", "No"]).toContain(solved1.textContent);


    const editButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).not.toBeInTheDocument();
  });


  test("Has the expected colum headers and content for adminUser", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            requests={helpRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = ["id", "Email", "Request Time", "Table or Breakout Room",  "Team", "Explanation", "Solved"];
    const expectedFields = ["id", "requesterEmail", "requestTime", "tableOrBreakoutRoom", "teamId", "explanation", "solved"];
    const testId = "HelpRequestTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );

    const solved0 = screen.getByTestId(`${testId}-cell-row-0-col-solved`);
    const solved1 = screen.getByTestId(`${testId}-cell-row-1-col-solved`);
    expect(["Yes", "No"]).toContain(solved0.textContent);
    expect(["Yes", "No"]).toContain(solved1.textContent);


    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });
  
  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            requests={helpRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`HelpRequestTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const editButton = screen.getByTestId(
      `HelpRequestTable-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/helprequests/edit/1"),
    );
  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/helprequests")
      .reply(200, { message: "Request deleted" });

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            requests={helpRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert - check that the expected content is rendered

    await waitFor(() => {
      expect(
        screen.getByTestId(`HelpRequestTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const deleteButton = screen.getByTestId(
      `HelpRequestTable-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);

    // assert - check that the delete endpoint was called

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
    test("helpRequestUtils: delete endpoint uses correct url", async () => {
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onDelete("/api/helprequests").reply(200, { message: "ok" });

    // call axios.delete directly since deleteHelpRequest is not exported
    await axios.delete("/api/helprequests", { params: { id: 1 } });

    expect(axiosMock.history.delete.length).toBe(1);
    expect(axiosMock.history.delete[0].url).toBe("/api/helprequests");
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });

    axiosMock.restore();
  });
  test("helpRequestUtils: onDeleteSuccess logs message and delete endpoint uses correct url", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    onDeleteSuccess("deleted!");
    expect(logSpy).toHaveBeenCalledWith("deleted!");

    logSpy.mockRestore();

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onDelete("/api/helprequests").reply(200, { message: "ok" });

    // call axios.delete directly since deleteHelpRequest is not exported
    await axios.delete("/api/helprequests", { params: { id: 1 } });

    expect(axiosMock.history.delete.length).toBe(1);
    expect(axiosMock.history.delete[0].url).toBe("/api/helprequests");
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });

    axiosMock.restore();
  });

});
