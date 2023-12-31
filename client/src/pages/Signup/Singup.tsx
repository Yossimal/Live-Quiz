//import { useAuth } from '../../hooks/authHooks'
import { useAuthenticate } from "../../hooks/authHooks";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Password } from "primereact/password";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { useNavigate, Link } from "react-router-dom";
import { SingupData } from "../../types/auth";
import logo from "../../assets/apple-touch-icon.png";
import { ProgressSpinner } from 'primereact/progressspinner';


type FormData = SingupData & { confirmPassword: string; accept: boolean };

type FormProps =
  | "firstName"
  | "lastName"
  | "email"
  | "password"
  | "confirmPassword"
  | "accept";

export default function Singup() {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [showErorrMessage, setShowErorrMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const defaultValues: FormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: new Date("1995-01-01"),
    accept: false,
  };
  const [formData, setFormData] = useState(defaultValues);
  const { signup } = useAuthenticate()!;

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({ defaultValues });

  const onSubmit = async (data: FormData) => {
    setFormData(data);
    setLoading(true);
    const err = await signup(data);
    setLoading(false);
    if (err) {
      setShowErorrMessage(true);
    } else {
      setShowMessage(true);
      navigate("/");
      reset();
    }
  };

  const getFormErrorMessage = (name: FormProps) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => {
          setShowMessage(false);
          setShowErorrMessage(false);
        }}
      />
    </div>
  );
  const passwordHeader = <h6>Pick a password</h6>;
  const passwordFooter = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </>
  );

  return (
    <div>
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position="top"
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "30vw" }}
      >
        <div className="flex justify-content-center flex-column pt-6 px-3">
          <i
            className="pi pi-check-circle"
            style={{ fontSize: "3rem", color: "var(--green-500)" }}
          ></i>
          <h2>Registration Successful!</h2>
          <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
            Your account is registered under name{" "}
            <b>{`${formData.firstName} ${formData.lastName}`}</b> ; it'll be
            valid next 30 days without activation. Please check{" "}
            <b>{formData.email}</b> for activation instructions.
          </p>
        </div>
      </Dialog>

      <Dialog
        visible={showErorrMessage}
        onHide={() => setShowErorrMessage(false)}
        position="top"
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "30vw" }}
      >
        <div className="flex justify-content-center flex-column pt-6 px-3">
          <i
            className="pi pi-times"
            style={{ fontSize: "3rem", color: "var(--red-500)" }}
          ></i>
          <h2>Registration Faild 😰</h2>
          <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
            please try agein later
          </p>
        </div>
      </Dialog>

      <div className={` flex align-items-center justify-content-center`}>
        <div className="surface-card p-5 mt-3 shadow-2 border-round w-full lg:w-6">

          <div className="text-center mb-5">
            <img src={logo} alt="logo" height={50} className="mb-2" />
            <h1 className="text-900 text-3xl font-medium mb-3">Get Start!</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid flex flex-column gap-2">
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "First Name is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="firstName"
                  className={classNames({ "p-error": errors.firstName })}
                >
                  First Name*
                </label>
              </span>
              {getFormErrorMessage("firstName")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "First Name is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="lastName"
                  className={classNames({ "p-error": errors.lastName })}
                >
                  Last Name*
                </label>
              </span>
              {getFormErrorMessage("lastName")}
            </div>
            <div className="field">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-envelope" />
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address. E.g. example@email.com",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="email"
                  className={classNames({ "p-error": !!errors.email })}
                >
                  Email*
                </label>
              </span>
              {getFormErrorMessage("email")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Password is required." }}
                  render={({ field, fieldState }) => (
                    <Password
                      id={field.name}
                      {...field}
                      toggleMask
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                      header={passwordHeader}
                      footer={passwordFooter}

                    />
                  )}
                />
                <label
                  htmlFor="password"
                  className={classNames({ "p-error": errors.password })}
                >
                  Password*
                </label>
              </span>
              {getFormErrorMessage("password")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: "Confirm Password is required.",
                    validate: (val) => {
                      if (val !== watch("password")) {
                        return "Your passwords do no match";
                      }
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Password
                      feedback={false}
                      id={field.name}
                      {...field}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="confirmPassword"
                  className={classNames({ "p-error": errors.password })}
                >
                  Confirm Password*
                </label>
              </span>
              {getFormErrorMessage("confirmPassword")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="birthday"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      id={field.name}
                      value={field.value}
                      onChange={(e: CheckboxChangeEvent) =>
                        field.onChange(e.value)
                      }
                      dateFormat="dd/mm/yy"
                      mask="99/99/9999"
                      showIcon
                    />
                  )}
                />
                <label htmlFor="birthday">Birthday</label>
              </span>
            </div>
            <div className="field-checkbox">
              <Controller
                name="accept"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Checkbox
                    inputId={field.name}
                    onChange={(e) => field.onChange(e.checked!)}
                    checked={field.value}
                    className={classNames({ "p-invalid": fieldState.invalid })}
                  />
                )}
              />
              <label
                htmlFor="accept"
                className={classNames({ "p-error": errors.accept })}
              >
                I agree to the terms and conditions*
              </label>
            </div>

            <Button type="submit" label="Singup" className={`${!loading ? 'block' : 'hidden'} p-mt-2`} />
            <ProgressSpinner className={loading ? 'block' : 'hidden'} />
          </form>
          <Link to="/" className="font-medium no-underline text-blue-500 text-right cursor-pointerp-d-block p-text-center mt-2">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
