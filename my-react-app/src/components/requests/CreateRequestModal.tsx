import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    clientName: string;
    title: string;
    description: string;
  }) => Promise<{
    success: boolean;
    message?: string;
  }>;
}

interface FormState {
  clientName: string;
  title: string;
  description: string;
}

const initialForm: FormState = {
  clientName: "",
  title: "",
  description: "",
};

export default function CreateRequestModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateRequestModalProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitError("");
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (form.clientName.trim().length < 2) {
      nextErrors.clientName = "Client name must contain at least 2 characters";
    }

    if (form.title.trim().length < 2) {
      nextErrors.title = "Title must contain at least 2 characters";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setSubmitError("");

    const result = await onSubmit({
      clientName: form.clientName.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
    });

    setLoading(false);

    if (!result.success) {
      setSubmitError(result.message ?? "Unable to create request");
      return;
    }

    setForm(initialForm);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    if (loading) return;

    setForm(initialForm);
    setErrors({});
    setSubmitError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Request">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Client name"
          placeholder="John Doe"
          value={form.clientName}
          onChange={(event) => updateField("clientName", event.target.value)}
          error={errors.clientName}
          disabled={loading}
        />

        <Input
          label="Title"
          placeholder="Website redesign"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          error={errors.title}
          disabled={loading}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            rows={5}
            placeholder="Describe the client request..."
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            disabled={loading}
            className={`w-full resize-none rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50 ${
              errors.description ? "border-red-500" : "border-slate-200"
            }`}
          />

          {errors.description && (
            <p className="text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        {submitError && (
          <div className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button type="submit" loading={loading}>
            Create Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}
