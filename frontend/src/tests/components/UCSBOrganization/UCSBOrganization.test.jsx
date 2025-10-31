import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBOrganizationForm tests", () => {
  const queryClient = new QueryClient();
  const expectedHeaders = ["orgCode", "orgTranslationShort", "orgTranslation", "Inactive"];
  const testId = "UCSBOrganizationForm";

  const renderForm = (props = {}) =>
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm {...props} />
        </Router>
      </QueryClientProvider>
    );

  test("renders correctly with no initialContents", async () => {
    renderForm();

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    renderForm({ initialContents: ucsbOrganizationFixtures.oneOrganization });

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText("Id")).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    renderForm();

    const cancelButton = await screen.findByTestId(`${testId}-cancel`);
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    renderForm();

    const submitButton = await screen.findByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/orgCode is required/);
    expect(screen.getByText(/orgTranslationShort is required/)).toBeInTheDocument();
    expect(screen.getByText(/orgTranslation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Inactive is required/)).toBeInTheDocument();

    const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
    fireEvent.change(orgCodeInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
    });
  });
  test("all expected data-testids exist (guards against blank data-testid strings)", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>
    );

    const ids = [
      `${testId}-orgCode`,
      `${testId}-orgTranslationShort`,
      `${testId}-orgTranslation`,
      `${testId}-inactive`,
      `${testId}-submit`,
      `${testId}-cancel`,
    ];

    for (const id of ids) {
      expect(await screen.findByTestId(id)).toBeInTheDocument();
    }
  });

  test("defaultValues populate fields (kills mutations that remove/alter defaultValues)", async () => {
    const initial = {
      id: 42,
      orgCode: "ACM",
      orgTranslationShort: "ACM SB",
      orgTranslation: "Association for Computing Machinery",
      inactive: true,
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm initialContents={initial} />
        </Router>
      </QueryClientProvider>
    );

    expect(screen.getByTestId(`${testId}-orgCode`)).toHaveValue("ACM");
    expect(screen.getByTestId(`${testId}-orgTranslationShort`)).toHaveValue("ACM SB");
    expect(screen.getByTestId(`${testId}-orgTranslation`)).toHaveValue(
      "Association for Computing Machinery"
    );

    const inactive = screen.getByTestId(`${testId}-inactive`);
    expect(inactive).toBeChecked();
  });

  test("isInvalid toggles correctly on each field (kills flips of !!errors.<field>)", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>
    );

    const submitButton = await screen.findByTestId(`${testId}-submit`);
    fireEvent.click(submitButton);

    const orgCode = screen.getByTestId(`${testId}-orgCode`);
    const orgTS = screen.getByTestId(`${testId}-orgTranslationShort`);
    const orgT = screen.getByTestId(`${testId}-orgTranslation`);
    const inactive = screen.getByTestId(`${testId}-inactive`);

    const expectInvalid = (el) =>
      expect(
        el.classList.contains("is-invalid") || el.getAttribute("aria-invalid") === "true"
      ).toBe(true);

    const expectValid = (el) =>
      expect(
        !el.classList.contains("is-invalid") && el.getAttribute("aria-invalid") !== "true"
      ).toBe(true);

    await screen.findByText(/orgCode is required/);
    await screen.findByText(/orgTranslationShort is required/);
    await screen.findByText(/orgTranslation is required/);
    await screen.findByText(/Inactive is required/);

    await waitFor(() => {
      expectInvalid(orgCode);
      expectInvalid(orgTS);
      expectInvalid(orgT);
      expectInvalid(inactive);
    });

    fireEvent.change(orgCode, { target: { value: "ACM" } });
    fireEvent.change(orgTS, { target: { value: "ACM SB" } });
    fireEvent.change(orgT, { target: { value: "Association" } });
    fireEvent.click(inactive);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expectValid(orgCode);
      expectValid(orgTS);
      expectValid(orgT);
      expectValid(inactive);
    });
  });


  test("maxLength on orgTranslationShort is enforced (kills empty maxLength object/message mutations)", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>
    );

    const orgTS = await screen.findByTestId(`${testId}-orgTranslationShort`);
    const submitButton = screen.getByTestId(`${testId}-submit`);

    fireEvent.change(orgTS, { target: { value: "x".repeat(31) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
    });
  });

  test("submits boolean for inactive and calls submitAction with expected payload", async () => {
    const submitAction = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm submitAction={submitAction} />
        </Router>
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByTestId(`${testId}-orgCode`), { target: { value: "ACM" } });
    fireEvent.change(screen.getByTestId(`${testId}-orgTranslationShort`), {
      target: { value: "ACM SB" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-orgTranslation`), {
      target: { value: "Association" },
    });

    const inactive = screen.getByTestId(`${testId}-inactive`);
    fireEvent.click(inactive);

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    await waitFor(() => expect(submitAction).toHaveBeenCalledTimes(1));
    const submitted = submitAction.mock.calls[0][0];

    expect(submitted).toMatchObject({
      orgCode: "ACM",
      orgTranslationShort: "ACM SB",
      orgTranslation: "Association",
      inactive: true, 
    });
  });
});

describe("inactive defaultValues normalization", () => {
  const queryClient = new QueryClient();
  const renderWithInactive = (value) => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm initialContents={{
            id: 1,
            orgCode: "X",
            orgTranslationShort: "XS",
            orgTranslation: "Xlong",
            inactive: value,
          }} />
        </Router>
      </QueryClientProvider>
    );
    return screen.getByTestId("UCSBOrganizationForm-inactive");
  };

  test("absent initialContents -> unchecked by default", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>
    );
    const inactive = await screen.findByTestId("UCSBOrganizationForm-inactive");
    expect(inactive).not.toBeChecked();
  });

  describe.each([
    [true, true],
    [1, true],
    ["1", true],
    ["true", true],
    [" TRUE ", true],

    [false, false],
    [0, false],
    ["0", false],
    ["false", false],
    [" FALSE ", false],
    [null, false],
    [undefined, false],
    ["", false],
    ["yes", false],
    ["no", false],
  ])("inactive=%p => checked=%p", (input, expectedChecked) => {
    test(`coerces to ${expectedChecked}`, () => {
      const checkbox = renderWithInactive(input);
      if (expectedChecked) {
        expect(checkbox).toBeChecked();
      } else {
        expect(checkbox).not.toBeChecked();
      }
    });
  });
});
