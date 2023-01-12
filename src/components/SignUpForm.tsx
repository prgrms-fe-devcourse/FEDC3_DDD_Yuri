import { useForm } from 'react-hook-form';
import { signUp } from '../utils/api/user';
import { AxiosError } from 'axios';
import UserInput from './UserInput';
import UserForm from './UserForm';
import FormButton from './FormButton';
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { COLOR } from '../utils/color';

const RESPONSE_ERROR_MESSAGE = 'The email address is already being used.';

const SignUpForm = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    handleSubmit,
    resetField,
    watch,
    control,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: {
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      await signUp(data);
      setErrorMessage('');
      alert('가입되었습니다.');
      navigate('/login');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        if (error.response?.data === RESPONSE_ERROR_MESSAGE) {
          setErrorMessage('이미 사용중인 이메일입니다.');
        }
      } else {
        alert('서버와 통신 중 문제가 발생했습니다.');
      }
    }
  };

  return (
    <UserForm onSubmit={handleSubmit(onSubmit)}>
      <UserInput
        control={control}
        name="fullName"
        placeholder="user name"
        rules={{
          required: '이름을 입력해주세요.',
        }}
        resetField={resetField}
      />
      <UserInput
        control={control}
        name="email"
        placeholder="email"
        rules={{
          required: '이메일을 입력해주세요.',
          pattern: {
            value: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: '올바르지 않은 형식입니다.',
          },
        }}
        resetField={resetField}
      />
      <UserInput
        control={control}
        name="password"
        placeholder="password"
        type="password"
        rules={{
          required: '비밀번호를 입력해주세요.',
        }}
        resetField={resetField}
      />
      <UserInput
        control={control}
        name="confirmPassword"
        placeholder="password check"
        type="password"
        rules={{
          required: '비밀번호를 입력해주세요.',
          validate: (value) =>
            value === watch('password') || '비밀번호가 일치하지 않습니다.',
        }}
        resetField={resetField}
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <FormButton
        type="submit"
        style={{ marginTop: 32 }}
        isSubmitting={isSubmitting}
        isValid={isValid}
      >
        SIGN UP
      </FormButton>
    </UserForm>
  );
};

export default SignUpForm;

const ErrorMessage = styled.span`
  display: block;
  text-align: center;
  font-family: 'Inter' sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 1.3rem;
  line-height: 1.6rem;
  letter-spacing: -0.01em;

  color: ${COLOR.orange};
`;
