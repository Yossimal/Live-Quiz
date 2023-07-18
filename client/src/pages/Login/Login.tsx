import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuthenticate, useCredentials } from "../../hooks/authHooks";
import { LoginMutation } from "../../types/auth";
import logo from "../../assets/apple-touch-icon.png";
import { ProgressSpinner } from 'primereact/progressspinner';


type FormData = LoginMutation & { remember: boolean };

type FormProps = "email" | "password";

export default function Login() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);

  const defaultValues: FormData = {
    email: "",
    password: "",
    remember: false,
  };
  const { login } = useAuthenticate();
  const user = useCredentials();

  useEffect(() => {
    if (!user) return;
    navigate("/home");
    reset();
  }, [user]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const onSubmit = async (data: FormData) => {

    console.log(data);
    setLoading(true);
    const loginError = await login(data);
    setLoading(false);
    if (loginError) {
      showError(loginError);
      return;
    }

  };

  const showError = (message: string) => {
    if (!toast.current) return;
    toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  }

  const getFormErrorMessage = (name: FormProps) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  return (
    <div className={`flex align-items-center justify-content-center`}>
      <Toast ref={toast} />
      <div className="surface-card p-5 mt-3 shadow-2 border-round w-full lg:w-6">

        <div className="text-center mb-5">
          <img src={logo} alt="logo" height={50} className="mb-2" />
          <h1 className="text-900 text-3xl font-medium mb-3">Welcome Back</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid flex flex-column gap-2">
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
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must have at least 8 characters",
                  },
                }}
                render={({ field }) => (
                  <Password
                    id="password"
                    feedback={false}
                    {...field}
                    toggleMask
                    className={classNames({ "p-invalid": errors.password })}
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
          <div className="flex align-items-center justify-content-between">
            <div className="field-checkbox">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    inputId="remember"
                    {...field}
                    onChange={(e) => field.onChange(e.checked!)}
                    checked={field.value}
                  />
                )}
              />
              <label htmlFor="remember">Remember me</label>

            </div>
            <Link to="/" className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</Link>

          </div>
          <Button type="submit" label="Login" className={`${!loading ? 'block' : 'hidden'} p-mt-2`} />
          <ProgressSpinner className={loading ? 'block' : 'hidden'} />
        </form>
        <Link className="font-medium no-underline text-blue-500 text-right cursor-pointer" to="/signup">Dont have account? Signup</Link>
      </div>
    </div>
  );
}
