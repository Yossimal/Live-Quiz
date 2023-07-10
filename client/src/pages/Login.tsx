import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import { Checkbox } from 'primereact/checkbox'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils';
import '../css/Form.css';
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { CurrentUser, LoginMutation } from '../types'

type FormData = LoginMutation & { remember: boolean }

type FormProps = 'email' | 'password'

export default function Login() {
    const navigate = useNavigate()
    const toast = useRef<Toast>(null)
    const defaultValues: FormData = {
        email: '',
        password: '',
        remember: false
    }
    // const [formData, setFormData] = useState<FormData>(defaultValues)
    const { login } = useAuth()!
    const { control, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues })

    const showSuccess = (user: CurrentUser) => {
        toast?.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: `Welcome ${user.user.firstName} ${user.user.lastName}!`,
            life: 3000
        })
    }

    const showError = (message: string) => {
        toast?.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000
        })
    }

    const onSubmit = async (data: FormData) => {
        // setFormData(data)

        console.log(data)
        const user = await login(data)
        if (!user) {
            showError('Login failed')
            return
        }
        showSuccess(user)
        navigate('/home')
        reset()
    }

    const getFormErrorMessage = (name: FormProps) => {
        return errors[name] && <small className="p-error">{errors[name]?.message}</small>
    }

    return (
        <div className="form-demo card flex flex-column align-items-center justify-content-center">
            <Toast ref={toast} />
            <h1 className="text-center">Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid mb-3 flex-column flex gap-2">
                <div className="field">
                    <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-envelope" />
                        <Controller name="email" control={control}
                            rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' } }}
                            render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                        <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Email*</label>
                    </span>
                    {getFormErrorMessage('email')}
                </div>
                <div className="field">
                    <span className="p-float-label">
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must have at least 8 characters'
                                }
                            }}
                            render={({ field }) => (
                                <Password id="password" feedback={false} {...field} toggleMask className={classNames({ 'p-invalid': errors.password })} />
                            )}
                        />
                        <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                    </span>
                    {getFormErrorMessage('password')}
                </div>
                <div className="field-checkbox">
                    <Controller
                        name="remember"
                        control={control}
                        render={({ field }) => (
                            <Checkbox inputId="remember" {...field} onChange={(e) => field.onChange(e.checked!)} checked={field.value} />
                        )}
                    />
                    <label htmlFor="remember">Remember me</label>
                </div>
                <Button type="submit" label="Login" className="p-mt-2" />
            </form>
            <Link to="/signup">Dont have account? Signup</Link>
        </div>
    )
}








