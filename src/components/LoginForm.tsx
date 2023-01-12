import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { tokenState, userState } from '../recoil/atoms/user';
import { login } from '../utils/api/user';
import { AxiosError } from 'axios';
import UserInput from './UserInput';
import UserForm from './UserForm';
import FormButton from './FormButton';
import { useState } from 'react';
import styled from 'styled-components';
import Divider from './Divider';
import { Link } from 'react-router-dom';
import { COLOR } from '../utils/color';

const RESPONSE_ERROR_MESSAGE =
  'Your email and password combination does not match an account.';

const LoginForm = () => {
  const setUser = useSetRecoilState(userState);
  const setToken = useSetRecoilState(tokenState);

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const {
    handleSubmit,
    resetField,
    control,
    formState: { isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const { user, token } = await login(data);
      setErrorMessages([]);
      setUser(user);
      setToken(token);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError && error.response?.data) {
        if (error.response.data === RESPONSE_ERROR_MESSAGE) {
          setErrorMessages([
            '이메일 또는 비밀번호를 잘못 입력했습니다.',
            '입력하신 내용을 다시 확인해주세요.',
          ]);
        }
      } else {
        setErrorMessages(['서버와 통신 중 문제가 발생했습니다.']);
      }
    }
  };

  return (
    <UserForm onSubmit={handleSubmit(onSubmit)}>
      <UserInput
        control={control}
        name="email"
        placeholder="email"
        rules={{
          required: '이메일을 입력해주세요.',
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
      {errorMessages.length !== 0 && (
        <div>
          {errorMessages.map((errorMessage) => (
            <ErrorMessage key={errorMessage}>{errorMessage}</ErrorMessage>
          ))}
        </div>
      )}
      <FormButton
        type="submit"
        style={{ marginTop: 32 }}
        isSubmitting={isSubmitting}
        isValid={isValid}
      >
        LOG IN
      </FormButton>
      <Divider type="horizontal" size={24} style={{ width: '70%' }} />
      <StyledDiv>
        <span>아직 회원이 아니신가요?</span>
        <StyledLink to="/signup">SIGN UP</StyledLink>
      </StyledDiv>
    </UserForm>
  );
};

export default LoginForm;

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

const StyledDiv = styled.div`
  text-align: center;
  font-family: 'Noto Sans KR' sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 2rem;
  letter-spacing: -0.01em;

  color: ${COLOR.text};
`;

const StyledLink = styled(Link)`
  margin-left: 1rem;
  color: ${COLOR.green};
  text-decoration: none;
`;
