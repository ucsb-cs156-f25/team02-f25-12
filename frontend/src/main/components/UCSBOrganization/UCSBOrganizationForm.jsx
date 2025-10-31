import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function UCSBOrganizationForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {

  const onSubmit = submitAction ?? (() => {});

  const processInactive = (v) => {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v === 1;
    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      return s === "true" || s === "1";
    }
    return false;
  };

  const {
  register,
  formState: { errors },
  handleSubmit,
  } = useForm({
    defaultValues: initialContents
      ? { ...initialContents, inactive: processInactive(initialContents.inactive) }
      : {},
  });

  const navigate = useNavigate();
  const testIdPrefix = "UCSBOrganizationForm";

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid={`${testIdPrefix}-id`}
            id="id"
            type="text"

            {...register("id")}
            defaultValue={initialContents.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgCode">orgCode</Form.Label>
        <Form.Control
          data-testid={`${testIdPrefix}-orgCode`}
          id="orgCode"
          type="text"
          isInvalid={!!errors.orgCode}
          {...register("orgCode", {
            required: "orgCode is required.",
            maxLength: {
              value: 30,
              message: "Max length 30 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgCode?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgTranslationShort">orgTranslationShort</Form.Label>
        <Form.Control
          data-testid={`${testIdPrefix}-orgTranslationShort`}
          id="orgTranslationShort"
          type="text"
          isInvalid={!!errors.orgTranslationShort}
          {...register("orgTranslationShort", {
            required: "orgTranslationShort is required.",
            maxLength: {
              value: 30,
              message: "Max length 30 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgTranslationShort?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgTranslation">orgTranslation</Form.Label>
        <Form.Control
          data-testid={`${testIdPrefix}-orgTranslation`}
          id="orgTranslation"
          type="text"
          isInvalid={!!errors.orgTranslation}
          {...register("orgTranslation", {
            required: "orgTranslation is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgTranslation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          id="inactive"
          label="Inactive"
          data-testid={`${testIdPrefix}-inactive`}
          isInvalid={!!errors.inactive}
          {...register("inactive", {
            required: "Inactive is required.",
          })}
        />
        <Form.Control.Feedback type="invalid" className="d-block">
          {errors.inactive?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid={`${testIdPrefix}-submit`}>
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={`${testIdPrefix}-cancel`}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default UCSBOrganizationForm;
